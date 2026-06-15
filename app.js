(function () {
  const TEAM = window.TEAM || [];
  const VACATIONS = (window.VACATIONS || []).slice().sort(
    (a, b) => a.start.localeCompare(b.start) || a.person.localeCompare(b.person)
  );

  const MONTHS_RU = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];

  const fmtDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
  };

  const fmtRange = (s, e) => (s === e ? fmtDate(s) : `${fmtDate(s)} — ${fmtDate(e)}`);

  function dateFromIso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function diffDays(a, b) {
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
  }

  function addDays(d, n) {
    const r = new Date(d);
    r.setUTCDate(r.getUTCDate() + n);
    return r;
  }

  function initials(name) {
    return name
      .replace(/[_]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  /* ===== Team grid ===== */
  function renderTeam() {
    const grid = document.getElementById("team-grid");
    grid.innerHTML = TEAM.map((m) => `
      <div class="member" title="${m.name}">
        <div class="avatar">${initials(m.name)}</div>
        <div class="meta">
          <div>${m.name}</div>
          <div class="role">${m.role}</div>
        </div>
      </div>
    `).join("");
    document.getElementById("team-count").textContent = `${TEAM.length} people`;
  }

  /* ===== Timeline ===== */
  function renderTimeline(filtered) {
    const wrap = document.getElementById("timeline");
    if (!filtered.length) {
      wrap.innerHTML = `<div style="padding:24px;color:var(--muted);">No vacations match your filters.</div>`;
      return;
    }

    const minIso = filtered.reduce((m, v) => (v.start < m ? v.start : m), filtered[0].start);
    const maxIso = filtered.reduce((m, v) => (v.end > m ? v.end : m), filtered[0].end);

    let start = dateFromIso(minIso);
    start = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
    let end = dateFromIso(maxIso);
    end = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0));

    const totalDays = diffDays(start, end) + 1;
    const dayW = 18;
    const gridW = totalDays * dayW;

    // Build months header.
    const months = [];
    let cursor = new Date(start);
    while (cursor <= end) {
      const y = cursor.getUTCFullYear();
      const m = cursor.getUTCMonth();
      const monthStart = new Date(Date.UTC(y, m, 1));
      const monthEnd = new Date(Date.UTC(y, m + 1, 0));
      const startInRange = monthStart < start ? start : monthStart;
      const endInRange = monthEnd > end ? end : monthEnd;
      const days = diffDays(startInRange, endInRange) + 1;
      months.push({ label: MONTHS_RU[m], year: y, days });
      cursor = new Date(Date.UTC(y, m + 1, 1));
    }

    // Group rows by person, preserving team order.
    const byPerson = new Map();
    for (const v of filtered) {
      if (!byPerson.has(v.person)) byPerson.set(v.person, []);
      byPerson.get(v.person).push(v);
    }
    const order = TEAM.map((t) => t.name).filter((n) => byPerson.has(n));
    for (const extra of byPerson.keys()) if (!order.includes(extra)) order.push(extra);

    const monthsHtml = months
      .map(
        (mo) =>
          `<div class="tl-month" style="width:${mo.days * dayW}px"><strong>${mo.label}</strong><small>${mo.year}</small></div>`
      )
      .join("");

    const sideRows = order
      .map(
        (name, i) =>
          `<div class="tl-row ${i % 2 ? "even" : ""}" title="${name}">${name}</div>`
      )
      .join("");

    let dayLines = "";
    for (let i = 0; i <= totalDays; i++) {
      const d = addDays(start, i);
      const isMonthBoundary = d.getUTCDate() === 1;
      dayLines += `<div class="tl-day-line${isMonthBoundary ? " month" : ""}" style="left:${i * dayW}px"></div>`;
    }

    const gridRows = order
      .map((name, i) => {
        const bars = byPerson
          .get(name)
          .map((v) => {
            const s = dateFromIso(v.start);
            const e = dateFromIso(v.end);
            const left = diffDays(start, s) * dayW;
            const width = (diffDays(s, e) + 1) * dayW - 2;
            const lbl = v.note ? `${fmtRange(v.start, v.end)} · ${v.note}` : fmtRange(v.start, v.end);
            return `<div class="bar ${v.type}" style="left:${left}px;width:${width}px" title="${name} — ${lbl}"><span class="lbl">${fmtRange(v.start, v.end)}</span></div>`;
          })
          .join("");
        return `<div class="tl-row ${i % 2 ? "even" : ""}" style="width:${gridW}px">${bars}</div>`;
      })
      .join("");

    // "Today" marker if within range.
    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    let todayHtml = "";
    if (todayUtc >= start && todayUtc <= end) {
      const left = diffDays(start, todayUtc) * dayW + dayW / 2;
      todayHtml = `<div class="tl-today" style="left:${left}px"></div>`;
    }

    wrap.innerHTML = `
      <div class="timeline-wrap">
        <div class="timeline" style="grid-template-columns:180px ${gridW}px;">
          <div class="tl-side">
            <div class="tl-header-row">Team member</div>
            ${sideRows}
          </div>
          <div class="tl-main">
            <div class="tl-header-row" style="width:${gridW}px;">
              <div class="tl-months">${monthsHtml}</div>
            </div>
            <div class="tl-grid" style="width:${gridW}px;">
              <div class="tl-day-grid">${dayLines}</div>
              ${todayHtml}
              ${gridRows}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ===== List view ===== */
  function renderList(filtered) {
    const root = document.getElementById("list");
    if (!filtered.length) {
      root.innerHTML = `<div style="color:var(--muted);">No vacations match your filters.</div>`;
      return;
    }
    const groups = new Map();
    for (const v of filtered) {
      const [y, m] = v.start.split("-");
      const key = `${y}-${m}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(v);
    }
    const keys = [...groups.keys()].sort();
    root.innerHTML = keys
      .map((k) => {
        const [y, m] = k.split("-").map(Number);
        const items = groups
          .get(k)
          .map(
            (v) => `
            <div class="list-item">
              <span class="pill ${v.type}">${v.type === "vacation" ? "Vacation" : "Day off"}</span>
              <span class="who">${v.person}</span>
              <span class="dates">${fmtRange(v.start, v.end)}</span>
              <span class="note">${v.note || ""}</span>
            </div>`
          )
          .join("");
        return `
          <div class="list-month">
            <h3>${MONTHS_RU[m - 1]} ${y}</h3>
            ${items}
          </div>`;
      })
      .join("");
  }

  /* ===== Filters ===== */
  function populatePersonFilter() {
    const sel = document.getElementById("filter-person");
    const names = [...new Set(VACATIONS.map((v) => v.person))].sort();
    sel.innerHTML =
      `<option value="">All people</option>` +
      names.map((n) => `<option value="${n}">${n}</option>`).join("");
  }

  function applyFilters() {
    const q = document.getElementById("filter-q").value.trim().toLowerCase();
    const type = document.getElementById("filter-type").value;
    const person = document.getElementById("filter-person").value;
    const upcomingOnly = document.getElementById("filter-upcoming").checked;
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);

    const filtered = VACATIONS.filter((v) => {
      if (type && v.type !== type) return false;
      if (person && v.person !== person) return false;
      if (upcomingOnly && v.end < todayIso) return false;
      if (q) {
        const hay = `${v.person} ${v.note || ""} ${v.start} ${v.end}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    document.getElementById("vac-count").textContent =
      `${filtered.length} entries`;

    renderTimeline(filtered);
    renderList(filtered);
  }

  /* ===== Boot ===== */
  document.addEventListener("DOMContentLoaded", () => {
    renderTeam();
    populatePersonFilter();
    ["filter-q", "filter-type", "filter-person", "filter-upcoming"].forEach((id) => {
      document.getElementById(id).addEventListener("input", applyFilters);
      document.getElementById(id).addEventListener("change", applyFilters);
    });
    applyFilters();
  });
})();
