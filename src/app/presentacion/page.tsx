'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Keyboard, Play } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { PRESENTATION_STEPS } from '@/lib/presentation';
import { Logo } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';
import { PitchSections } from '@/components/pitch-sections';

export default function PresentacionPage() {
  const { startPresentation } = useCrew();
  const router = useRouter();

  const start = () => {
    startPresentation();
    router.push('/inicio');
  };

  return (
    <div className="min-h-dvh bg-surface">
      <section className="relative overflow-hidden bg-ink-gradient px-5 pb-12 pt-6 text-white sm:px-10 lg:px-16">
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <Logo light />
            <div className="flex items-center gap-2">
              <DemoBadge light align="right" />
              <Link href="/" className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white sm:inline-flex">
                <ArrowLeft className="h-3.5 w-3.5" /> Salir
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="animate-fade-up">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-300">Innovathon · Campaña Pasa la Posta</p>
              <h1 className="mt-4 text-balance text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[60px]">
                Tu experiencia <span className="text-brand-400">guía</span> a los nuevos.
              </h1>
              <p className="mt-4 max-w-xl text-lg font-semibold text-white/85">
                No aprendas a golpes. Aprende de los que ya pasaron por ahí.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={start}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-7 text-base font-extrabold shadow-glow transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  <Play className="h-5 w-5 fill-current" /> Iniciar recorrido guiado
                </button>
                <p className="flex items-center gap-2 text-xs text-white/55">
                  <Keyboard className="h-4 w-4" /> ≈ 3 minutos · usa ← → para avanzar
                </p>
              </div>
            </div>

            <ol className="grid grid-cols-2 gap-1.5 text-sm sm:grid-cols-2">
              {PRESENTATION_STEPS.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-extrabold">
                    {i + 1}
                  </span>
                  <span className="truncate text-[13px] font-semibold text-white/85">{s.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 lg:px-16">
        <PitchSections />
        <div className="mt-12 flex flex-col items-center gap-3 rounded-[28px] bg-white p-8 text-center shadow-card">
          <p className="text-xl font-extrabold text-ink-900">Veámoslo funcionando</p>
          <p className="max-w-md text-sm text-ink-500">
            Un recorrido de 10 pasos: de la primera semana de Valentina a un Protocolo Crew nuevo, validado y publicado por Rappi.
          </p>
          <button
            onClick={start}
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-2xl bg-brand-gradient px-6 font-extrabold text-white shadow-glow transition hover:-translate-y-0.5"
          >
            <Play className="h-4 w-4 fill-current" /> Iniciar recorrido guiado
          </button>
          <p className="text-xs text-ink-400">Al iniciar, la demo vuelve a sus datos de ejemplo para que el caso salga siempre igual.</p>
        </div>
      </div>
    </div>
  );
}
