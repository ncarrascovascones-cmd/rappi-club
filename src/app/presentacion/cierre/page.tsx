'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, BookOpen, Compass, HandHeart, HeartHandshake, MessageSquareText, RotateCcw, ShieldCheck, Users } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { ANALYTICS } from '@/lib/demo-data';
import { Logo } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';

const TAKEAWAYS = [
  { icon: Users, text: 'El problema: las primeras semanas se viven solas y se aprende a golpes.' },
  { icon: Compass, text: 'Rappi Crew: la escuela de la calle, donde la experiencia de la flota guía a los nuevos.' },
  { icon: HandHeart, text: 'El Copiloto acompaña de forma voluntaria: puede aceptar, pausar o dejar de participar sin penalización.' },
  { icon: MessageSquareText, text: 'Necesito una mano conecta cada problema con experiencias similares y el protocolo que aplica.' },
  { icon: BookOpen, text: 'Varias experiencias forman un patrón y el patrón se convierte en un Protocolo Crew.' },
  { icon: ShieldCheck, text: 'Rappi valida: ningún consejo se vuelve regla oficial automáticamente.' },
  { icon: BadgeCheck, text: 'Conocimiento colectivo: lo que uno aprende lo aprovechan todos los que vienen.' },
  { icon: HeartHandshake, text: 'Fidelización inicial: acompañamiento y pertenencia, sin puntos ni bonos.' },
];

export default function CierrePage() {
  const { state, startPresentation, stopPresentation, login } = useCrew();
  const router = useRouter();
  const published = state.protocols.filter((p) => p.status === 'publicado').length;
  const r = ANALYTICS.retention;

  return (
    <div className="min-h-dvh bg-ink-gradient text-white">
      <div className="bg-dots pointer-events-none fixed inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo light />
          <DemoBadge light align="right" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-fade-up">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-300">Pasa la Posta</p>
            <h1 className="mt-3 text-balance text-[36px] font-extrabold leading-[1.05] tracking-tight sm:text-[52px]">
              Tu experiencia guía a los nuevos.
            </h1>
            <p className="mt-3 text-lg font-semibold text-white/80">No aprendas a golpes. Aprende de los que ya pasaron por ahí.</p>
            <ul className="stagger mt-8 space-y-2.5">
              {TAKEAWAYS.map((t) => (
                <li key={t.text} className="flex items-start gap-3 text-[15px] text-white/85">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <t.icon className="h-4 w-4 text-brand-300" />
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">En esta demo</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-4xl font-extrabold">{published}</p>
                  <p className="text-xs text-white/60">Protocolos Crew publicados</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold">{state.experiences.length}</p>
                  <p className="text-xs text-white/60">experiencias compartidas</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white/[0.07] p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">Hipótesis a validar en un piloto</p>
                <span className="rounded-md bg-sun-400 px-1.5 py-0.5 text-[10px] font-extrabold text-ink-900">DATOS DEMO</span>
              </div>
              <p className="mt-2 text-sm text-white/75">Retención a 60 días de nuevos Rappitenderos (valores ilustrativos):</p>
              <div className="mt-4 space-y-3">
                {[
                  { l: 'Con Copiloto', v: r.withCopilot.d60, c: 'bg-brand-400' },
                  { l: 'Sin Copiloto', v: r.withoutCopilot.d60, c: 'bg-white/40' },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{b.l}</span>
                      <span>{b.v}%</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div className={`h-full origin-left animate-grow-x rounded-full ${b.c}`} style={{ width: `${b.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-white/45">Cifras ficticias. No representan datos de Rappi.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => {
                  startPresentation();
                  router.push('/inicio');
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 font-bold ring-1 ring-white/15 transition hover:bg-white/15"
              >
                <RotateCcw className="h-4 w-4" /> Repetir recorrido
              </button>
              <button
                onClick={() => {
                  stopPresentation();
                  login('nuevo');
                  router.push('/inicio');
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-gradient font-bold shadow-glow transition hover:brightness-110"
              >
                Explorar la plataforma
              </button>
            </div>
            <Link href="/presentacion" className="block text-center text-xs font-semibold text-white/50 hover:text-white">
              Volver a la portada de la presentación
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
