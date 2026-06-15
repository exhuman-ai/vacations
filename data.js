// Team members and vacation/day-off data parsed from the Slack thread.
// All dates assume 2026 (the year the thread was shared).

window.TEAM = [
  { name: "Ivan Trufanov",      role: "Lead",     emoji: "I"  },
  { name: "Artem R",            role: "Lead",     emoji: "A"  },
  { name: "Anatoly Plotnikov",  role: "Backend",  emoji: "AP" },
  { name: "Aleksei Makarov",    role: "Team",     emoji: "AM" },
  { name: "Serhii",             role: "Team",     emoji: "S"  },
  { name: "Andrei Sokolov",     role: "Team",     emoji: "AS" },
  { name: "Ivan Mikhnenkov",    role: "Team",     emoji: "IM" },
  { name: "Kir",                role: "Team",     emoji: "K"  },
  { name: "Nikolai Baranov",    role: "Team",     emoji: "NB" },
  { name: "Irina Kirichenko",   role: "Team",     emoji: "IK" },
  { name: "Maxim Arteev",       role: "Team",     emoji: "MA" },
  { name: "Ivan Fursov",        role: "Team",     emoji: "IF" },
  { name: "sasha_zhe",          role: "Team",     emoji: "SZ" },
  { name: "Andrey Smirnov",     role: "Team",     emoji: "AS" },
  { name: "Igor Ryazancev",     role: "Team",     emoji: "IR" },
  { name: "Artem Sharganov",    role: "Team",     emoji: "AS" },
  { name: "Sasha",              role: "Team",     emoji: "S"  },
  { name: "Slava Kukushkin",    role: "Team",     emoji: "SK" },
  { name: "Renata A",           role: "Team",     emoji: "RA" },
  { name: "Olya Nechaeva",      role: "Team",     emoji: "ON" },
  { name: "Yuri Burov",         role: "Team",     emoji: "YB" },
  { name: "Max",                role: "Team",     emoji: "M"  },
  { name: "Dmitry Gadecky",     role: "Team",     emoji: "DG" },
  { name: "Daniel Goldin",      role: "Team",     emoji: "DG" },
];

