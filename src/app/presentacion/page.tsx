'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Compass, Keyboard, Play } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { DEMO_STEPS } from '@/lib/presentation';
import { LogoMark } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';

export default function PresentacionPage() {
  const { startPresentation, state, login } = useCrew();
  const router = useRouter();

  const start = () => {
    startPresentation();
    router.push('/presentacion/demo');
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-ink-gradient text-white">
      <div className="bg-dots absolute inset-0 opacity-60" />
      <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand-500/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />

      <header className="relative flex items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> Salir
        </Link>
        <DemoBadge light align="right" />
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
        <LogoMark className="h-16 w-16 rounded-[20px]" />
        <p className="mt-5 text-[40px] font-extrabold leading-none tracking-tight sm:text-[56px]">
          RAPPI <span className="text-brand-400">CREW</span>
        </p>
        <p className="mt-2 text-lg font-semibold text-white/60">La escuela de la calle</p>

        <h1 className="mt-10 text-balance text-[32px] font-extrabold leading-tight tracking-tight sm:text-[48px]">
          “Tu experiencia guía a los nuevos.”
        </h1>
        <p className="mt-3 text-balance text-lg font-semibold text-white/80 sm:text-xl">
          No aprendas a golpes. Aprende de los que ya pasaron por ahí.
        </p>

        <button
          onClick={start}
          className="mt-10 inline-flex h-16 items-center gap-3 rounded-2xl bg-brand-gradient px-8 text-lg font-extrabold uppercase tracking-wide shadow-glow transition hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
        >
          <Play className="h-6 w-6 fill-current" /> Iniciar demo — 40 segundos
        </button>

        <ol className="mt-8 flex flex-wrap justify-center gap-2 text-xs font-semibold text-white/70">
          {DEMO_STEPS.map((s, i) => (
            <li key={s.id} className="rounded-full bg-white/[0.07] px-3 py-1.5 ring-1 ring-white/10">
              {i + 1}. {s.label}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <Keyboard className="h-4 w-4" /> → o espacio para avanzar · Esc para salir
          </span>
          <Link href="/como-funciona" onClick={() => !state.role && login('nuevo')} className="inline-flex items-center gap-1.5 hover:text-white">
            <Compass className="h-4 w-4" /> Explicación completa
          </Link>
        </div>
      </main>
    </div>
  );
}
