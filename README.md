# vacations

Static GitHub Pages site with the team list and a vacation / day-off schedule
for 2026.

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

### Entry shape

```js
{ person: "Ivan Trufanov", type: "vacation" | "dayoff",
  start: "2026-MM-DD", end: "2026-MM-DD", note: "optional" }
```

`start` and `end` are inclusive. For a single day, set them to the same value.

## Deployment

GitHub Pages is served from the `main` branch root. After merging changes to
`main`, GitHub Pages will rebuild automatically (enable Pages in repo settings:
*Pages → Source: Deploy from a branch → main / (root)* if it isn't already).