// Vacation / day-off entries. type: "vacation" | "dayoff"
// start / end are ISO yyyy-mm-dd, inclusive.
window.VACATIONS = [
  // January
  { person: "Anatoly Plotnikov", type: "dayoff",   start: "2026-01-08", end: "2026-01-09", note: "Kazakhstan, on call" },
  { person: "Ivan Trufanov",     type: "dayoff",   start: "2026-01-15", end: "2026-01-16", note: "Sick" },
  { person: "Ivan Mikhnenkov",   type: "dayoff",   start: "2026-01-30", end: "2026-01-30", note: "Medical" },

  // February
  { person: "Andrei Sokolov",    type: "vacation", start: "2026-02-02", end: "2026-02-20", note: "Vacation" },
  { person: "Ivan Fursov",       type: "vacation", start: "2026-02-04", end: "2026-02-13", note: "~1.5 weeks, reachable via text" },
  { person: "Andrey Smirnov",    type: "dayoff",   start: "2026-02-06", end: "2026-02-06", note: "" },
  { person: "Artem Sharganov",   type: "dayoff",   start: "2026-02-11", end: "2026-02-11", note: "" },
  { person: "Igor Ryazancev",    type: "dayoff",   start: "2026-02-12", end: "2026-02-13", note: "" },
  { person: "Sasha",             type: "dayoff",   start: "2026-02-16", end: "2026-02-16", note: "" },
  { person: "Ivan Mikhnenkov",   type: "dayoff",   start: "2026-02-16", end: "2026-02-16", note: "" },
  { person: "Slava Kukushkin",   type: "dayoff",   start: "2026-02-18", end: "2026-02-18", note: "" },
  { person: "Kir",               type: "dayoff",   start: "2026-02-19", end: "2026-02-20", note: "" },
  { person: "sasha_zhe",         type: "vacation", start: "2026-02-23", end: "2026-02-27", note: "Israel" },

  // March
  { person: "Renata A",          type: "dayoff",   start: "2026-03-04", end: "2026-03-04", note: "Conference" },
  { person: "Serhii",            type: "dayoff",   start: "2026-03-09", end: "2026-03-09", note: "" },
  { person: "Anatoly Plotnikov", type: "dayoff",   start: "2026-03-09", end: "2026-03-09", note: "" },
  { person: "Andrei Sokolov",    type: "vacation", start: "2026-03-25", end: "2026-03-27", note: "" },
  { person: "sasha_zhe",         type: "vacation", start: "2026-03-30", end: "2026-04-13", note: "Japan" },

  // April
  { person: "Nikolai Baranov",   type: "dayoff",   start: "2026-04-03", end: "2026-04-03", note: "" },
  { person: "Serhii",            type: "dayoff",   start: "2026-04-03", end: "2026-04-03", note: "Half day off (afternoon)" },
  { person: "Yuri Burov",        type: "vacation", start: "2026-04-06", end: "2026-04-10", note: "" },
  { person: "Slava Kukushkin",   type: "dayoff",   start: "2026-04-06", end: "2026-04-06", note: "" },
  { person: "Olya Nechaeva",     type: "dayoff",   start: "2026-04-06", end: "2026-04-07", note: "Birthday" },
  { person: "Ivan Fursov",       type: "dayoff",   start: "2026-04-06", end: "2026-04-06", note: "" },
  { person: "Ivan Fursov",       type: "dayoff",   start: "2026-04-10", end: "2026-04-10", note: "" },
  { person: "Max",               type: "dayoff",   start: "2026-04-13", end: "2026-04-14", note: "" },
  { person: "Anatoly Plotnikov", type: "dayoff",   start: "2026-04-15", end: "2026-04-15", note: "" },
  { person: "Max",               type: "dayoff",   start: "2026-04-21", end: "2026-04-21", note: "" },
  { person: "Dmitry Gadecky",    type: "dayoff",   start: "2026-04-21", end: "2026-04-21", note: "Flight" },
  { person: "Serhii",            type: "dayoff",   start: "2026-04-24", end: "2026-04-24", note: "" },
  { person: "Anatoly Plotnikov", type: "vacation", start: "2026-04-27", end: "2026-05-04", note: "" },
  { person: "Daniel Goldin",     type: "vacation", start: "2026-04-27", end: "2026-05-04", note: "" },
  { person: "Dmitry Gadecky",    type: "dayoff",   start: "2026-04-28", end: "2026-04-28", note: "Flight" },
  { person: "Slava Kukushkin",   type: "dayoff",   start: "2026-04-29", end: "2026-04-29", note: "" },
  { person: "Maxim Arteev",      type: "dayoff",   start: "2026-04-30", end: "2026-04-30", note: "" },

  // May
  { person: "Igor Ryazancev",    type: "dayoff",   start: "2026-05-05", end: "2026-05-06", note: "" },
  { person: "Max",               type: "dayoff",   start: "2026-05-05", end: "2026-05-05", note: "Forced" },
  { person: "Nikolai Baranov",   type: "vacation", start: "2026-05-13", end: "2026-05-15", note: "" },
  { person: "Ivan Fursov",       type: "vacation", start: "2026-05-14", end: "2026-05-17", note: "" },
  { person: "Dmitry Gadecky",    type: "dayoff",   start: "2026-05-14", end: "2026-05-15", note: "Flight" },
  { person: "Irina Kirichenko",  type: "dayoff",   start: "2026-05-14", end: "2026-05-15", note: "Greece" },
  { person: "Irina Kirichenko",  type: "dayoff",   start: "2026-05-19", end: "2026-05-19", note: "Greece" },
  { person: "Irina Kirichenko",  type: "dayoff",   start: "2026-05-20", end: "2026-05-20", note: "" },
  { person: "Artem Sharganov",   type: "dayoff",   start: "2026-05-21", end: "2026-05-22", note: "" },
  { person: "Serhii",            type: "vacation", start: "2026-05-25", end: "2026-05-29", note: "" },
  { person: "Olya Nechaeva",     type: "dayoff",   start: "2026-05-29", end: "2026-05-29", note: "" },

  // June
  { person: "Yuri Burov",        type: "dayoff",   start: "2026-06-04", end: "2026-06-05", note: "" },
  { person: "Slava Kukushkin",   type: "dayoff",   start: "2026-06-04", end: "2026-06-05", note: "" },
  { person: "Max",               type: "vacation", start: "2026-06-08", end: "2026-06-19", note: "" },
  { person: "Serhii",            type: "vacation", start: "2026-06-08", end: "2026-06-12", note: "" },
  { person: "Ivan Fursov",       type: "dayoff",   start: "2026-06-09", end: "2026-06-09", note: "" },
  { person: "Sasha",             type: "dayoff",   start: "2026-06-12", end: "2026-06-12", note: "" },
  { person: "Ivan Mikhnenkov",   type: "vacation", start: "2026-06-15", end: "2026-06-26", note: "" },
  { person: "Aleksei Makarov",   type: "vacation", start: "2026-06-15", end: "2026-06-28", note: "" },
  { person: "Artem Sharganov",   type: "vacation", start: "2026-06-17", end: "2026-06-24", note: "" },
  { person: "Igor Ryazancev",    type: "dayoff",   start: "2026-06-17", end: "2026-06-17", note: "" },
  { person: "Andrey Smirnov",    type: "dayoff",   start: "2026-06-19", end: "2026-06-19", note: "" },
];
