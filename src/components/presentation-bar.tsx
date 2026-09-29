'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, MessageSquareText, Presentation, Sparkles, X } from 'lucide-react';
import { RIDER_THREAD_ID, useCrew } from '@/lib/store';
import { PRESENTATION_CLUSTER_ID, PRESENTATION_EXPERIENCE_IDS } from '@/lib/demo-data';
import {
  PRESENTATION_STEPS,
  PROBLEM_MESSAGE,
  PROBLEM_REPLY,
  actionDone,
  presentationProtocolId,
  type PresentationAction,
} from '@/lib/presentation';
import { cn, delay } from '@/lib/utils';

/** Barra flotante que guía el recorrido de la demo frente al jurado. */
export function PresentationBar() {
  const crew = useCrew();
  const { state, setPresentation, stopPresentation, login } = crew;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showScript, setShowScript] = useState(true);
  useEffect(() => {
    // En mobile el guion arranca plegado para no tapar la pantalla.
    if (window.innerWidth < 1024) setShowScript(false);
  }, []);
  const stateRef = useRef(state);
  stateRef.current = state;
  const stepIdx = state.presentation.step;
  const step = PRESENTATION_STEPS[stepIdx];
  const total = PRESENTATION_STEPS.length;

  const go = useCallback(
    (i: number) => {
      const target = PRESENTATION_STEPS[i];
      setPresentation({ step: i });
      login(target.role);
      router.push(target.href(stateRef.current));
    },
    [login, router, setPresentation],
  );

  const run = useCallback(
    async (action: PresentationAction) => {
      const s = stateRef.current;
      if (actionDone(action, s, RIDER_THREAD_ID)) return;
      switch (action) {
        case 'problem':
          crew.sendMessage(RIDER_THREAD_ID, 'nuevo', PROBLEM_MESSAGE, PROBLEM_REPLY);
          return;
        case 'group':
          crew.groupExperiences(PRESENTATION_EXPERIENCE_IDS, { clusterId: PRESENTATION_CLUSTER_ID });
          crew.setClusterStatus(PRESENTATION_CLUSTER_ID, 'en_analisis');
          await delay(300);
          router.push(`/admin/patrones#${PRESENTATION_CLUSTER_ID}`);
          return;
        case 'create': {
          if (!actionDone('group', s, RIDER_THREAD_ID)) await run('group');
          const id = crew.createProtocol(PRESENTATION_CLUSTER_ID);
          await delay(100);
          router.push(`/admin/protocolos/${id}`);
          return;
        }
        case 'validate': {
          if (!presentationProtocolId(stateRef.current)) await run('create');
          await delay(150);
          const id = presentationProtocolId(stateRef.current)!;
          const st = stateRef.current.protocols.find((p) => p.id === id)?.status;
          if (st === 'borrador') await crew.setProtocolStatus(id, 'en_validacion');
          await crew.setProtocolStatus(id, 'aprobado');
          return;
        }
        case 'publish': {
          if (!actionDone('validate', stateRef.current, RIDER_THREAD_ID)) await run('validate');
          await crew.setProtocolStatus(presentationProtocolId(stateRef.current)!, 'publicado');
          return;
        }
      }
    },
    [crew, router],
  );

  const doAction = async () => {
    if (!step.action) return;
    setBusy(true);
    try {
      await run(step.action);
    } finally {
      setBusy(false);
    }
  };

  const next = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Si el presentador no ejecutó la acción del paso, se hace sola para que el caso siga siendo coherente.
      if (step.action) await run(step.action);
      await delay(120);
      if (stepIdx < total - 1) go(stepIdx + 1);
      else {
        stopPresentation();
        router.push('/presentacion/cierre');
      }
    } finally {
      setBusy(false);
    }
  }, [busy, step, run, stepIdx, total, go, stopPresentation, router]);

  const prev = useCallback(() => {
    if (stepIdx === 0) router.push('/presentacion');
    else go(stepIdx - 1);
  }, [stepIdx, go, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (!step) return null;
  const done = step.action ? actionDone(step.action, state, RIDER_THREAD_ID) : true;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-50 px-3 lg:bottom-5 lg:left-[272px] lg:px-8">
      <div className="pointer-events-auto mx-auto max-w-4xl animate-fade-up overflow-hidden rounded-3xl bg-ink-900/95 text-white shadow-lift ring-1 ring-white/10 backdrop-blur-xl">
        <div className="flex gap-1 px-4 pt-3">
          {PRESENTATION_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              title={`${i + 1}. ${s.label}`}
              aria-label={`Ir al paso ${i + 1}: ${s.label}`}
              className={cn('h-1.5 flex-1 rounded-full transition', i < stepIdx ? 'bg-brand-400' : i === stepIdx ? 'bg-white' : 'bg-white/15 hover:bg-white/30')}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient sm:flex">
            <Presentation className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
              <span className="hidden sm:inline">Modo presentación · </span>
              {stepIdx + 1}/{total} · {step.label}
            </p>
            <p className="truncate text-sm font-extrabold sm:text-base">{step.title}</p>
          </div>
          <button
            onClick={() => setShowScript((v) => !v)}
            className={cn('inline-flex rounded-xl p-2 transition', showScript ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10')}
            aria-pressed={showScript}
            title="Mostrar u ocultar el guion"
          >
            <MessageSquareText className="h-4 w-4" />
          </button>
          <button onClick={prev} className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Paso anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={busy}
            className="inline-flex h-10 items-center gap-1 rounded-xl bg-white px-3 text-sm font-extrabold text-ink-900 transition hover:bg-brand-50 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {stepIdx === total - 1 ? 'Cierre' : 'Siguiente'}
            {!busy && <ChevronRight className="h-4 w-4" />}
          </button>
          <button
            onClick={() => stopPresentation()}
            className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Salir del modo presentación"
            title="Salir del modo presentación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {(showScript || step.action) && (
          <div className="flex flex-col gap-2 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center">
            {showScript && <p className="flex-1 text-[13px] leading-snug text-white/75">{step.say}</p>}
            {step.action && (
              <button
                onClick={doAction}
                disabled={busy || done}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition',
                  done ? 'bg-mint-500/20 text-mint-200' : 'bg-brand-gradient text-white shadow-glow hover:brightness-110',
                )}
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {done ? 'Hecho ✓' : step.actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
