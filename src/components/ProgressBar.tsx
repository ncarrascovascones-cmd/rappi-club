import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  /** Clases del relleno (gradiente). */
  fill?: string;
  track?: string;
  height?: string;
  label?: string;
}

/** Barra de progreso que se anima desde 0 al montarse y al cambiar de valor. */
export function ProgressBar({
  value,
  fill = 'bg-brand-gradient',
  track = 'bg-ink-100',
  height = 'h-2.5',
  label = 'Progreso',
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(Math.max(0, Math.min(value, 100))));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full ${track} ${height}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div
        className={`relative h-full overflow-hidden rounded-full ${fill} transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{ width: `${width}%` }}
      >
        <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
