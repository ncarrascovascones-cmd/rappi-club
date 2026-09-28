import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function PageHeader({ title, subtitle, onBack, right }: PageHeaderProps) {
  return (
    <header className="animate-fade-up px-1 pb-5 pt-2">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-card transition active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{title}</h1>
        {right && <div className="ml-auto">{right}</div>}
      </div>
      {subtitle && <p className="mt-1.5 text-[15px] text-ink-500">{subtitle}</p>}
    </header>
  );
}
