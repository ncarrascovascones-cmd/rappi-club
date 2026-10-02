'use client';

import { useState, type ReactNode } from 'react';
import { Table2, BarChart3 } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

// Paleta validada (slots 1 y 2 de la paleta categórica de referencia) + marca para series únicas.
export const SERIES = {
  brand: '#EE4119',
  blue: '#2A78D6',
  orange: '#EB6834',
};

export function ChartCard({
  title,
  subtitle,
  children,
  table,
  legend,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  table: { head: string[]; rows: (string | number)[][] };
  legend?: { label: string; color: string }[];
  className?: string;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <div className={cn('rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-900/[0.04]', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold text-ink-900">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
        </div>
        <button
          onClick={() => setShowTable((s) => !s)}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-ink-500 hover:bg-ink-100"
          aria-pressed={showTable}
        >
          {showTable ? <BarChart3 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
          {showTable ? 'Gráfico' : 'Tabla'}
        </button>
      </div>
      {legend && !showTable && (
        <div className="mt-3 flex flex-wrap gap-4">
          {legend.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4">
        {showTable ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                  {table.head.map((h) => (
                    <th key={h} className="py-2 pr-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={cn('py-2 pr-3', j === 0 ? 'font-semibold text-ink-800' : 'tabular-nums text-ink-600')}>
                        {typeof c === 'number' ? formatNumber(c) : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/** Barras verticales de una sola serie con tooltip al pasar el cursor. */
export function BarChart({
  labels,
  values,
  color = SERIES.brand,
  format = (v: number) => formatNumber(v),
  height = 200,
}: {
  labels: string[];
  values: number[];
  color?: string;
  format?: (v: number) => string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...values) * 1.1;
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 bottom-6 flex flex-col justify-between">
        {[...ticks].reverse().map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="w-8 text-right text-[10px] tabular-nums text-ink-400">{format(t)}</span>
            <span className="h-px flex-1 bg-ink-100" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bottom-6 left-10 flex items-end gap-2 sm:gap-3">
        {values.map((v, i) => (
          <div
            key={labels[i]}
            className="group relative flex h-full flex-1 items-end justify-center"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            aria-label={`${labels[i]}: ${format(v)}`}
          >
            {hover === i && (
              <div className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg" style={{ bottom: `${(v / max) * 100}%` }}>
                {labels[i]} · {format(v)}
              </div>
            )}
            <div
              className="w-full max-w-[44px] origin-bottom animate-grow-y rounded-t-[4px] transition-opacity"
              style={{
                height: `${(v / max) * 100}%`,
                background: color,
                opacity: hover === null || hover === i ? 1 : 0.45,
                animationDelay: `${i * 60}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 left-10 flex gap-2 sm:gap-3">
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center text-[11px] font-semibold text-ink-400">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barras agrupadas (2 series) con etiquetas directas. */
export function GroupedBars({
  groups,
  series,
  format = (v: number) => `${v}%`,
  height = 200,
}: {
  groups: string[];
  series: { label: string; color: string; values: number[] }[];
  format?: (v: number) => string;
  height?: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const max = 100;
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 bottom-6 flex flex-col justify-between">
        {[100, 50, 0].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span className="w-8 text-right text-[10px] tabular-nums text-ink-400">{t}%</span>
            <span className="h-px flex-1 bg-ink-100" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bottom-6 left-10 flex items-end gap-6 px-2 sm:gap-10 sm:px-6">
        {groups.map((g, gi) => (
          <div key={g} className="flex h-full flex-1 items-end justify-center gap-[2px]">
            {series.map((s) => {
              const v = s.values[gi];
              const key = `${g}-${s.label}`;
              return (
                <div
                  key={key}
                  className="relative flex h-full flex-1 items-end"
                  onMouseEnter={() => setHover(key)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(key)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${g}, ${s.label}: ${format(v)}`}
                >
                  <span className="absolute inset-x-0 text-center text-xs font-extrabold text-ink-800" style={{ bottom: `calc(${(v / max) * 100}% + 4px)` }}>
                    {format(v)}
                  </span>
                  {hover === key && (
                    <div className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg" style={{ bottom: `calc(${(v / max) * 100}% + 24px)` }}>
                      {s.label} · {g}: {format(v)}
                    </div>
                  )}
                  <div
                    className="w-full origin-bottom animate-grow-y rounded-t-[4px]"
                    style={{ height: `${(v / max) * 100}%`, background: s.color, opacity: hover === null || hover === key ? 1 : 0.5 }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 left-10 flex gap-6 px-2 sm:gap-10 sm:px-6">
        {groups.map((g) => (
          <span key={g} className="flex-1 text-center text-[11px] font-semibold text-ink-500">
            {g}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Línea de una sola serie con crosshair y tooltip. */
export function LineChart({
  labels,
  values,
  color = SERIES.brand,
  format = (v: number) => `${v}%`,
  height = 200,
}: {
  labels: string[];
  values: number[];
  color?: string;
  format?: (v: number) => string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 200;
  const pad = { l: 8, r: 8, t: 16, b: 8 };
  const max = Math.max(...values) * 1.2;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (values.length - 1);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = `${d} L${x(values.length - 1)},${H} L${x(0)},${H} Z`;
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 bottom-6">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="lc-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.18" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((t) => (
            <line key={t} x1={0} x2={W} y1={H * t} y2={H * t} stroke="#EEEEF2" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill="url(#lc-fill)" />
          <path d={d} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="#B9B9C4" strokeDasharray="4 4" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        {values.map((v, i) => (
          <span
            key={i}
            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white transition-transform"
            style={{
              left: `${(x(i) / W) * 100}%`,
              top: `${(y(v) / H) * 100}%`,
              background: color,
              transform: `translate(-50%, -50%) scale(${hover === i ? 1.4 : 1})`,
            }}
          />
        ))}
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg"
            style={{ left: `${(x(hover) / W) * 100}%`, top: `calc(${(y(values[hover]) / H) * 100}% - 10px)` }}
          >
            {labels[hover]} · {format(values[hover])}
          </div>
        )}
        <div className="absolute inset-0 flex">
          {values.map((v, i) => (
            <div
              key={i}
              className="flex-1"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${labels[i]}: ${format(v)}`}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between">
        {labels.map((l) => (
          <span key={l} className="text-[11px] font-semibold text-ink-400">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Barras horizontales con valor al final (ranking). */
export function HBarList({
  items,
  color = SERIES.brand,
  format = (v: number) => formatNumber(v),
}: {
  items: { label: string; value: number; href?: string }[];
  color?: string;
  format?: (v: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={it.label} className="group">
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold text-ink-700">{it.label}</span>
            <span className="shrink-0 font-bold tabular-nums text-ink-900">{format(it.value)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full origin-left animate-grow-x rounded-full"
              style={{ width: `${(it.value / max) * 100}%`, background: color, animationDelay: `${i * 70}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
