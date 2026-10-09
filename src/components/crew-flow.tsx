import Link from 'next/link';
import {
  BadgeCheck,
  Bike,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Layers,
  Lightbulb,
  Repeat,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Actor = 'crew' | 'rappi' | 'protocolo';

export interface CrewFlowStep {
  title: string;
  text: string;
  actor: Actor;
  icon: LucideIcon;
}

/** El corazón de la propuesta: cómo una experiencia se convierte en conocimiento validado. */
export const CREW_FLOW: CrewFlowStep[] = [
  { title: 'Experiencia', text: 'Un Rappitendero vive una situación difícil en la calle.', actor: 'crew', icon: Bike },
  {
    title: 'Varios Rappitenderos comparten',
    text: 'La cuentan en Necesito una mano y Pasa la Posta.',
    actor: 'crew',
    icon: Users,
  },
  { title: 'Rappi identifica el patrón', text: 'Agrupa los casos similares y detecta lo que se repite.', actor: 'rappi', icon: Layers },
  { title: 'Rappi propone la solución', text: 'Redacta pasos claros a partir de lo que sí funcionó.', actor: 'rappi', icon: Lightbulb },
  {
    title: 'Rappi valida',
    text: 'Revisa que sea correcta y segura. Ningún consejo se vuelve regla automáticamente.',
    actor: 'rappi',
    icon: ShieldCheck,
  },
  { title: 'Protocolo Crew', text: 'Se publica con el sello “Validado por Rappi”.', actor: 'protocolo', icon: BadgeCheck },
  {
    title: 'El siguiente Rappitendero aprende',
    text: 'Quien empieza ya no aprende a golpes.',
    actor: 'crew',
    icon: GraduationCap,
  },
];

const ACTOR: Record<Actor, { label: string; chip: string; icon: string; dark: string }> = {
  crew: { label: 'La Crew', chip: 'bg-brand-50 text-brand-700', icon: 'bg-brand-gradient text-white shadow-glow', dark: 'bg-brand-500/15 text-brand-200' },
  rappi: { label: 'Rappi', chip: 'bg-ink-100 text-ink-700', icon: 'bg-ink-900 text-white', dark: 'bg-white/10 text-white/80' },
  protocolo: { label: 'Resultado', chip: 'bg-mint-50 text-mint-700', icon: 'bg-mint-gradient text-white', dark: 'bg-mint-500/20 text-mint-200' },
};

export function CrewFlow({
  counts,
  links,
  active,
  dark,
  className,
}: {
  /** Números vivos opcionales por paso (panel admin). */
  counts?: (number | string | null)[];
  links?: (string | null)[];
  /** Paso resaltado (modo presentación). */
  active?: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <ol className="grid gap-2 xl:grid-cols-7 xl:gap-3">
        {CREW_FLOW.map((s, i) => {
          const a = ACTOR[s.actor];
          const isActive = active === i;
          const dim = active !== undefined && !isActive;
          const count = counts?.[i];
          const href = links?.[i];
          const body = (
            <>
              <div className="flex items-center gap-3 xl:flex-col xl:items-start">
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', a.icon)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] font-extrabold', dark ? 'text-white/40' : 'text-ink-300')}>{i + 1}</span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', dark ? a.dark : a.chip)}>
                      {a.label}
                    </span>
                    {count !== undefined && count !== null && (
                      <span className={cn('ml-auto text-lg font-extrabold xl:hidden', dark ? 'text-white' : 'text-ink-900')}>{count}</span>
                    )}
                  </div>
                  <p className={cn('mt-1 text-[13px] font-extrabold uppercase leading-tight tracking-wide', dark ? 'text-white' : 'text-ink-900')}>
                    {s.title}
                  </p>
                </div>
              </div>
              <p className={cn('mt-1.5 pl-[52px] text-xs leading-snug xl:pl-0', dark ? 'text-white/60' : 'text-ink-500')}>{s.text}</p>
              {count !== undefined && count !== null && (
                <p className={cn('mt-auto hidden pt-2 text-2xl font-extrabold xl:block', dark ? 'text-white' : 'text-ink-900')}>{count}</p>
              )}
            </>
          );
          const cls = cn(
            'relative flex h-full flex-col rounded-2xl p-3.5 ring-1 transition-all duration-300',
            dark ? 'bg-white/[0.06] ring-white/10' : 'bg-white ring-ink-100',
            s.actor === 'protocolo' && !dark && 'bg-mint-50/60 ring-mint-200',
            isActive && (dark ? 'bg-white/15 ring-2 ring-brand-400' : 'ring-2 ring-brand-400 shadow-lift'),
            dim && 'opacity-45',
            href && 'hover:-translate-y-0.5 hover:shadow-card',
          );
          return (
            <li key={s.title} className="relative">
              {href ? (
                <Link href={href} className={cls}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
              {i < CREW_FLOW.length - 1 && (
                <>
                  <ChevronDown className={cn('mx-auto my-0.5 h-4 w-4 xl:hidden', dark ? 'text-white/30' : 'text-ink-300')} />
                  <ChevronRight
                    className={cn(
                      'absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 xl:block',
                      dark ? 'text-white/40' : 'text-ink-300',
                    )}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <p
        className={cn(
          'mt-3 flex items-center justify-center gap-2 text-center text-xs font-semibold',
          dark ? 'text-white/60' : 'text-ink-500',
        )}
      >
        <Repeat className="h-3.5 w-3.5 shrink-0" />
        Y cuando esa persona gane experiencia, su posta vuelve a sumar: así crece el conocimiento colectivo de la Crew.
      </p>
    </div>
  );
}
