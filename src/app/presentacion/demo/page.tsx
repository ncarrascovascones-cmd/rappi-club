'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HandHeart,
  Layers,
  Lightbulb,
  MapPin,
  Pause,
  Play,
  SendHorizonal,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import type { Protocol } from '@/lib/types';
import { DEMO_CASE } from '@/lib/demo-data';
import { DEMO_STEPS, DEMO_TOTAL_SECONDS } from '@/lib/presentation';
import { HELP_CATEGORIES, VEHICLE_LABEL } from '@/lib/labels';
import { cn, monthsLabel, protocolCode } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { DemoBadge } from '@/components/demo-badge';
import { Avatar } from '@/components/ui/avatar';
import { CategoryIcon } from '@/components/category-icon';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function DemoPage() {
  const crew = useCrew();
  const { state, hydrated, startPresentation, stopPresentation, login } = crew;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sentId, setSentId] = useState<string | null>(null);
  const [stage, setStage] = useState(0); // animación de la escena 4 (0–4)
  const startedAt = useRef<number>(Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;

  // Si se abre la demo directamente (sin pasar por la portada), se preparan los datos del caso una sola vez.
  const prepared = useRef(false);
  useEffect(() => {
    if (!hydrated || prepared.current) return;
    prepared.current = true;
    if (!stateRef.current.presentation.active) startPresentation();
  }, [hydrated, startPresentation]);

  useEffect(() => {
    const t = window.setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 250);
    return () => window.clearInterval(t);
  }, []);

  const protocol = state.protocols.find((p) => p.id === DEMO_CASE.protocolId);
  const cluster = state.clusters.find((c) => c.id === DEMO_CASE.clusterId);

  /** Escena 2: enviar la experiencia precargada (sin esperas artificiales). */
  const send = useCallback(async () => {
    if (sentId) return sentId;
    const req = await crew.submitHelp({ category: DEMO_CASE.category, text: DEMO_CASE.text }, { instant: true });
    setSentId(req.id);
    return req.id;
  }, [crew, sentId]);

  /** Escena 4: Rappi valida y publica (idempotente). */
  const validate = useCallback(async () => {
    const p = stateRef.current.protocols.find((x) => x.id === DEMO_CASE.protocolId);
    if (p && (p.status === 'borrador' || p.status === 'en_validacion')) {
      await crew.setProtocolStatus(DEMO_CASE.protocolId, 'aprobado', { instant: true });
    }
  }, [crew]);
  const publish = useCallback(async () => {
    const p = stateRef.current.protocols.find((x) => x.id === DEMO_CASE.protocolId);
    if (p && p.status !== 'publicado') await crew.setProtocolStatus(DEMO_CASE.protocolId, 'publicado', { instant: true });
  }, [crew]);

  // Animación de la escena 4: cada etapa se enciende en secuencia.
  useEffect(() => {
    if (step !== 3) return;
    const published = stateRef.current.protocols.find((x) => x.id === DEMO_CASE.protocolId)?.status === 'publicado';
    if (published) {
      setStage(4);
      return;
    }
    setStage(0);
    const timers = [1, 2, 3, 4].map((i) => window.setTimeout(() => setStage(i), i * 1300));
    return () => timers.forEach(window.clearTimeout);
  }, [step]);

  useEffect(() => {
    if (step !== 3) return;
    if (stage >= 3) validate();
    if (stage >= 4) publish();
  }, [stage, step, validate, publish]);

  const finish = useCallback(() => {
    stopPresentation();
    router.push('/presentacion/cierre');
  }, [router, stopPresentation]);

  const next = useCallback(async () => {
    if (step === 1) await send();
    if (step === 2 && !sentId) await send();
    if (step === 3) {
      setStage(4);
      await validate();
      await publish();
    }
    if (step >= DEMO_STEPS.length - 1) finish();
    else setStep(step + 1);
  }, [step, send, sentId, validate, publish, finish]);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
      if (e.key === 'Escape') router.push('/presentacion');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, router]);

  // Reproducción automática: avanza según la duración sugerida de cada escena.
  const nextRef = useRef(next);
  nextRef.current = next;
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    if (!auto) return;
    const timers: number[] = [];
    if (step === 1) timers.push(window.setTimeout(() => sendRef.current(), 2500));
    timers.push(window.setTimeout(() => nextRef.current(), DEMO_STEPS[step].seconds * 1000));
    return () => timers.forEach(window.clearTimeout);
  }, [auto, step]);

  const current = DEMO_STEPS[step];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface">
      {/* Barra superior */}
      <header className="flex shrink-0 items-center gap-3 border-b border-ink-100 bg-white px-5 py-3 lg:px-8">
        <Logo compact />
        <span
          className={cn(
            'ml-2 hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex',
            current.view === 'admin' ? 'bg-ink-900 text-white' : 'bg-brand-50 text-brand-700',
          )}
        >
          Vista: {current.view === 'admin' ? 'Administrador Rappi' : 'Nuevo Rappitendero'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <DemoBadge align="right" />
          <Link
            href="/presentacion"
            className="rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
            aria-label="Salir de la demo"
            title="Salir (Esc)"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Escena */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-6 lg:overflow-hidden lg:px-10 lg:py-8">
        <div key={step} className="mx-auto flex w-full max-w-6xl flex-1 animate-fade-up flex-col">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Paso {step + 1} de {DEMO_STEPS.length} · {current.label}
          </p>
          <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 lg:text-[40px]">{current.title}</h1>
          <div className="mt-5 flex min-h-0 flex-1 items-center">
            {step === 0 && <SceneCopilot />}
            {step === 1 && <SceneHelp sent={!!sentId} onSend={() => send().then(() => setStep(2))} />}
            {step === 2 && <SceneCrew cases={cluster?.cases ?? 0} />}
            {step === 3 && <SceneRappi stage={stage} />}
            {step === 4 && protocol && (
              <SceneLearn
                protocol={protocol}
                onOpen={() => {
                  stopPresentation();
                  login('nuevo');
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Controles */}
      <footer className="shrink-0 border-t border-ink-100 bg-white px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <ol className="flex flex-1 gap-1.5">
            {DEMO_STEPS.map((s, i) => (
              <li key={s.id} className="flex-1">
                <button
                  onClick={() => setStep(i)}
                  className="group w-full text-left"
                  aria-label={`Ir al paso ${i + 1}: ${s.label}`}
                  aria-current={i === step}
                >
                  <span className={cn('block h-1.5 rounded-full transition', i < step ? 'bg-brand-400' : i === step ? 'bg-ink-900' : 'bg-ink-100 group-hover:bg-ink-200')} />
                  <span className={cn('mt-1 hidden truncate text-[11px] font-bold md:block', i === step ? 'text-ink-900' : 'text-ink-400')}>
                    {i + 1}. {s.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <span className="hidden w-[88px] text-right text-xs font-bold tabular-nums text-ink-400 sm:block" title="Tiempo transcurrido">
            {fmt(elapsed)} / {fmt(DEMO_TOTAL_SECONDS)}
          </span>
          <button
            onClick={() => setAuto((a) => !a)}
            className={cn(
              'inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition',
              auto ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-100',
            )}
            aria-pressed={auto}
            title="Avanzar automáticamente (≈40 s)"
          >
            {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden lg:inline">{auto ? 'Automático' : 'Auto 40 s'}</span>
          </button>
          <button onClick={prev} disabled={step === 0} className="rounded-xl p-2.5 text-ink-500 transition hover:bg-ink-100 disabled:opacity-30" aria-label="Paso anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="inline-flex h-11 items-center gap-1.5 rounded-2xl bg-ink-900 px-5 text-sm font-extrabold text-white transition hover:bg-ink-800 active:scale-95"
          >
            {step === DEMO_STEPS.length - 1 ? 'Cierre' : 'Siguiente'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Escena 1: Mi Copiloto ---------- */
function SceneCopilot() {
  const { state } = useCrew();
  const { assigned } = useSelectors();
  const r = state.rider;
  if (!assigned) return null;
  return (
    <div className="grid w-full items-center gap-5 lg:grid-cols-[1fr_auto_1.6fr]">
      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-900/[0.04]">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Nuevo Rappitendero</p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar initials={r.initials} color={r.color} size="lg" />
          <div>
            <p className="text-xl font-extrabold text-ink-900">{r.name}</p>
            <p className="text-sm text-ink-500">
              {r.joinedDaysAgo} días en la calle · {r.zone}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <span className="flex h-12 w-12 rotate-90 items-center justify-center rounded-full bg-mint-500 text-white shadow-lg lg:rotate-0">
          <HandHeart className="h-6 w-6 -rotate-90 lg:rotate-0" />
        </span>
      </div>
      <div className="rounded-3xl bg-white p-7 shadow-lift ring-2 ring-mint-200">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-mint-700">Tu Copiloto</p>
        <div className="mt-4 flex items-center gap-4">
          <Avatar initials={assigned.initials} color={assigned.color} size="xl" online />
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-ink-900">{assigned.name}</p>
            <p className="mt-1 text-[15px] text-ink-500">
              {monthsLabel(assigned.monthsOnPlatform)} en la calle · {assigned.zone} · {VEHICLE_LABEL[assigned.vehicle]}
            </p>
          </div>
        </div>
        <p className="mt-5 text-lg font-bold leading-snug text-ink-900">
          Rappitendero con experiencia que decidió voluntariamente acompañarte.
        </p>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-mint-50 px-4 py-3 text-[15px] text-mint-700 ring-1 ring-mint-100">
          <HandHeart className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            <b>Ser Copiloto es voluntario.</b> Puede aceptar, pausar o dejar de participar sin penalización.
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------- Escena 2: Necesito una mano ---------- */
function SceneHelp({ sent, onSend }: { sent: boolean; onSend: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-lift ring-1 ring-ink-900/[0.04] lg:p-8">
      <p className="text-sm font-bold text-ink-500">¿Qué pasó en la calle?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {HELP_CATEGORIES.map((c) => {
          const active = c.id === DEMO_CASE.category;
          return (
            <span
              key={c.id}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold transition',
                active ? 'bg-ink-900 text-white shadow-lift' : 'bg-ink-50 text-ink-400',
              )}
            >
              {active && <Check className="h-4 w-4 text-brand-300" />}
              {c.label}
            </span>
          );
        })}
      </div>
      <div className="mt-5 rounded-2xl bg-ink-50 px-5 py-4 text-[17px] leading-relaxed text-ink-800 ring-1 ring-ink-200">
        {DEMO_CASE.text}
      </div>
      <button
        disabled={busy && !sent}
        onClick={() => {
          setBusy(true);
          onSend();
        }}
        className={cn(
          'mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-white transition active:scale-[0.98]',
          sent ? 'bg-mint-500' : 'bg-brand-gradient shadow-glow hover:brightness-105',
        )}
      >
        {sent ? <Check className="h-5 w-5" /> : <SendHorizonal className="h-5 w-5" />}
        {sent ? 'Experiencia enviada' : 'Enviar experiencia'}
      </button>
    </div>
  );
}

/* ---------- Escena 3: la experiencia entra a la Crew ---------- */
function SceneCrew({ cases }: { cases: number }) {
  const { state } = useCrew();
  const r = state.rider;
  const others = state.experiences.filter((e) => e.category === DEMO_CASE.category && !e.mine).slice(0, 3);
  return (
    <div className="w-full">
      <p className="mb-5 max-w-3xl text-lg font-semibold leading-snug text-ink-600">
        Un problema individual se suma a experiencias similares de otros Rappitenderos.
      </p>
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto_1.5fr]">
        <div className="rounded-3xl bg-white p-5 shadow-lift ring-2 ring-brand-300">
          <div className="flex items-center gap-3">
            <Avatar initials={r.initials} color={r.color} size="md" />
            <div>
              <p className="font-extrabold text-ink-900">{r.firstName}</p>
              <p className="text-xs text-ink-500">Hace un momento</p>
            </div>
            <CategoryIcon category={DEMO_CASE.category} size="sm" className="ml-auto" />
          </div>
          <p className="mt-3 text-[15px] leading-snug text-ink-700">“{DEMO_CASE.text}”</p>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="h-8 w-8 rotate-90 text-brand-400 lg:rotate-0" />
        </div>
        <div className="rounded-3xl bg-ink-gradient p-5 text-white shadow-lift">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-extrabold">
              <Users className="h-5 w-5 text-brand-300" /> Cliente no responde
            </p>
            <p className="text-right">
              <span className="block text-3xl font-extrabold leading-none">{cases}</span>
              <span className="text-[11px] font-semibold text-white/60">experiencias similares</span>
            </p>
          </div>
          <ul className="stagger mt-4 space-y-2">
            {others.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-3 py-2.5 ring-1 ring-white/10">
                <Avatar initials={e.initials} color={e.color} size="xs" />
                <p className="min-w-0 flex-1 truncate text-sm text-white/85">{e.text}</p>
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-white/50">
                  <MapPin className="h-3 w-3" /> {e.zone}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Escena 4: Rappi convierte experiencias en protocolo ---------- */
function SceneRappi({ stage }: { stage: number }) {
  const { state } = useCrew();
  const cluster = state.clusters.find((c) => c.id === DEMO_CASE.clusterId);
  const protocol = state.protocols.find((p) => p.id === DEMO_CASE.protocolId);
  const stages = [
    { icon: Users, title: 'Experiencias', body: <p className="text-3xl font-extrabold">{cluster?.cases ?? 0}</p>, sub: 'de Rappitenderos' },
    { icon: Layers, title: 'Patrón identificado', body: <p className="text-sm font-bold leading-snug">{cluster?.title}</p>, sub: 'por Rappi' },
    {
      icon: Lightbulb,
      title: 'Solución propuesta',
      body: (
        <ol className="space-y-1 text-xs leading-snug">
          {protocol?.steps.slice(0, 3).map((s, i) => (
            <li key={i} className="line-clamp-2">
              <b>{i + 1}.</b> {s}
            </li>
          ))}
        </ol>
      ),
      sub: 'por Rappi',
    },
    { icon: ShieldCheck, title: 'Rappi valida', body: <p className="text-sm font-bold">Correcta y segura ✓</p>, sub: 'Operaciones Rappi' },
    {
      icon: BadgeCheck,
      title: 'Protocolo Crew',
      body: <p className="text-sm font-extrabold">#{String(protocol?.number ?? 14).padStart(3, '0')} · Publicado</p>,
      sub: '✓ Validado por Rappi',
    },
  ];
  return (
    <div className="w-full">
      <p className="mb-5 max-w-4xl rounded-2xl bg-ink-900 px-5 py-4 text-[17px] font-semibold leading-snug text-white">
        Los consejos de los Rappitenderos <span className="text-brand-300">no se convierten automáticamente en reglas</span>. Rappi
        identifica el patrón, propone la solución y la valida antes de publicarla.
      </p>
      <ol className="grid gap-3 lg:grid-cols-5">
        {stages.map((s, i) => {
          const lit = i <= stage;
          const last = i === stages.length - 1;
          return (
            <li key={s.title} className="relative">
              <div
                className={cn(
                  'flex h-full min-h-[190px] flex-col rounded-3xl p-4 ring-1 transition-all duration-500',
                  lit
                    ? last
                      ? 'bg-mint-gradient text-white shadow-lift ring-mint-400'
                      : 'bg-white text-ink-900 shadow-lift ring-ink-900/10'
                    : 'bg-white/60 text-ink-300 ring-ink-100',
                  i === stage && !last && 'ring-2 ring-brand-400',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-2xl transition',
                      lit ? (last ? 'bg-white/20' : i >= 1 ? 'bg-ink-900 text-white' : 'bg-brand-gradient text-white') : 'bg-ink-100',
                    )}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  {lit && i < stage && <Check className="h-5 w-5 text-mint-500" />}
                </div>
                <p className="mt-3 text-[13px] font-extrabold uppercase tracking-wide">{s.title}</p>
                <div className={cn('mt-2 flex-1', !lit && 'opacity-40')}>{s.body}</div>
                <p className={cn('mt-2 text-[11px] font-semibold', lit ? (last ? 'text-white/80' : 'text-ink-400') : 'text-ink-300')}>{s.sub}</p>
              </div>
              {!last && <ChevronRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-ink-300 lg:block" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Escena 5: el siguiente Rappitendero aprende ---------- */
function SceneLearn({
  protocol,
  onOpen,
}: {
  protocol: Protocol;
  onOpen: () => void;
}) {
  return (
    <div className="grid w-full items-center gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative overflow-hidden rounded-[28px] bg-ink-gradient p-7 text-white shadow-lift">
        <div className="bg-dots absolute inset-0 opacity-50" />
        <div className="relative">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-300">{protocolCode(protocol.number)}</p>
          <p className="mt-2 text-[38px] font-extrabold leading-tight tracking-tight">{protocol.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-mint-500 px-3.5 py-1.5 text-sm font-bold">✓ Validado por Rappi</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              Construido con experiencias reales de Rappitenderos
            </span>
          </div>
          <ol className="mt-5 space-y-2">
            {protocol.steps.slice(0, 3).map((s, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-snug text-white/85">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-extrabold">{i + 1}</span>
                <span className="line-clamp-2">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <GraduationCap className="h-10 w-10 text-brand-500" />
        <p className="mt-3 text-balance text-[28px] font-extrabold leading-tight tracking-tight text-ink-900 lg:text-[32px]">
          La próxima persona que tenga este problema ya no tiene que aprender a golpes.
        </p>
        <Link
          href={`/protocolos/${protocol.id}`}
          onClick={onOpen}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
        >
          Abrir el protocolo en la plataforma <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
