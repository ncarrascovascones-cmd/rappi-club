import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export function EmptyState({ icon, title, text }: EmptyStateProps) {
  return (
    <div className="animate-fade-in rounded-3xl border-2 border-dashed border-ink-200 px-6 py-8 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-500">{icon}</div>
      <p className="text-[15px] font-bold">{title}</p>
      <p className="mt-1 text-[13px] text-ink-500">{text}</p>
    </div>
  );
}
