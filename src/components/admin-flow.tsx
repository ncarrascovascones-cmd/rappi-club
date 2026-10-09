import Link from 'next/link';
import { ArrowRight, BookPlus, FileSearch, Layers, Lightbulb, Megaphone, ShieldCheck, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlowStep {
  key: string;
  label: string;
  count: number;
  hint: string;
  href: string;
}

const ICONS: LucideIcon[] = [FileSearch, Layers, Lightbulb, BookPlus, ShieldCheck, Megaphone];

/** Flujo: Analizar experiencias → identificar patrón → proponer solución → crear protocolo → validar → publicar. */
export function AdminFlow({ steps, active }: { steps: FlowStep[]; active?: string }) {
  return (
    <ol className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 xl:grid-cols-6">
      {steps.map((s, i) => {
        const Icon = ICONS[i];
        const isActive = active === s.key;
        return (
          <li key={s.key} className="relative w-[180px] shrink-0 sm:w-auto">
            <Link
              href={s.href}
              className={cn(
                'group flex h-full flex-col rounded-2xl p-4 ring-1 transition-all hover:-translate-y-0.5',
                isActive ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white ring-ink-100 hover:shadow-card',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl',
                    isActive ? 'bg-brand-gradient text-white' : 'bg-brand-50 text-brand-600',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className={cn('text-2xl font-extrabold', isActive ? 'text-white' : 'text-ink-900')}>{s.count}</span>
              </div>
              <p className={cn('mt-3 text-[11px] font-bold uppercase tracking-wider', isActive ? 'text-white/50' : 'text-ink-400')}>
                Paso {i + 1}
              </p>
              <p className="text-sm font-extrabold leading-snug">{s.label}</p>
              <p className={cn('mt-0.5 text-xs', isActive ? 'text-white/60' : 'text-ink-500')}>{s.hint}</p>
              <ArrowRight
                className={cn(
                  'mt-2 h-4 w-4 transition group-hover:translate-x-1',
                  isActive ? 'text-brand-300' : 'text-ink-300 group-hover:text-brand-500',
                )}
              />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
