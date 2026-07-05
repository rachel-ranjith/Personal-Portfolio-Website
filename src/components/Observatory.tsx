"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  CONSTELLATIONS,
  PROFILE,
  centerFor,
  type Constellation,
  type Entry,
} from "@/content/observatory";
import StarField, { type Camera } from "./StarField";
import EntryPanel from "./EntryPanel";
import CommandPalette from "./CommandPalette";

interface Selection {
  entry: Entry;
  constellation: Constellation;
}

const isPortrait = () =>
  typeof window !== "undefined" && window.innerHeight > window.innerWidth;

export default function Observatory() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [focus, setFocus] = useState<Camera | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [introDismissed, setIntroDismissed] = useState(false);

  const flyTo = useCallback((entry: Entry, constellation: Constellation) => {
    setSelection({ entry, constellation });
    const portrait = isPortrait();
    const cc = centerFor(constellation, portrait);
    setFocus({
      // on desktop, nudge left so the entry clears the right-hand panel
      x: cc.x + entry.pos.x + (portrait ? 0 : 150),
      y: cc.y + entry.pos.y,
      zoom: 2.0,
    });
    setIntroDismissed(true);
  }, []);

  const flyToConstellation = useCallback((c: Constellation) => {
    setSelection(null);
    // Fit the cluster into the viewport (leaving ~38% for labels) and never zoom
    // in past its designed value — so it fills a phone without overflowing labels.
    const hx = Math.max(1, ...c.entries.map((e) => Math.abs(e.pos.x)));
    const hy = Math.max(1, ...c.entries.map((e) => Math.abs(e.pos.y)));
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const fit = Math.min((vw * 0.62) / (2 * hx), (vh * 0.62) / (2 * hy));
    const zoom = Math.min(c.focusZoom ?? 1.15, fit);
    const cc = centerFor(c, isPortrait());
    setFocus({ x: cc.x, y: cc.y, zoom });
    setIntroDismissed(true);
  }, []);

  const goHome = useCallback(() => {
    setSelection(null);
    setFocus(null); // null → StarField eases to its auto-fit home framing
  }, []);

  // ⌘0 / Ctrl+0 — reset the view to the full sky
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        goHome();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goHome]);

  const dismissPanel = useCallback(() => setSelection(null), []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <StarField
        focus={focus}
        selectedId={selection?.entry.id ?? null}
        onPick={flyTo}
        onBackground={dismissPanel}
        onHover={setHoverLabel}
      />

      {/* top-left identity */}
      <header className="pointer-events-none fixed left-0 top-0 z-20 p-4 sm:p-7">
        <button
          onClick={goHome}
          className="pointer-events-auto text-left transition hover:opacity-80"
        >
          <div className="font-display text-xl font-light leading-none text-ink sm:text-2xl">
            {PROFILE.name}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-catalog text-ink-faint">
            ✦ Observatory
          </div>
        </button>
      </header>

      {/* top-right controls */}
      <div className="fixed right-0 top-0 z-20 flex items-center gap-2 p-4 sm:gap-3 sm:p-7">
        <button
          onClick={goHome}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-ink-dim backdrop-blur transition hover:border-white/20 hover:text-ink"
        >
          Reset
          <kbd className="fine-only rounded border border-white/15 px-1 text-[10px]">
            ⌘0
          </kbd>
        </button>
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-ink-dim backdrop-blur transition hover:border-white/20 hover:text-ink"
        >
          Navigate
          <kbd className="fine-only rounded border border-white/15 px-1 text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* bottom legend — constellation map */}
      <nav className="fixed bottom-0 left-0 z-20 flex max-w-[70%] flex-wrap gap-x-5 gap-y-2 p-4 sm:max-w-none sm:gap-x-6 sm:p-7">
        {CONSTELLATIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => flyToConstellation(c)}
            className="group flex items-center gap-2 transition hover:opacity-100"
            style={{ opacity: 0.75 }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition group-hover:scale-125"
              style={{
                background: c.hue,
                boxShadow: `0 0 10px ${c.hue}`,
              }}
            />
            <span className="text-left leading-tight">
              <span className="block font-mono text-[11px] text-ink">
                {c.name}
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                {c.section}
              </span>
            </span>
          </button>
        ))}
      </nav>

      {/* hover readout (bottom-right) */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-20 max-w-[45%] text-right font-mono text-[11px] text-ink-faint sm:bottom-7 sm:right-7 sm:max-w-none">
        <AnimatePresence mode="wait">
          {hoverLabel ? (
            <motion.span
              key={hoverLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ✦ {hoverLabel}
            </motion.span>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            >
              <span className="fine-only">drag · scroll to zoom</span>
              <span className="coarse-only">drag · pinch to zoom</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* intro card */}
      <AnimatePresence>
        {!introDismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6"
          >
            <div className="relative max-w-lg text-center animate-rise">
              {/* readability scrim — invisible on desktop (centre is already dark),
                  keeps text legible over constellations on phones */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(5,6,13,0.92), rgba(5,6,13,0.6) 55%, transparent 80%)",
                }}
              />
              <div className="font-mono text-[11px] uppercase tracking-catalog text-ink-faint">
                Builder, scholar, writer
              </div>
              <h1 className="font-display mt-4 text-5xl font-light leading-tight text-ink sm:text-6xl">
                {PROFILE.name}
              </h1>
              <div className="mt-3 font-mono text-[9px] uppercase tracking-catalog text-ink-faint">
                A portfolio in the night sky
              </div>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-dim">
                {PROFILE.intro}
              </p>
              <button
                onClick={() => setIntroDismissed(true)}
                className="pointer-events-auto mt-8 rounded-full border border-white/15 px-6 py-2 font-mono text-xs uppercase tracking-widest text-ink-dim transition hover:border-white/30 hover:text-ink"
              >
                Enter the sky
              </button>

              <div className="pointer-events-auto mt-8 flex items-center justify-center gap-5">
                {PROFILE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="font-mono text-[11px] uppercase tracking-widest text-ink-faint transition hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EntryPanel
        entry={selection?.entry ?? null}
        constellation={selection?.constellation ?? null}
        onClose={dismissPanel}
      />

      <CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        onSelect={flyTo}
      />
    </main>
  );
}
