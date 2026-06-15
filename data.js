// Team members and vacation/day-off data parsed from the Slack thread.
// All dates assume 2026 (the year the thread was shared).
// Names are anonymized to first name + first letter of surname (the repo is public).

window.TEAM = [
  { name: "Ivan T.",    role: "Lead",    emoji: "IT" },
  { name: "Artem R.",   role: "Lead",    emoji: "AR" },
  { name: "Anatoly P.", role: "Backend", emoji: "AP" },
  { name: "Aleksei M.", role: "Team",    emoji: "AM" },
  { name: "Serhii",     role: "Team",    emoji: "S"  },
  { name: "Andrei S.",  role: "Team",    emoji: "AS" },
  { name: "Ivan M.",    role: "Team",    emoji: "IM" },
  { name: "Kir",        role: "Team",    emoji: "K"  },
  { name: "Nikolai B.", role: "Team",    emoji: "NB" },
  { name: "Irina K.",   role: "Team",    emoji: "IK" },
  { name: "Maxim A.",   role: "Team",    emoji: "MA" },
  { name: "Ivan F.",    role: "Team",    emoji: "IF" },
  { name: "Sasha Z.",   role: "Team",    emoji: "SZ" },
  { name: "Andrey S.",  role: "Team",    emoji: "AS" },
  { name: "Igor R.",    role: "Team",    emoji: "IR" },
  { name: "Artem S.",   role: "Team",    emoji: "AS" },
  { name: "Sasha",      role: "Team",    emoji: "S"  },
  { name: "Slava K.",   role: "Team",    emoji: "SK" },
  { name: "Renata A.",  role: "Team",    emoji: "RA" },
  { name: "Olya N.",    role: "Team",    emoji: "ON" },
  { name: "Yuri B.",    role: "Team",    emoji: "YB" },
  { name: "Max",        role: "Team",    emoji: "M"  },
  { name: "Dmitry G.",  role: "Team",    emoji: "DG" },
  { name: "Daniel G.",  role: "Team",    emoji: "DG" },
];

