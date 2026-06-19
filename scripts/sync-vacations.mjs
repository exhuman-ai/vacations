#!/usr/bin/env node
// Daily Slack -> data.js sync.
//
// Pulls new messages from a Slack channel (typically #vacations), asks an LLM
// to extract structured vacation/day-off entries, dedupes against the existing
// VACATIONS array, and appends new rows to data.js. The workflow then commits
// & pushes the file so GitHub Pages re-deploys.
//
// Env:
//   SLACK_BOT_TOKEN     - bot token (channels:history + users:read, or
//                         groups:history for private channels)
//   SLACK_USER_TOKEN    - optional fallback if the bot can't read the channel
//   SLACK_CHANNEL_ID    - e.g. C0123456789 (not the channel name)
//   OPENAI_API_KEY      - used to parse free-form messages
//   OPENAI_MODEL        - optional, defaults to gpt-4o-mini
//   SLACK_LOOKBACK_DAYS - optional fallback window (default 14) if no state

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data.js");
const STATE_PATH = path.join(ROOT, ".sync-state.json");

const SLACK_TOKEN =
  process.env.SLACK_BOT_TOKEN || process.env.SLACK_USER_TOKEN || "";
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const LOOKBACK_DAYS = Number(process.env.SLACK_LOOKBACK_DAYS || "14");

function die(msg) {
  console.error(`sync-vacations: ${msg}`);
  process.exit(1);
}

if (!SLACK_TOKEN) die("SLACK_BOT_TOKEN (or SLACK_USER_TOKEN) is required");
if (!SLACK_CHANNEL_ID) die("SLACK_CHANNEL_ID is required");
if (!OPENAI_API_KEY) die("OPENAI_API_KEY is required");

/* ===== Load existing TEAM + VACATIONS from data.js ===== */
function loadDataJs() {
  const src = fs.readFileSync(DATA_PATH, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "data.js" });
  return {
    src,
    team: sandbox.window.TEAM || [],
    vacations: sandbox.window.VACATIONS || [],
  };
}

const { src: dataSrc, team: TEAM, vacations: VACATIONS } = loadDataJs();

const teamNames = TEAM.map((t) => t.name);
const teamSet = new Set(teamNames);
const dedupeKey = (e) => `${e.person}|${e.type}|${e.start}|${e.end}`;
const existingKeys = new Set(VACATIONS.map(dedupeKey));

/* ===== State ===== */
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return {};
  }
}
function saveState(s) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2) + "\n", "utf8");
}
const state = loadState();

