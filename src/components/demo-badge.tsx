'use client';

import { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Indicador permanente de que todo lo que se ve son datos ficticios. */
export function DemoBadge({ className, light, align = 'left' }: { className?: string; light?: boolean; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ring-inset transition',
          light ? 'bg-white/10 text-white ring-white/20 hover:bg-white/15' : 'bg-sun-50 text-sun-700 ring-sun-100 hover:bg-sun-100',
        )}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sun-500" />
        </span>
        Modo demo
      </button>
      {open && (
        <span
          role="tooltip"
          className={cn('absolute top-full', align === 'left' ? 'left-0' : 'right-0', ' z-50 mt-2 w-64 animate-fade-in rounded-2xl bg-ink-900 p-3 text-left text-xs font-medium normal-case leading-relaxed tracking-normal text-white/80 shadow-lift')}
        >
          <span className="mb-1 flex items-center gap-1.5 font-bold text-white">
            <FlaskConical className="h-3.5 w-3.5 text-sun-400" /> Prototipo con datos ficticios
          </span>
          Personas, historias, protocolos, beneficios y métricas son de ejemplo. Nada representa datos reales de Rappi ni
          de sus Rappitenderos.
        </span>
      )}
    </span>
  );
}
