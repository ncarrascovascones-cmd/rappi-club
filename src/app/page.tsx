'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, BadgeCheck, HandHeart, Loader2, Presentation, ShieldCheck, Sparkles, Users, Bike } from 'lucide-react';
import { Logo } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';
import { Avatar } from '@/components/ui/avatar';
import { useCrew } from '@/lib/store';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

const ROLES: {
  id: Role;
  title: string;
  who: string;
  description: string;
  home: string;
  icon: typeof Users;
  accent: string;
  points: string[];
}[] = [
  {
    id: 'nuevo',
    title: 'Nuevo Rappitendero',
    who: 'Valentina · 9 días en la calle',
    description: 'Empieza acompañado: tu Copiloto, Protocolos Crew y una mano cuando la necesites.',
    home: '/inicio',
    icon: Bike,
    accent: 'from-brand-400 to-brand-600',
    points: ['Copiloto asignado', 'Necesito una mano', 'Protocolos Crew'],
  },
  {
    id: 'copiloto',
    title: 'Copiloto',
    who: 'Andrés · 3 años en Chapinero',
    description: 'Comparte tu experiencia con quien empieza. Ser Copiloto es voluntario: puedes aceptar, pausar o dejar de participar sin penalización.',
    home: '/copiloto',
    icon: HandHeart,
    accent: 'from-mint-400 to-mint-600',
    points: ['Invitaciones voluntarias', 'Acompañados', 'Pasa la Posta'],
  },
  {
    id: 'admin',
    title: 'Administrador Rappi',
    who: 'Laura · Operaciones Rappi Crew',
    description: 'Convierte experiencias reales de la flota en Protocolos Crew validados.',
    home: '/admin',
    icon: ShieldCheck,
    accent: 'from-ink-600 to-ink-900',
    points: ['Casos y experiencias', 'Patrones', 'Validar y publicar'],
  },
];

export default function LoginPage() {
  const { login } = useCrew();
  const router = useRouter();
  const [loading, setLoading] = useState<Role | null>(null);

  const enter = (role: Role, home: string) => {
    setLoading(role);
    login(role);
    window.setTimeout(() => router.push(home), 450);
  };

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[1.05fr_1fr]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-gradient px-6 pb-12 pt-8 text-white sm:px-10 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <Logo light />
          <DemoBadge light align="right" />
        </div>

        <div className="relative mt-12 max-w-xl animate-fade-up lg:mt-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/15">
            <Sparkles className="h-3.5 w-3.5" /> Campaña · PASA LA POSTA
          </span>
          <h1 className="mt-5 text-balance text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[52px]">
            Tu experiencia <span className="text-brand-400">guía</span> a los nuevos.
          </h1>
          <p className="mt-4 max-w-md text-lg font-bold leading-snug text-white">
            No aprendas a golpes. Aprende de los que ya pasaron por ahí.
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/65">
            Rappi Crew es la escuela de la calle: Rappitenderos con experiencia acompañan voluntariamente a quienes
            empiezan, y lo que la flota aprende se convierte en Protocolos Crew validados por Rappi.
          </p>

          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              { v: 'Copiloto', l: 'voluntario, sin obligación' },
              { v: 'Protocolos', l: 'nacidos de la calle' },
              { v: 'Validado', l: 'siempre por Rappi' },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-white/[0.07] p-3 ring-1 ring-white/10">
                <p className="text-sm font-extrabold">{s.v}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/55">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10 hidden items-center gap-3 lg:flex">
          <div className="flex -space-x-2">
            <Avatar initials="AR" color="#2A78D6" size="sm" ring />
            <Avatar initials="LG" color="#12B07A" size="sm" ring />
            <Avatar initials="CP" color="#6D55E0" size="sm" ring />
            <Avatar initials="MS" color="#F5A300" size="sm" ring />
          </div>
          <p className="text-sm text-white/60">
            <span className="font-bold text-white">Copilotos voluntarios</span> acompañando nuevos en tu ciudad
          </p>
        </div>
      </section>

      {/* Selección de perfil */}
      <section className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">Entrada demo</p>
          <h2 className="mt-2 text-[28px] font-extrabold tracking-tight text-ink-900">¿Cómo quieres entrar?</h2>
          <p className="mt-1.5 text-[15px] text-ink-500">
            Elige un perfil. En este prototipo no necesitas contraseña.
          </p>

          <div className="stagger mt-7 space-y-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => enter(r.id, r.home)}
                disabled={loading !== null}
                className={cn(
                  'group flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-card ring-1 ring-ink-900/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-wait sm:p-5',
                  loading === r.id && 'ring-2 ring-brand-400',
                )}
              >
                <span
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md',
                    r.accent,
                  )}
                >
                  <r.icon className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-extrabold text-ink-900">{r.title}</span>
                  <span className="block text-xs font-semibold text-ink-400">{r.who}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-ink-500">{r.description}</span>
                  <span className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                    {r.points.map((p) => (
                      <span key={p} className="rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
                        {p}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-500 transition group-hover:bg-brand-500 group-hover:text-white">
                  {loading === r.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/presentacion"
            className="group mt-4 flex items-center gap-3 rounded-3xl bg-ink-900 p-4 text-white shadow-lift transition hover:-translate-y-0.5 sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
              <Presentation className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">Modo presentación</span>
              <span className="block text-[13px] text-white/60">Recorrido guiado de 3 minutos para el jurado.</span>
            </span>
            <ArrowRight className="h-5 w-5 text-brand-300 transition group-hover:translate-x-1" />
          </Link>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-ink-500 ring-1 ring-ink-100">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />
            <p>
              <b className="text-ink-700">Modo demo.</b> Prototipo con datos ficticios: personas, historias y métricas son de
              ejemplo. Lo que crees se guarda solo durante esta sesión del navegador. No es una aplicación oficial ni está
              conectada a sistemas de Rappi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
