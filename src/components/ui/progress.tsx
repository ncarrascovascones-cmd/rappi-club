import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
  tone = 'brand',
  label,
}: {
  value: number;
  className?: string;
  tone?: 'brand' | 'mint' | 'white';
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full', tone === 'white' ? 'bg-white/20' : 'bg-ink-100', className)}
    >
      <div
        className={cn(
          'h-full origin-left animate-grow-x rounded-full transition-[width] duration-700',
          tone === 'brand' && 'bg-brand-gradient',
          tone === 'mint' && 'bg-mint-gradient',
          tone === 'white' && 'bg-white',
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Ring({ value, size = 64, stroke = 7, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, value)) / 100}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2,0.7,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
