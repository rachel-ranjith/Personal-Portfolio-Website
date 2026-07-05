"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_ENTRIES,
  KIND_LABEL,
  type Constellation,
  type Entry,
} from "@/content/observatory";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (entry: Entry, constellation: Constellation) => void;
}

export default function CommandPalette({ open, setOpen, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ALL_ENTRIES.filter(({ entry, constellation }) => {
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        (entry.org ?? "").toLowerCase().includes(q) ||
        entry.catalogId.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        constellation.name.toLowerCase().includes(q) ||
        constellation.section.toLowerCase().includes(q) ||
        (entry.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
    return list;
  }, [query]);

  useEffect(() => {
    if (active >= results.length) setActive(0);
  }, [results, active]);

  const choose = (i: number) => {
    const r = results[i];
    if (!r) return;
    onSelect(r.entry, r.constellation);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c1a]/95 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="text-ink-faint">✦</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Navigate the sky — search projects, honors, writing…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-ink-faint">
                ESC
              </kbd>
            </div>

            <div className="thin-scroll max-h-[46vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-ink-faint">
                  No stars match “{query}”.
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={r.entry.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition ${
                    i === active ? "bg-white/[0.06]" : ""
                  }`}
                >
                  <span
                    className="h-2 w-2 flex-none rounded-full"
                    style={{ background: r.constellation.hue }}
                  />
                  <span className="flex-1 truncate">
                    <span className="text-sm text-ink">{r.entry.title}</span>
                    {r.entry.org && (
                      <span className="ml-2 text-[11px] text-ink-faint">
                        {r.entry.org}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">
                    {KIND_LABEL[r.entry.kind]}
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: r.constellation.hue }}
                  >
                    {r.entry.catalogId}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
