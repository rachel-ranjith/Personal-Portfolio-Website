# Observatory — Rachel Ranjith's portfolio

A personal portfolio rendered as an explorable **night sky**. Every light is a
project, honour, role, piece of writing, or society — grouped into five
**constellations** you can wander, zoom, and open.

🔭 Built with Next.js + an HTML5 canvas. All content lives in one editable file.

## The five constellations

| Constellation | Section    | Holds                                   | Hue    |
| ------------- | ---------- | --------------------------------------- | ------ |
| **Opus**      | Projects   | things I've built (quant + AI)          | gold   |
| **Lumen**     | Honors     | scholarships, awards, hackathon wins    | blue   |
| **Vireo**     | Experience | internships & professional roles        | violet |
| **Cantus**    | Writing    | articles & essays (a "river" of pieces) | mint   |
| **Sodalis**   | Societies  | societies, committees, mentoring, events| rose   |

## Navigating the sky

- **Desktop:** drag to pan · scroll to zoom · click a star to open it · hover to
  read a title · **⌘K** command palette · **⌘0** (or **Reset**) to recentre.
- **Phones:** drag to pan · pinch to zoom · tap a star to open it · tap a
  constellation in the legend to fly to it. The layout automatically remaps to a
  taller arrangement so all five fill a portrait screen, and the camera is
  bounded so you can't drift off into empty space.

## Editing your content

**Everything lives in one file:**
[`src/content/observatory.ts`](src/content/observatory.ts). Nothing else needs
touching to manage the portfolio.

### `PROFILE`

Your name, the SEO/tagline sentence, the intro line, and the social links shown
on the landing card.

### `CONSTELLATIONS`

Each of the five regions. Per-constellation fields:

| Field          | Meaning                                                              |
| -------------- | ------------------------------------------------------------------- |
| `name` / `epithet` / `section` | display name, subtitle, and legend label           |
| `hue`          | accent colour (hex) used for the stars, lines, and panel            |
| `center`       | where the cluster sits in the sky (desktop)                         |
| `mobileCenter` | where it sits on portrait phones (optional)                         |
| `focusZoom`    | zoom used when you fly to it (optional; auto-fit caps it on small screens) |
| `nameOffset`   | how far above the cluster to draw its name (optional)               |
| `entries`      | the **stars** (see below)                                           |
| `edges`        | which stars connect, as `[fromIndex, toIndex]` pairs into `entries` |

### A star (`entries` item)

```ts
{
  id: "opus-lob",                 // unique
  title: "Limit Order Book Simulator",
  org: "Personal project",        // affiliation / where it ran (optional)
  catalogId: "OPS-01",            // little call-sign
  kind: "project",                // project | achievement | scholarship | experience | writing
  year: "Jun 2025",
  magnitude: 1,                   // 0.4–1 → star size/brightness; make your best work brighter
  summary: "One-line description shown under the title.",
  highlights: [                   // action-verb bullet points (preferred)
    "Processes 1.95M messages/second at 0.51µs latency",
  ],
  tags: ["Python", "Performance"],
  links: [{ label: "GitHub", href: "https://…" }],  // buttons in the panel
  pos: { x: -160, y: -110 },       // offset from the cluster centre (roughly ±300)
}
```

**To add a star:** copy an entry, give it a unique `id`, set its `pos`, and (if
you want it linked into the shape) add an `[from, to]` pair to that
constellation's `edges`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Deploy

Push to `main` and import the repo on [vercel.com/new](https://vercel.com/new) —
Vercel auto-detects Next.js, no configuration needed. Every push to `main`
redeploys automatically.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion. The sky
itself is drawn on a single HTML5 canvas.

## Project structure

```
src/
├── app/                  # Next.js app router, global styles, fonts
├── content/
│   └── observatory.ts    # ← all your content + layout lives here
└── components/
    ├── Observatory.tsx   # orchestrator: state, HUD, legend, intro card
    ├── StarField.tsx     # the canvas — rendering, pan/zoom, hit-testing
    ├── EntryPanel.tsx     # the star-catalog detail panel
    └── CommandPalette.tsx # ⌘K search
```
