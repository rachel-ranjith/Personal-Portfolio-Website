"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  KIND_LABEL,
  type Constellation,
  type Entry,
} from "@/content/observatory";

interface Props {
  entry: Entry | null;
  constellation: Constellation | null;
  onClose: () => void;
}

export default function EntryPanel({ entry, constellation, onClose }: Props) {
  return (
    <AnimatePresence>
      {entry && constellation && (
        <motion.aside
          key={entry.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="thin-scroll fixed right-0 top-0 z-30 h-full w-full max-w-[420px] overflow-y-auto border-l border-white/10 bg-[#080a16]/85 p-8 backdrop-blur-xl sm:p-10"
          style={{ boxShadow: `-30px 0 80px -40px ${constellation.hue}` }}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-ink-dim transition hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>

          <div
            className="text-[11px] tracking-catalog uppercase"
            style={{ color: constellation.hue }}
          >
            {constellation.name} · {constellation.epithet}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-xs text-ink-faint">
              {entry.catalogId}
            </span>
            <span className="font-mono text-xs text-ink-faint">
              {entry.year}
            </span>
          </div>

          <h2 className="font-display mt-2 text-4xl font-light leading-tight text-ink">
            {entry.title}
          </h2>

          {entry.org && (
            <div className="mt-1.5 text-sm text-ink" style={{ color: constellation.hue }}>
              {entry.org}
            </div>
          )}

          <p className="mt-1 text-sm text-ink-dim">{entry.summary}</p>

          <div
            className="my-7 h-px w-full"
            style={{
              background: `linear-gradient(90deg, ${constellation.hue}55, transparent)`,
            }}
          />

          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-ink-dim">
            {KIND_LABEL[entry.kind]}
          </div>

          {entry.highlights && entry.highlights.length > 0 && (
            <ul className="space-y-2.5">
              {entry.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-ink-dim">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-none rotate-45"
                    style={{ background: constellation.hue }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {entry.details && (
            <p className="text-[15px] leading-relaxed text-ink-dim">
              {entry.details}
            </p>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-ink-dim"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {entry.links && entry.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {entry.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition"
                  style={{ borderColor: `${constellation.hue}44` }}
                >
                  <span style={{ color: constellation.hue }}>{link.label}</span>
                  <span className="text-ink-faint transition group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 font-mono text-[10px] leading-relaxed text-ink-faint">
            ✦ catalogued in the {constellation.section.toLowerCase()} region
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
