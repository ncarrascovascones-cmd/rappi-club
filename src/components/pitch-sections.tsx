import {
  Ban,
  BookOpen,
  Brain,
  HandHeart,
  HeartHandshake,
  LifeBuoy,
  Repeat,
  Send,
  ShieldCheck,
  Users,
  UserX,
  Hammer,
} from 'lucide-react';
import { VOLUNTARY_RULE, VOLUNTARY_RULE_DETAIL } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { CrewFlow } from './crew-flow';

function Heading({ n, eyebrow, title, text }: { n: number; eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-5 max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white">{n}</span>
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance text-[24px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[30px]">{title}</h2>
      {text && <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{text}</p>}
    </div>
  );
}

const PROBLEMS = [
  {
    icon: Hammer,
    title: 'Se aprende a golpes',
    text: 'Clientes que no responden, tiendas que demoran, entregas lejanas… y nadie a quién preguntar en el momento.',
  },
  {
    icon: Repeat,
    title: 'Las mismas dudas, una y otra vez',
    text: 'Cada persona nueva repite errores que la flota ya resolvió muchas veces.',
  },
  {
    icon: UserX,
    title: 'La experiencia se pierde',
    text: 'Lo que saben quienes llevan años en la calle no llega a quien empieza. Y la etapa inicial es donde más fácil se abandona.',
  },
];

const PILLARS = [
  {
    icon: HandHeart,
    title: 'Copiloto',
    text: 'Un Rappitendero con experiencia que acompaña al nuevo. Voluntario, sin penalización. No es supervisor ni trabajador de Rappi.',
    tone: 'bg-mint-50 text-mint-600',
  },
  {
    icon: LifeBuoy,
    title: 'Necesito una mano',
    text: 'Cuentas lo que pasó y recibes experiencias similares y el Protocolo Crew que aplica. Tu caso ayuda a detectar patrones.',
    tone: 'bg-brand-50 text-brand-600',
  },
  {
    icon: BookOpen,
    title: 'Protocolos Crew',
    text: 'Soluciones paso a paso construidas con experiencias reales y validadas por Rappi.',
    tone: 'bg-ink-100 text-ink-700',
  },
  {
    icon: Send,
    title: 'Pasa la Posta',
    text: '“¿Qué aprendiste que te hubiera gustado saber cuando comenzaste?” La campaña que alimenta el conocimiento de la Crew.',
    tone: 'bg-sun-50 text-sun-700',
  },
];

const NOT = ['No es una app de navegación', 'No hay puntos, niveles ni rankings', 'No hay bonos ni premios económicos', 'Nadie está obligado a ser Copiloto'];

/** Explicación completa de la propuesta en 7 bloques, pensada para entenderse en menos de 3 minutos. */
export function PitchSections({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-14', className)}>
      <section>
        <Heading n={1} eyebrow="El problema" title="Las primeras semanas en la calle se viven solas." />
        <div className="grid gap-3 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-900/[0.04]">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <p.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-extrabold text-ink-900">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Heading
          n={2}
          eyebrow="Qué es Rappi Crew"
          title="La escuela de la calle."
          text="Una red de acompañamiento entre Rappitenderos donde la experiencia de la flota se convierte en conocimiento validado por Rappi. No aprendas a golpes: aprende de los que ya pasaron por ahí."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-900/[0.04]">
              <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', p.tone)}>
                <p.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-extrabold text-ink-900">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-mint-50 px-4 py-3 text-sm text-mint-700 ring-1 ring-mint-100">
          <HandHeart className="h-4 w-4 shrink-0" />
          <span>
            <b>{VOLUNTARY_RULE}</b> {VOLUNTARY_RULE_DETAIL}
          </span>
        </p>
      </section>

      <section>
        <Heading
          n={3}
          eyebrow="El corazón de la propuesta"
          title="Cómo una experiencia se convierte en un Protocolo Crew."
          text="La Crew aporta lo que vive. Rappi identifica el patrón, propone la solución y la valida. El siguiente Rappitendero aprende."
        />
        <div className="rounded-[28px] bg-ink-gradient p-4 sm:p-6">
          <CrewFlow dark />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/[0.04]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">4 · Rappi valida</p>
          <ShieldCheck className="mt-3 h-8 w-8 text-mint-600" />
          <p className="mt-2 text-lg font-extrabold text-ink-900">Un consejo no es una regla.</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">
            Las experiencias de los Rappitenderos no se convierten automáticamente en reglas oficiales. Rappi revisa, ajusta y
            valida cada solución antes de publicarla con el sello “Validado por Rappi”.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/[0.04]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">5 · Conocimiento colectivo</p>
          <Brain className="mt-3 h-8 w-8 text-grape-500" />
          <p className="mt-2 text-lg font-extrabold text-ink-900">Lo que uno aprende, lo aprovechan todos.</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">
            Cada protocolo nace de muchas experiencias y sirve a todos los que vienen después. Y quien hoy es nuevo, mañana
            pasa su propia posta.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/[0.04]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-600">6 · Fidelización inicial</p>
          <HeartHandshake className="mt-3 h-8 w-8 text-brand-500" />
          <p className="mt-2 text-lg font-extrabold text-ink-900">Nadie empieza solo.</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-500">
            En las semanas más frágiles, el nuevo tiene a quién preguntar, resuelve más rápido y se siente parte de una
            comunidad. Pertenencia, no puntos ni bonos.
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/[0.04]">
        <p className="flex items-center gap-2 font-extrabold text-ink-900">
          <Users className="h-5 w-5 text-ink-400" /> Lo que Rappi Crew no es
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {NOT.map((n) => (
            <p key={n} className="flex items-center gap-2 rounded-2xl bg-ink-50 px-3 py-2.5 text-sm font-semibold text-ink-700">
              <Ban className="h-4 w-4 shrink-0 text-brand-500" /> {n}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