/* ===== Slack ===== */
async function slack(method, params = {}, opts = {}) {
  const url = new URL(`https://slack.com/api/${method}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
  });
  const json = await res.json();
  if (!json.ok && !opts.allowError) {
    throw new Error(`Slack ${method} failed: ${json.error}`);
  }
  return json;
}

let userCache = null;
async function loadUserMap() {
  if (userCache) return userCache;
  userCache = new Map();
  let cursor;
  do {
    const r = await slack("users.list", { limit: 200, cursor });
    for (const u of r.members || []) {
      const real = u.profile?.real_name || u.real_name || u.name;
      const display = u.profile?.display_name || "";
      userCache.set(u.id, { real, display });
    }
    cursor = r.response_metadata?.next_cursor || "";
  } while (cursor);
  return userCache;
}

function substituteMentions(text, users) {
  return text.replace(/<@([A-Z0-9]+)>/g, (_, id) => {
    const u = users.get(id);
    return u ? `@${u.real || u.display || id}` : `@${id}`;
  });
}

async function fetchMessages(oldestTs) {
  const messages = [];
  let cursor;
  do {
    const r = await slack("conversations.history", {
      channel: SLACK_CHANNEL_ID,
      oldest: oldestTs || undefined,
      inclusive: false,
      limit: 200,
      cursor,
    });
    for (const m of r.messages || []) {
      if (m.subtype && m.subtype !== "thread_broadcast") continue;
      if (!m.text || !m.ts) continue;
      messages.push({ ts: m.ts, user: m.user, text: m.text });
    }
    cursor = r.response_metadata?.next_cursor || "";
  } while (cursor);
  // Slack returns newest first; we want chronological order.
  messages.reverse();
  return messages;
}

/* ===== OpenAI ===== */
function buildPrompt(message, currentYear) {
  const knownNames = teamNames.join(", ");
  return `You convert a free-form Slack message about a team member's
day-off or vacation into structured JSON.

Known team members (use one of these exact strings for "person"):
${knownNames}

Output a JSON object with this shape:
{
  "entries": [
    {
      "person": "<one of the known team members above>",
      "type":   "vacation" | "dayoff",
      "start":  "YYYY-MM-DD",
      "end":    "YYYY-MM-DD",
      "note":   "short English note, or empty string"
    }
  ]
}

Rules:
- Use the message's posting context to resolve ambiguous dates. The current
  year is ${currentYear}. If the message names a month without a year, assume
  the closest future occurrence within the next 12 months.
- "вакация" / "отпуск" / "vacation" / "palm tree" / multi-day trips => "vacation".
  Single sick day, "day off", "дей офф", "дейофф", "off", "недоступен" => "dayoff".
- "сегодня" => today's date relative to the message timestamp. Convert relative
  phrases ("на завтра", "следующая пятница 16.02") into absolute ISO dates.
- For half-day requests, still emit a single-day entry and put "Half day" in note.
- For ranges expressed as "8-9 января" or "с 27.04 по 04.05", set start and end
  inclusively.
- If the message is *not* a request for time off (e.g. a joke, a thank-you,
  a status update with no dates), return {"entries": []}.
- Always return strictly valid JSON. No prose, no markdown fences.

Message (posted on ${message.dateIso} UTC by ${message.author}):
"""
${message.text}
"""`;
}

async function extractEntries(message) {
  const body = {
    model: OPENAI_MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You extract structured time-off entries from informal Slack messages. Reply with JSON only.",
      },
      { role: "user", content: buildPrompt(message, message.dateIso.slice(0, 4)) },
    ],
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.warn(`Skipping malformed LLM reply for ${message.ts}: ${e.message}`);
    return [];
  }
  const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
  return entries.filter(validateEntry);
}

function validateEntry(e) {
  if (!e || typeof e !== "object") return false;
  if (typeof e.person !== "string" || !teamSet.has(e.person)) return false;
  if (e.type !== "vacation" && e.type !== "dayoff") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.start)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.end)) return false;
  if (e.end < e.start) return false;
  if (typeof e.note !== "string") e.note = "";
  return true;
}

/* ===== Append new entries to data.js ===== */
function serializeEntry(e) {
  const pad = (s, n) => (s.length >= n ? s : s + " ".repeat(n - s.length));
  const person = pad(`"${e.person}",`, 14);
  const type = pad(`"${e.type}",`, 11);
  const note = (e.note || "").replace(/"/g, '\\"');
  return `  { person: ${person} type: ${type} start: "${e.start}", end: "${e.end}", note: "${note}" },`;
}

function appendEntries(newEntries) {
  if (!newEntries.length) return false;
  const lines = newEntries.map(serializeEntry).join("\n");
  const block = `\n  // Synced from Slack on ${new Date().toISOString().slice(0, 10)}\n${lines}\n`;

  // Insert before the final "];" that closes window.VACATIONS.
  const idx = dataSrc.lastIndexOf("];");
  if (idx === -1) {
    console.error("Could not find closing '];' in data.js");
    return false;
  }
  const next = dataSrc.slice(0, idx) + block + dataSrc.slice(idx);
  fs.writeFileSync(DATA_PATH, next, "utf8");
  return true;
}

/* ===== Main ===== */
async function main() {
  const users = await loadUserMap();

  const lastTs = state.lastTs;
  let oldestTs = lastTs;
  if (!oldestTs) {
    const fallback = Math.floor(Date.now() / 1000) - LOOKBACK_DAYS * 86400;
    oldestTs = String(fallback);
    console.log(
      `No prior state, fetching last ${LOOKBACK_DAYS} days (oldest=${oldestTs}).`
    );
  } else {
    console.log(`Resuming sync from ts=${oldestTs}.`);
  }

  const messages = await fetchMessages(oldestTs);
  console.log(`Fetched ${messages.length} new messages.`);

  const newEntries = [];
  let maxTs = lastTs || oldestTs;
  for (const m of messages) {
    if (Number(m.ts) > Number(maxTs)) maxTs = m.ts;
    const author = (users.get(m.user)?.real || m.user) ?? "unknown";
    const dateIso = new Date(Number(m.ts) * 1000).toISOString().slice(0, 10);
    const text = substituteMentions(m.text, users);
    let entries = [];
    try {
      entries = await extractEntries({ ts: m.ts, author, dateIso, text });
    } catch (e) {
      console.warn(`extract failed for ${m.ts}: ${e.message}`);
      continue;
    }
    for (const e of entries) {
      const key = dedupeKey(e);
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      newEntries.push(e);
      console.log(
        `+ ${e.person} ${e.type} ${e.start}..${e.end} ${e.note ? `(${e.note})` : ""}`
      );
    }
  }

  if (newEntries.length) appendEntries(newEntries);
  else console.log("No new vacation entries to add.");

  state.lastTs = maxTs;
  state.lastRunIso = new Date().toISOString();
  saveState(state);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
