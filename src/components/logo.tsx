import { cn } from '@/lib/utils';

/** Marca propia de Rappi Crew: una "posta" (testigo de relevo) con líneas de movimiento. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-brand-gradient shadow-glow',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <path d="M8 15h7M6 20h8M9 25h6" stroke="white" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="17" y="12.5" width="16" height="15" rx="7.5" fill="white" transform="rotate(-18 25 20)" />
        <rect x="21" y="17.5" width="8" height="5" rx="2.5" fill="#FF5B35" transform="rotate(-18 25 20)" />
      </svg>
    </span>
  );
}

export function Logo({ className, light, compact }: { className?: string; light?: boolean; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="leading-none">
        <span className={cn('block text-[17px] font-extrabold tracking-tight', light ? 'text-white' : 'text-ink-900')}>
          RAPPI <span className="text-brand-500">CREW</span>
        </span>
        {!compact && (
          <span className={cn('mt-1 block text-[11px] font-semibold', light ? 'text-white/60' : 'text-ink-400')}>
            La escuela de la calle
          </span>
        )}
      </span>
    </span>
  );
}
