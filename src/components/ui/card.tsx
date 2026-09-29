import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, interactive, ...rest }: ComponentProps<'div'> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white shadow-card ring-1 ring-ink-900/[0.04]',
        interactive && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift',
        className,
      )}
      {...rest}
    />
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-3 flex items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-extrabold tracking-tight text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
