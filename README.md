# vacations

Static GitHub Pages site with the team list and a vacation / day-off schedule
for 2026. Names are shown as first name + first letter of surname so the repo
can be public.

Open `index.html` locally, or visit the deployed site at:
<https://exhuman-ai.github.io/vacations/>

## Files

- `index.html` – page markup.
- `styles.css` – styles (dark theme, timeline + list view).
- `app.js` – renders the team grid, timeline (Gantt-style), and list view, with
  filtering by person / type / search / upcoming.
- `data.js` – the team roster and the vacation/day-off entries parsed from the
  Slack thread.

## Updating

Edit `data.js` to add, remove or correct entries — the page is fully static and
re-renders on reload.

### Automatic Slack sync

`scripts/sync-vacations.mjs` together with
`.github/workflows/sync-vacations.yml` keep `data.js` up to date from a Slack
channel. The workflow runs:

- once per day on a cron schedule (`0 6 * * *`),
- on demand via *Run workflow* in the Actions tab,
- on the `repository_dispatch` event `slack-vacation` (trigger from a tiny
  webhook handler when a new Slack message arrives in the channel).

Configure these secrets in *Settings → Secrets and variables → Actions*:

| Secret             | Required | What                                                                                            |
|--------------------|----------|-------------------------------------------------------------------------------------------------|
| `SLACK_BOT_TOKEN`  | yes\*    | Bot token with `channels:history` (or `groups:history` for private channels) and `users:read`. |
| `SLACK_USER_TOKEN` | optional | User token; used as a fallback if `SLACK_BOT_TOKEN` is missing.                                 |
| `SLACK_CHANNEL_ID` | yes      | Channel ID (e.g. `C0123456789`) — *not* the channel name.                                       |
| `OPENAI_API_KEY`   | yes      | Used to parse free-form Slack messages into structured entries.                                 |

`OPENAI_MODEL` and `SLACK_LOOKBACK_DAYS` are optional repository *variables*
(not secrets); they default to `gpt-4o-mini` and `14` respectively.

The script tracks the most recently processed Slack message timestamp in
`.sync-state.json`, dedupes against existing entries by
`(person, type, start, end)`, and appends only new rows. New entries land in
`data.js` and GitHub Pages re-deploys automatically.

To trigger a sync from a Slack webhook handler:

```bash
curl -X POST \
  -H "Authorization: token <GH_PAT_with_repo_scope>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/exhuman-ai/vacations/dispatches \
  -d '{"event_type":"slack-vacation"}'
```

### Entry shape

```js
{ person: "Ivan T.", type: "vacation" | "dayoff",
  start: "2026-MM-DD", end: "2026-MM-DD", note: "optional" }
```

`start` and `end` are inclusive. For a single day, set them to the same value.

## Deployment

GitHub Pages is served from the `main` branch root. After merging changes to
`main`, GitHub Pages will rebuild automatically (enable Pages in repo settings:
*Pages → Source: Deploy from a branch → main / (root)* if it isn't already).