// Vacation / day-off entries. type: "vacation" | "dayoff"
// start / end are ISO yyyy-mm-dd, inclusive.
window.VACATIONS = [
  // January
  { person: "Anatoly P.", type: "dayoff",   start: "2026-01-08", end: "2026-01-09", note: "Kazakhstan, on call" },
  { person: "Ivan T.",    type: "dayoff",   start: "2026-01-15", end: "2026-01-16", note: "Sick" },
  { person: "Ivan M.",    type: "dayoff",   start: "2026-01-30", end: "2026-01-30", note: "Medical" },

  // February
  { person: "Andrei S.",  type: "vacation", start: "2026-02-02", end: "2026-02-20", note: "Vacation" },
  { person: "Ivan F.",    type: "vacation", start: "2026-02-04", end: "2026-02-13", note: "~1.5 weeks, reachable via text" },
  { person: "Andrey S.",  type: "dayoff",   start: "2026-02-06", end: "2026-02-06", note: "" },
  { person: "Artem S.",   type: "dayoff",   start: "2026-02-11", end: "2026-02-11", note: "" },
  { person: "Igor R.",    type: "dayoff",   start: "2026-02-12", end: "2026-02-13", note: "" },
  { person: "Sasha",      type: "dayoff",   start: "2026-02-16", end: "2026-02-16", note: "" },
  { person: "Ivan M.",    type: "dayoff",   start: "2026-02-16", end: "2026-02-16", note: "" },
  { person: "Slava K.",   type: "dayoff",   start: "2026-02-18", end: "2026-02-18", note: "" },
  { person: "Kir",        type: "dayoff",   start: "2026-02-19", end: "2026-02-20", note: "" },
  { person: "Sasha Z.",   type: "vacation", start: "2026-02-23", end: "2026-02-27", note: "Israel" },

  // March
  { person: "Renata A.",  type: "dayoff",   start: "2026-03-04", end: "2026-03-04", note: "Conference" },
  { person: "Serhii",     type: "dayoff",   start: "2026-03-09", end: "2026-03-09", note: "" },
  { person: "Anatoly P.", type: "dayoff",   start: "2026-03-09", end: "2026-03-09", note: "" },
  { person: "Andrei S.",  type: "vacation", start: "2026-03-25", end: "2026-03-27", note: "" },
  { person: "Sasha Z.",   type: "vacation", start: "2026-03-30", end: "2026-04-13", note: "Japan" },

  // April
  { person: "Nikolai B.", type: "dayoff",   start: "2026-04-03", end: "2026-04-03", note: "" },
  { person: "Serhii",     type: "dayoff",   start: "2026-04-03", end: "2026-04-03", note: "Half day off (afternoon)" },
  { person: "Yuri B.",    type: "vacation", start: "2026-04-06", end: "2026-04-10", note: "" },
  { person: "Slava K.",   type: "dayoff",   start: "2026-04-06", end: "2026-04-06", note: "" },
  { person: "Olya N.",    type: "dayoff",   start: "2026-04-06", end: "2026-04-07", note: "Birthday" },
  { person: "Ivan F.",    type: "dayoff",   start: "2026-04-06", end: "2026-04-06", note: "" },
  { person: "Ivan F.",    type: "dayoff",   start: "2026-04-10", end: "2026-04-10", note: "" },
  { person: "Max",        type: "dayoff",   start: "2026-04-13", end: "2026-04-14", note: "" },
  { person: "Anatoly P.", type: "dayoff",   start: "2026-04-15", end: "2026-04-15", note: "" },
  { person: "Max",        type: "dayoff",   start: "2026-04-21", end: "2026-04-21", note: "" },
  { person: "Dmitry G.",  type: "dayoff",   start: "2026-04-21", end: "2026-04-21", note: "Flight" },
  { person: "Serhii",     type: "dayoff",   start: "2026-04-24", end: "2026-04-24", note: "" },
  { person: "Anatoly P.", type: "vacation", start: "2026-04-27", end: "2026-05-04", note: "" },
  { person: "Daniel G.",  type: "vacation", start: "2026-04-27", end: "2026-05-04", note: "" },
  { person: "Dmitry G.",  type: "dayoff",   start: "2026-04-28", end: "2026-04-28", note: "Flight" },
  { person: "Slava K.",   type: "dayoff",   start: "2026-04-29", end: "2026-04-29", note: "" },
  { person: "Maxim A.",   type: "dayoff",   start: "2026-04-30", end: "2026-04-30", note: "" },

  // May
  { person: "Igor R.",    type: "dayoff",   start: "2026-05-05", end: "2026-05-06", note: "" },
  { person: "Max",        type: "dayoff",   start: "2026-05-05", end: "2026-05-05", note: "Forced" },
  { person: "Nikolai B.", type: "vacation", start: "2026-05-13", end: "2026-05-15", note: "" },
  { person: "Ivan F.",    type: "vacation", start: "2026-05-14", end: "2026-05-17", note: "" },
  { person: "Dmitry G.",  type: "dayoff",   start: "2026-05-14", end: "2026-05-15", note: "Flight" },
  { person: "Irina K.",   type: "dayoff",   start: "2026-05-14", end: "2026-05-15", note: "Greece" },
  { person: "Irina K.",   type: "dayoff",   start: "2026-05-19", end: "2026-05-19", note: "Greece" },
  { person: "Irina K.",   type: "dayoff",   start: "2026-05-20", end: "2026-05-20", note: "" },
  { person: "Artem S.",   type: "dayoff",   start: "2026-05-21", end: "2026-05-22", note: "" },
  { person: "Serhii",     type: "vacation", start: "2026-05-25", end: "2026-05-29", note: "" },
  { person: "Olya N.",    type: "dayoff",   start: "2026-05-29", end: "2026-05-29", note: "" },

  // June
  { person: "Yuri B.",    type: "dayoff",   start: "2026-06-04", end: "2026-06-05", note: "" },
  { person: "Slava K.",   type: "dayoff",   start: "2026-06-04", end: "2026-06-05", note: "" },
  { person: "Max",        type: "vacation", start: "2026-06-08", end: "2026-06-19", note: "" },
  { person: "Serhii",     type: "vacation", start: "2026-06-08", end: "2026-06-12", note: "" },
  { person: "Ivan F.",    type: "dayoff",   start: "2026-06-09", end: "2026-06-09", note: "" },
  { person: "Sasha",      type: "dayoff",   start: "2026-06-12", end: "2026-06-12", note: "" },
  { person: "Serhii",     type: "dayoff",   start: "2026-06-15", end: "2026-06-16", note: "Extra 2 days off" },
  { person: "Ivan M.",    type: "vacation", start: "2026-06-15", end: "2026-06-26", note: "" },
  { person: "Aleksei M.", type: "vacation", start: "2026-06-15", end: "2026-06-28", note: "" },
  { person: "Artem S.",   type: "vacation", start: "2026-06-17", end: "2026-06-24", note: "" },
  { person: "Igor R.",    type: "dayoff",   start: "2026-06-17", end: "2026-06-17", note: "" },
  { person: "Andrey S.",  type: "dayoff",   start: "2026-06-19", end: "2026-06-19", note: "" },
];
