import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white/60 px-6 py-10 text-center',
        className,
      )}
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">{icon}</div>
      <p className="font-bold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn('flex items-center gap-1.5 text-xs font-semibold text-brand-700', className)}>
      <AlertTriangle className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

export function SuccessPanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('animate-scale-in rounded-3xl bg-mint-50 p-6 text-center ring-1 ring-mint-100', className)}>
      <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint-400/40" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-mint-gradient text-white shadow-lg">
          <CheckCircle2 className="h-8 w-8" />
        </span>
      </div>
      <p className="text-lg font-extrabold text-ink-900">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-ink-600">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-2xl bg-[length:800px_100%] bg-gradient-to-r from-ink-100 via-ink-50 to-ink-100',
        className,
      )}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
