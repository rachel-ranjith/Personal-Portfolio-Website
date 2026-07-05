"use client";

import { useEffect, useRef } from "react";
import {
  ALL_ENTRIES,
  CONSTELLATIONS,
  centerFor,
  type Constellation,
  type Entry,
} from "@/content/observatory";

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface StarFieldProps {
  focus: Camera | null; // camera target the parent wants us to ease toward
  selectedId: string | null;
  onPick: (entry: Entry, constellation: Constellation) => void;
  onBackground: () => void;
  onHover: (label: string | null) => void;
}

interface BgStar {
  x: number;
  y: number;
  layer: number; // parallax factor
  size: number;
  phase: number;
  hue: string;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const HOME: Camera = { x: 0, y: 0, zoom: 0.4 };
const MIN_ZOOM = 0.34; // desktop wheel floor (mobile home may go lower — see fitZoom)
const MAX_ZOOM = 3.2;

// Half-extents of all content from the origin, for fit-to-viewport framing.
const HALF = ALL_ENTRIES.reduce(
  (a, { world }) => ({
    x: Math.max(a.x, Math.abs(world.x)),
    y: Math.max(a.y, Math.abs(world.y)),
  }),
  { x: 1, y: 1 },
);
const CAM_MARGIN = 160; // world padding you may pan past the outermost stars

// Home framing: fit the whole sky (contain). The content is a wide 2D field, so
// on a tall phone this leaves sky above/below — that's fine; it's an overview you
// tap into via the legend. The camera is bounded so you can't drift into void.
// The 0.92 keeps a 1440×900 desktop at the original ~0.4 home zoom.
const computeHome = (W: number, H: number, hx: number, hy: number) => {
  const contain = 0.92 * Math.min(W / (2 * hx), H / (2 * hy));
  return Math.min(Math.max(contain, 0.08), MAX_ZOOM);
};

export default function StarField({
  focus,
  selectedId,
  onPick,
  onBackground,
  onHover,
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable render state kept in refs so the RAF loop never restarts.
  const cam = useRef<Camera>({ ...HOME });
  const target = useRef<Camera>({ ...HOME });
  const pointer = useRef({ x: -1, y: -1, inside: false });
  const drag = useRef({ active: false, moved: 0, lastX: 0, lastY: 0 });
  const hoveredId = useRef<string | null>(null);
  const shooters = useRef<Shooter[]>([]);
  const bgStars = useRef<BgStar[]>([]);
  const selRef = useRef<string | null>(selectedId);
  const homeRef = useRef<Camera>({ ...HOME });
  const focusRef = useRef<Camera | null>(focus);

  useEffect(() => {
    selRef.current = selectedId;
  }, [selectedId]);

  // Ease camera toward a focus target, or the auto-fit home when none is set.
  useEffect(() => {
    focusRef.current = focus;
    target.current = focus ? { ...focus } : { ...homeRef.current };
  }, [focus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let startT = 0; // timestamp of first frame, for the intro "charting" fade
    let minZoom = MIN_ZOOM; // effective zoom-out floor (lower on small screens)
    let firstFit = true;
    let portrait = false; // phones remap the layout taller & narrower
    let halfX = HALF.x; // content half-extents for the active orientation
    let halfY = HALF.y;
    const pointers = new Map<number, { x: number; y: number }>(); // active touches
    let pinchDist = 0;
    let pinchMid = { x: 0, y: 0 };
    const hues = ["#ffffff", "#cfe0ff", "#ffe6c2", "#d8c2ff"];

    const seed = () => {
      // Deterministic-ish scatter across a wide world.
      const stars: BgStar[] = [];
      for (let i = 0; i < 620; i++) {
        const layer = 0.2 + Math.random() * 0.6; // depth
        stars.push({
          x: (Math.random() - 0.5) * 3600,
          y: (Math.random() - 0.5) * 2600,
          layer,
          size: (0.4 + Math.random() * 1.4) * (0.6 + layer),
          phase: Math.random() * Math.PI * 2,
          hue: hues[(Math.random() * hues.length) | 0],
        });
      }
      bgStars.current = stars;
    };
    seed();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Portrait phones use a taller, narrower remap of the layout so all five
      // constellations fill the screen. Recompute content extents to match.
      portrait = H > W;
      halfX = 1;
      halfY = 1;
      for (const con of CONSTELLATIONS) {
        const cc = centerFor(con, portrait);
        for (const e of con.entries) {
          halfX = Math.max(halfX, Math.abs(cc.x + e.pos.x));
          halfY = Math.max(halfY, Math.abs(cc.y + e.pos.y));
        }
      }
      // Auto-fit the whole sky to the viewport (adapts to phones & big screens).
      const z = computeHome(W, H, halfX, halfY);
      homeRef.current = { x: 0, y: 0, zoom: z };
      minZoom = Math.min(MIN_ZOOM, z);
      if (!focusRef.current) {
        target.current = { ...homeRef.current };
        if (firstFit) cam.current = { ...homeRef.current };
      }
      firstFit = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const toScreen = (wx: number, wy: number, p = 1) => ({
      x: (wx - cam.current.x * p) * cam.current.zoom + W / 2,
      y: (wy - cam.current.y * p) * cam.current.zoom + H / 2,
    });

    const draw = (t: number) => {
      // --- ease camera ---
      const c = cam.current;
      const tg = target.current;
      if (!drag.current.active) {
        c.x += (tg.x - c.x) * 0.08;
        c.y += (tg.y - c.y) * 0.08;
        c.zoom += (tg.zoom - c.zoom) * 0.08;
      }

      // --- background gradient ---
      const g = ctx.createRadialGradient(
        W * 0.5,
        H * 0.42,
        60,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.85,
      );
      g.addColorStop(0, "#0b1024");
      g.addColorStop(0.55, "#070813");
      g.addColorStop(1, "#04040a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // --- nebulae behind each constellation ---
      for (const con of CONSTELLATIONS) {
        const cc = centerFor(con, portrait);
        const s = toScreen(cc.x, cc.y);
        const r = 240 * c.zoom;
        if (s.x < -r || s.x > W + r || s.y < -r || s.y > H + r) continue;
        const neb = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        neb.addColorStop(0, hexA(con.hue, 0.1));
        neb.addColorStop(1, hexA(con.hue, 0));
        ctx.fillStyle = neb;
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
      }

      // --- background stars (parallax + twinkle) ---
      for (const st of bgStars.current) {
        const s = toScreen(st.x, st.y, st.layer);
        if (s.x < -4 || s.x > W + 4 || s.y < -4 || s.y > H + 4) continue;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.001 + st.phase);
        ctx.globalAlpha = tw * (0.5 + st.layer * 0.5);
        ctx.fillStyle = st.hue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, st.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // --- shooting stars ---
      if (Math.random() < 0.006 && shooters.current.length < 2) {
        shooters.current.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.5,
          vx: 5 + Math.random() * 4,
          vy: 2 + Math.random() * 2,
          life: 1,
        });
      }
      for (const sh of shooters.current) {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
        const grad = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - sh.vx * 8,
          sh.y - sh.vy * 8,
        );
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * sh.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
      }
      shooters.current = shooters.current.filter((s) => s.life > 0);

      // --- constellations: full lines, brightening as the camera nears ---
      if (!startT) startT = t;
      const fade = Math.min(1, (t - startT) / 1600); // one-time "charting" reveal
      // Occupied label rectangles this frame, so labels never overlap.
      const labelBoxes: { x: number; y: number; w: number; h: number }[] = [];
      // Truncate a string with an ellipsis so it fits maxW (uses current font).
      const fitText = (s: string, maxW: number) => {
        if (ctx.measureText(s).width <= maxW) return s;
        let lo = 0;
        let hi = s.length;
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1;
          if (ctx.measureText(s.slice(0, mid) + "…").width <= maxW) lo = mid;
          else hi = mid - 1;
        }
        return lo > 0 ? s.slice(0, lo) + "…" : "";
      };
      for (const con of CONSTELLATIONS) {
        const cc = centerFor(con, portrait);
        const dx = cc.x - c.x;
        const dy = cc.y - c.y;
        const dist = Math.hypot(dx, dy);
        const near = 1 - Math.min(dist / 900, 1); // 1 close, 0 far

        const pts = con.entries.map((e) =>
          toScreen(cc.x + e.pos.x, cc.y + e.pos.y),
        );

        // every edge drawn in full — proximity + intro fade drive opacity
        ctx.lineWidth = 1;
        ctx.strokeStyle = hexA(con.hue, (0.18 + 0.5 * near) * fade);
        ctx.beginPath();
        for (const [a, b] of con.edges) {
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
        }
        ctx.stroke();

        // constellation name above its cluster (offset tuned per constellation)
        const cs = toScreen(cc.x, cc.y - (con.nameOffset ?? 210));
        ctx.globalAlpha = (0.25 + 0.45 * near) * fade;
        ctx.fillStyle = hexA(con.hue, 1);
        ctx.font = `${Math.max(11, 13 * Math.min(c.zoom, 1.4))}px var(--font-mono), monospace`;
        ctx.textAlign = "center";
        ctx.letterSpacing = "6px";
        ctx.fillText(con.name.toUpperCase(), cs.x, cs.y);
        ctx.letterSpacing = "0px";
        ctx.globalAlpha = 1;

        // --- the stars themselves ---
        con.entries.forEach((e, i) => {
          const p = pts[i];
          if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) return;
          const isHover = hoveredId.current === e.id;
          const isSel = selRef.current === e.id;
          const tw = 0.75 + 0.25 * Math.sin(t * 0.0018 + i);
          const base = Math.max(
            (2.4 + e.magnitude * 4.2) * Math.min(c.zoom, 1.6),
            1.4, // keep stars visible when the whole sky is zoomed out on a phone
          );
          const r = base * (isHover || isSel ? 1.45 : 1);

          // glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
          glow.addColorStop(0, hexA(con.hue, 0.55 * tw));
          glow.addColorStop(1, hexA(con.hue, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
          ctx.fill();

          // core
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = tw;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;

          // selection ring
          if (isSel || isHover) {
            ctx.strokeStyle = hexA(con.hue, isSel ? 0.9 : 0.5);
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r + 7, 0, Math.PI * 2);
            ctx.stroke();
          }

        });

        // --- labels: brightest first, truncated to fit, collision-avoided ---
        const order = [...con.entries.keys()].sort(
          (a, b) => con.entries[b].magnitude - con.entries[a].magnitude,
        );
        for (const i of order) {
          const e = con.entries[i];
          const p = pts[i];
          if (p.x < -80 || p.x > W + 80 || p.y < -40 || p.y > H + 40) continue;
          const isHover = hoveredId.current === e.id;
          const isSel = selRef.current === e.id;
          if (!(isHover || isSel || near > 0.72 || c.zoom > 1.05)) continue;
          const rr =
            Math.max((2.4 + e.magnitude * 4.2) * Math.min(c.zoom, 1.6), 1.4) *
            (isHover || isSel ? 1.45 : 1);
          // label sits on whichever side of the star has more room
          const labelLeft = p.x > W / 2;
          const lx = labelLeft ? p.x - rr - 10 : p.x + rr + 10;
          const availW = (labelLeft ? lx : W - lx) - 12;
          if (availW < 46) continue; // no room to draw anything legible
          ctx.font = `13px var(--font-mono), monospace`;
          const title = fitText(e.title, availW);
          const titleW = ctx.measureText(title).width;
          const bx = labelLeft ? lx - titleW : lx;
          const box = { x: bx - 3, y: p.y - 9, w: titleW + 6, h: portrait ? 15 : 27 };
          const clash = labelBoxes.some(
            (o) =>
              box.x < o.x + o.w &&
              box.x + box.w > o.x &&
              box.y < o.y + o.h &&
              box.y + box.h > o.y,
          );
          if (clash && !(isHover || isSel)) continue;
          labelBoxes.push(box);
          ctx.textAlign = labelLeft ? "right" : "left";
          ctx.globalAlpha =
            isHover || isSel ? 1 : Math.min(1, Math.max(c.zoom - 0.9, near));
          ctx.fillStyle = "#eaf0ff";
          ctx.fillText(title, lx, p.y + 4);
          // second line (org) only where there's vertical room — skip on phones
          if (!portrait && e.org) {
            ctx.font = `10px var(--font-mono), monospace`;
            ctx.fillStyle = hexA(con.hue, 0.85);
            ctx.fillText(fitText(e.org, availW), lx, p.y + 18);
          }
          ctx.globalAlpha = 1;
          ctx.textAlign = "left";
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // ---- hit testing ----
    const pick = (px: number, py: number) => {
      let best: { entry: Entry; con: Constellation; d: number } | null = null;
      for (const con of CONSTELLATIONS) {
        const cc = centerFor(con, portrait);
        for (const entry of con.entries) {
          const s = toScreen(cc.x + entry.pos.x, cc.y + entry.pos.y);
          const d = Math.hypot(s.x - px, s.y - py);
          const rad = 22 + entry.magnitude * 6;
          if (d < rad && (!best || d < best.d)) best = { entry, con, d };
        }
      }
      return best;
    };

    // ---- pointer handlers (mouse drag + wheel, and touch drag + pinch) ----
    const rel = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    // Keep the viewport within the content (+ a little margin) so the user can
    // never drag or zoom out into empty void. Not applied to programmatic focus,
    // so flying to an edge constellation still centres it.
    const clampCam = (c: Camera) => {
      const ax = Math.max(0, halfX + CAM_MARGIN - W / 2 / c.zoom);
      const ay = Math.max(0, halfY + CAM_MARGIN - H / 2 / c.zoom);
      c.x = Math.max(-ax, Math.min(ax, c.x));
      c.y = Math.max(-ay, Math.min(ay, c.y));
    };

    const zoomAround = (mx: number, my: number, factor: number) => {
      const c = cam.current;
      const wx = (mx - W / 2) / c.zoom + c.x;
      const wy = (my - H / 2) / c.zoom + c.y;
      const z = Math.max(minZoom, Math.min(MAX_ZOOM, c.zoom * factor));
      c.zoom = z;
      c.x = wx - (mx - W / 2) / z;
      c.y = wy - (my - H / 2) / z;
      clampCam(c);
      target.current = { ...c };
    };

    const onDown = (e: PointerEvent) => {
      const pos = rel(e);
      pointers.set(e.pointerId, pos);
      if (pointers.size === 1) {
        drag.current = { active: true, moved: 0, lastX: pos.x, lastY: pos.y };
      } else if (pointers.size === 2) {
        drag.current.active = false;
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        pinchMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      }
    };

    const onMove = (e: PointerEvent) => {
      const pos = rel(e);
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, pos);
      pointer.current = { x: pos.x, y: pos.y, inside: true };

      if (pointers.size >= 2) {
        // pinch: pan by the midpoint's movement and zoom by the finger spread
        const [a, b] = [...pointers.values()];
        const nd = Math.hypot(a.x - b.x, a.y - b.y) || pinchDist;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const c = cam.current;
        c.x -= (mx - pinchMid.x) / c.zoom;
        c.y -= (my - pinchMid.y) / c.zoom;
        zoomAround(mx, my, nd / (pinchDist || nd));
        pinchDist = nd;
        pinchMid = { x: mx, y: my };
        drag.current.moved += 20; // never treat a pinch as a tap
        return;
      }

      if (drag.current.active) {
        const dx = pos.x - drag.current.lastX;
        const dy = pos.y - drag.current.lastY;
        drag.current.lastX = pos.x;
        drag.current.lastY = pos.y;
        drag.current.moved += Math.abs(dx) + Math.abs(dy);
        cam.current.x -= dx / cam.current.zoom;
        cam.current.y -= dy / cam.current.zoom;
        clampCam(cam.current);
        target.current = { ...cam.current };
      } else if (e.pointerType !== "touch") {
        const hit = pick(pos.x, pos.y);
        const id = hit ? hit.entry.id : null;
        if (id !== hoveredId.current) {
          hoveredId.current = id;
          onHover(hit ? hit.entry.title : null);
          canvas.style.cursor = id ? "pointer" : "grab";
        }
      }
    };

    const endPointer = (e: PointerEvent) => {
      const pos = pointers.get(e.pointerId) ?? rel(e);
      const wasTap = drag.current.moved < 8 && pointers.size === 1;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 1) {
        // one finger left after a pinch — resume dragging without a jump
        const [rem] = [...pointers.values()];
        drag.current = { active: true, moved: 20, lastX: rem.x, lastY: rem.y };
        return;
      }
      drag.current.active = false;
      canvas.style.cursor = hoveredId.current ? "pointer" : "grab";
      if (wasTap) {
        const hit = pick(pos.x, pos.y);
        if (hit) onPick(hit.entry, hit.con);
        else onBackground();
      }
    };

    const onLeave = () => {
      pointer.current.inside = false;
      if (hoveredId.current) {
        hoveredId.current = null;
        onHover(null);
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAround(
        e.clientX - rect.left,
        e.clientY - rect.top,
        Math.exp(-e.deltaY * 0.0015),
      );
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.style.cursor = "grab";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", endPointer);
      canvas.removeEventListener("pointercancel", endPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full touch-none select-none"
    />
  );
}

// #rrggbb + alpha → rgba()
function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
