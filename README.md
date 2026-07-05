# Observatory — Rachel Ranjith's portfolio

A personal portfolio rendered as an explorable night sky. Your work is grouped
into four **constellations**; each light is a project, honor, role, or piece of
writing. Drag to pan, scroll to zoom, click a star to open it, or press **⌘K**
to jump anywhere.

## The four constellations

| Constellation | Section    | Holds                        | Hue    |
| ------------- | ---------- | ---------------------------- | ------ |
| **Opus**      | Projects   | things you built             | gold   |
| **Lumen**     | Honors     | scholarships & achievements  | blue   |
| **Vireo**     | Experience | roles, internships, the path | violet |
| **Cantus**    | Writing    | essays & published pieces    | mint   |

## Editing your content

**Everything lives in one file:** [`src/content/observatory.ts`](src/content/observatory.ts).

- `PROFILE` — your name, tagline, intro line, and social links.
- `CONSTELLATIONS` — the four regions. Each has:
  - `entries` — the **stars**. Add one by copying an entry, giving it a unique
    `id`, and setting `pos` (x/y offset from the cluster center, roughly ±220).
  - `edges` — which stars connect to draw the shape, as `[fromIndex, toIndex]`
    pairs into the `entries` array.
  - `magnitude` (0.4–1) controls a star's size/brightness — make your best work
    brighter.

No other file needs touching to manage the portfolio.

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Framer Motion. The sky is
drawn on an HTML5 canvas (`src/components/StarField.tsx`).
