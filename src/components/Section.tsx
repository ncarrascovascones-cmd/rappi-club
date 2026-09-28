import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Retraso de la animación de entrada, en ms. */
  delay?: number;
}

export function Section({ title, subtitle, action, children, className = '', delay = 0 }: SectionProps) {
  return (
    <section className={`animate-fade-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-[18px] font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-ink-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Nota pequeña para aclaraciones conceptuales. */
export function Disclaimer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-center text-[11.5px] leading-relaxed text-ink-400 ${className}`}>{children}</p>;
}

export function ConceptTag({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-ink-300 px-2 py-0.5 text-[10px] font-semibold text-ink-500 ${className}`}
    >
      Ejemplo conceptual
    </span>
  );
}
