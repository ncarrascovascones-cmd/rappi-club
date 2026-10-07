// Geometría del mapa simulado (coordenadas del SVG, sin GPS real).

export type Pt = [number, number];

/** Base de la movilidad → casa de Mateo. */
export const APPROACH: Pt[] = [
  [160, 30],
  [160, 120],
  [120, 120],
  [120, 300],
];

/** Casa → Colegio (el regreso usa el mismo trazo invertido). */
export const MAIN: Pt[] = [
  [120, 300],
  [120, 360],
  [240, 360],
  [240, 200],
  [320, 200],
  [320, 100],
];

export const HOME: Pt = [120, 300];
export const SCHOOL_PT: Pt = [320, 100];
export const DEPOT: Pt = [160, 30];

/** Paradas de otros niños de la ruta (decorativas). */
export const OTHER_STOPS: Pt[] = [
  [120, 200],
  [200, 360],
  [240, 280],
];

function segLen(a: Pt, b: Pt) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function totalLength(pts: Pt[]) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += segLen(pts[i - 1], pts[i]);
  return l;
}

/** Recorta la polilínea entre las fracciones t0 y t1 (0–1) de su longitud. */
export function slice(pts: Pt[], t0: number, t1: number): Pt[] {
  const total = totalLength(pts);
  const d0 = Math.max(0, Math.min(1, t0)) * total;
  const d1 = Math.max(0, Math.min(1, t1)) * total;
  const out: Pt[] = [];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const l = segLen(a, b);
    const s = acc;
    const e = acc + l;
    if (e >= d0 && s <= d1) {
      const from = Math.max(d0, s);
      const to = Math.min(d1, e);
      const lerp = (d: number): Pt => {
        const k = l === 0 ? 0 : (d - s) / l;
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      };
      if (!out.length) out.push(lerp(from));
      out.push(lerp(to));
    }
    acc = e;
  }
  return out;
}

export function pointAt(pts: Pt[], t: number): Pt {
  const s = slice(pts, 0, t);
  return s[s.length - 1] ?? pts[0];
}

export const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

export const reversed = (pts: Pt[]) => [...pts].reverse();
