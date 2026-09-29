'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { DEMO_CLOSING } from '@/lib/presentation';
import { LogoMark } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';

export default function CierrePage() {
  const { startPresentation, stopPresentation, login } = useCrew();
  const router = useRouter();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-ink-gradient text-white">
      <div className="bg-dots absolute inset-0 opacity-50" />
      <div className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand-500/35 blur-3xl" />
      <header className="relative flex justify-end px-6 py-5 lg:px-12">
        <DemoBadge light align="right" />
      </header>

      <main className="relative mx-auto flex w-full max-w-4xl flex-1 animate-fade-up flex-col items-center justify-center px-6 pb-12 text-center">
        <LogoMark className="h-16 w-16 rounded-[20px]" />
        <p className="mt-5 text-[44px] font-extrabold leading-none tracking-tight sm:text-[64px]">
          RAPPI <span className="text-brand-400">CREW</span>
        </p>
        <p className="mt-3 text-xl font-semibold text-white/70">“La escuela de la calle”</p>
        <p className="mt-10 text-balance text-[26px] font-extrabold leading-snug tracking-tight sm:text-[34px]">{DEMO_CLOSING}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              startPresentation();
              router.push('/presentacion/demo');
            }}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-bold ring-1 ring-white/15 transition hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" /> Repetir demo
          </button>
          <button
            onClick={() => {
              stopPresentation();
              login('nuevo');
              router.push('/inicio');
            }}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-gradient px-4 text-sm font-bold shadow-glow transition hover:brightness-110"
          >
            Explorar la plataforma
          </button>
          <Link href="/como-funciona" onClick={() => login('nuevo')} className="inline-flex h-11 items-center rounded-2xl px-4 text-sm font-semibold text-white/60 hover:text-white">
            Cómo funciona
          </Link>
        </div>
      </main>
    </div>
  );
}
