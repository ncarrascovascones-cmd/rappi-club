import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'brand' | 'mint' | 'sun' | 'sky' | 'grape' | 'ink' | 'dark' | 'white';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  mint: 'bg-mint-50 text-mint-700 ring-mint-100',
  sun: 'bg-sun-50 text-sun-700 ring-sun-100',
  sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  grape: 'bg-grape-50 text-grape-600 ring-grape-100',
  ink: 'bg-ink-100 text-ink-600 ring-ink-200',
  dark: 'bg-ink-900 text-white ring-ink-800',
  white: 'bg-white/15 text-white ring-white/20 backdrop-blur',
};

export function Badge({
  tone = 'ink',
  icon,
  children,
  className,
  dot,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  );
}
