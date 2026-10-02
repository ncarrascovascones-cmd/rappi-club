import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Label({ children, htmlFor, hint }: { children: ReactNode; htmlFor?: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-bold text-ink-800">
      <span>{children}</span>
      {hint && <span className="text-xs font-medium text-ink-400">{hint}</span>}
    </label>
  );
}

const fieldBase =
  'w-full rounded-2xl border-0 bg-ink-50 px-4 text-[15px] text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400';

export function TextArea({ className, invalid, ...rest }: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(fieldBase, 'min-h-[120px] resize-y py-3 leading-relaxed', invalid && 'ring-brand-400', className)}
      {...rest}
    />
  );
}

export function Input({ className, invalid, ...rest }: ComponentProps<'input'> & { invalid?: boolean }) {
  return <input className={cn(fieldBase, 'h-12', invalid && 'ring-brand-400', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  return (
    <select className={cn(fieldBase, 'h-12 appearance-none pr-10', className)} {...rest}>
      {children}
    </select>
  );
}

export function Chip({
  active,
  children,
  className,
  ...rest
}: ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold transition-all active:scale-95',
        active ? 'bg-ink-900 text-white shadow-sm' : 'bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
