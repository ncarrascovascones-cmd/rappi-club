'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Check,
  Headset,
  Inbox,
  Loader2,
  MessageCircle,
  RotateCcw,
  SendHorizonal,
  ThumbsDown,
  ThumbsUp,
  Users,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { HELP_CATEGORIES, HELP_STATUS, categoryLabel } from '@/lib/labels';
import type { HelpCategory, HelpRequest } from '@/lib/types';
import { cn, monthsLabel, timeAgo } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card, SectionTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Label, TextArea } from '@/components/ui/field';
import { EmptyState, ErrorNote, PageSkeleton } from '@/components/ui/states';
import { Avatar } from '@/components/ui/avatar';
import { CategoryIcon } from '@/components/category-icon';
import { ProtocolCard } from '@/components/protocol-card';
import { useToast } from '@/components/ui/toast';

const ANALYSIS_STEPS = [
  'Leyendo tu experiencia',
  'Buscando experiencias similares de otros Rappitenderos',
  'Revisando Protocolos Crew validados por Rappi',
];

function HelpFlow() {
  const { state, submitHelp, rateHelp } = useCrew();
  const { toast } = useToast();
  const params = useSearchParams();
  const initial = params.get('c') as HelpCategory | null;
  const [category, setCategory] = useState<HelpCategory | null>(
    initial && HELP_CATEGORIES.some((c) => c.id === initial) ? initial : null,
  );
  const [text, setText] = useState(() => params.get('t')?.slice(0, 600) ?? '');
  const [errors, setErrors] = useState<{ category?: string; text?: string }>({});
  const [phase, setPhase] = useState<'form' | 'analyzing' | 'result'>('form');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<HelpRequest | null>(null);

  const myName = state.role === 'copiloto' ? 'Andrés Rojas' : state.rider.name;
  const myCases = state.helpRequests.filter((h) => h.riderName === myName);
  const current = result ? state.helpRequests.find((h) => h.id === result.id) ?? result : null;

  useEffect(() => {
    if (phase !== 'analyzing') return;
    setStep(0);
    const t1 = window.setTimeout(() => setStep(1), 800);
    const t2 = window.setTimeout(() => setStep(2), 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  const submit = async () => {
    const e: typeof errors = {};
    if (!category) e.category = 'Elige la categoría que mejor describe lo que pasó.';
    if (text.trim().length < 15) e.text = 'Cuéntanos un poco más (mínimo 15 caracteres).';
    setErrors(e);
    if (Object.keys(e).length) return;
    setPhase('analyzing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const req = await submitHelp({ category: category!, text: text.trim() });
      setResult(req);
      setPhase('result');
    } catch {
      setPhase('form');
      toast({ tone: 'error', title: 'No pudimos enviar tu caso', description: 'Revisa tu conexión e inténtalo de nuevo.' });
    }
  };

  const reset = () => {
    setPhase('form');
    setCategory(null);
    setText('');
    setResult(null);
  };

  const protocol = current?.matchedProtocolId ? state.protocols.find((p) => p.id === current.matchedProtocolId) : undefined;
  const similar = current
    ? state.experiences.filter((e) => e.category === current.category && !e.mine).slice(0, 2)
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Necesito una mano"
        title={phase === 'result' ? 'Esto encontramos para ti' : '¿Qué pasó en la calle?'}
        description={
          phase === 'result'
            ? 'Tu caso quedó registrado y ayuda a Rappi a detectar problemas recurrentes.'
            : 'Cuéntanos la situación. La comparamos con experiencias reales de la flota y con los Protocolos Crew validados por Rappi.'
        }
      />

      {phase === 'form' && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="animate-fade-up p-5 sm:p-6">
            <div>
              <Label>1. Elige una categoría</Label>
              <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3">
                {HELP_CATEGORIES.map((c) => {
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setCategory(c.id);
                        setErrors((e) => ({ ...e, category: undefined }));
                      }}
                      className={cn(
                        'relative flex flex-col items-start rounded-2xl p-3.5 text-left ring-1 transition-all duration-200 active:scale-[0.98]',
                        active ? 'bg-ink-900 text-white ring-ink-900 shadow-lift' : 'bg-white ring-ink-200 hover:-translate-y-0.5 hover:ring-ink-300',
                      )}
                    >
                      <CategoryIcon category={c.id} size="sm" className={cn(active && 'bg-white/10 text-white')} />
                      <span className="mt-3 text-sm font-bold leading-snug">{c.label}</span>
                      <span className={cn('mt-1 text-xs leading-snug', active ? 'text-white/60' : 'text-ink-500')}>{c.hint}</span>
                      {active && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.category && <ErrorNote className="mt-2">{errors.category}</ErrorNote>}
            </div>

            <div className="mt-6">
              <Label htmlFor="help-text" hint={`${text.length}/600`}>
                2. Cuéntanos tu experiencia
              </Label>
              <TextArea
                id="help-text"
                value={text}
                maxLength={600}
                invalid={!!errors.text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (errors.text) setErrors((x) => ({ ...x, text: undefined }));
                }}
                placeholder="Ej.: Llegué al edificio, llamé dos veces y el cliente no contesta. En portería no me dejan subir…"
              />
              {errors.text && <ErrorNote className="mt-2">{errors.text}</ErrorNote>}
            </div>

            <Button size="lg" block className="mt-6" onClick={submit} icon={<SendHorizonal className="h-4 w-4" />}>
              Enviar
            </Button>
            <p className="mt-3 text-center text-xs text-ink-400">
              Si estás en peligro o hay una emergencia, contacta primero a las líneas de emergencia locales.
            </p>
          </Card>

          <div className="space-y-4">
            <Card className="p-5">
              <p className="font-extrabold text-ink-900">¿Qué pasa cuando envías?</p>
              <ol className="mt-3 space-y-3 text-sm text-ink-600">
                {[
                  'Buscamos experiencias similares de otros Rappitenderos.',
                  'Te mostramos el Protocolo Crew validado que aplica.',
                  'Tu caso ayuda a Rappi a detectar problemas recurrentes y crear nuevos protocolos.',
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-extrabold text-brand-600">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </Card>
            <MyCases cases={myCases} />
          </div>
        </div>
      )}

      {phase === 'analyzing' && (
        <Card className="mx-auto max-w-xl animate-scale-in px-6 py-12 text-center" aria-busy="true">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-300/50" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
              <Users className="h-8 w-8" />
            </span>
          </div>
          <p className="text-balance text-xl font-extrabold text-ink-900">
            Estamos revisando experiencias similares de otros Rappitenderos.
          </p>
          <ul className="mx-auto mt-6 max-w-sm space-y-3 text-left">
            {ANALYSIS_STEPS.map((s, i) => (
              <li key={s} className={cn('flex items-center gap-3 text-sm transition', i <= step ? 'text-ink-800' : 'text-ink-300')}>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                    i < step ? 'bg-mint-500 text-white' : i === step ? 'bg-brand-50 text-brand-600' : 'bg-ink-100',
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i === step ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {phase === 'result' && current && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <Card className="animate-fade-up p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <CategoryIcon category={current.category} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-ink-900">{categoryLabel(current.category)}</p>
                    <Badge tone={HELP_STATUS[current.status].tone} dot>
                      {protocol ? 'Protocolo encontrado' : HELP_STATUS[current.status].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-600">“{current.text}”</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-3xl font-extrabold text-brand-600">{current.similarCount}</p>
                  <p className="text-xs font-semibold text-ink-600">Rappitenderos vivieron algo parecido</p>
                </div>
                <div className="rounded-2xl bg-mint-50 p-4">
                  <p className="text-3xl font-extrabold text-mint-600">{protocol ? 1 : 0}</p>
                  <p className="text-xs font-semibold text-ink-600">Protocolo Crew validado que aplica</p>
                </div>
              </div>
            </Card>

            {protocol ? (
              <div className="animate-fade-up">
                <SectionTitle title="Protocolo recomendado" subtitle="Validado por Rappi a partir de experiencias reales." />
                <ProtocolCard protocol={protocol} />
              </div>
            ) : (
              <Card className="p-5">
                <div className="flex gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun-50 text-sun-700">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-ink-900">Todavía no hay un protocolo para esto</p>
                    <p className="mt-1 text-sm text-ink-600">
                      Tu caso quedó registrado. Cuando Rappi detecta un patrón, lo convierte en un Protocolo Crew. Mientras tanto,
                      habla con tu Copiloto o con el soporte oficial.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {similar.length > 0 && (
              <div>
                <SectionTitle title="Lo que otros aprendieron" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {similar.map((e) => (
                    <Card key={e.id} className="p-4">
                      <p className="text-sm leading-relaxed text-ink-700">“{e.text}”</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar initials={e.initials} color={e.color} size="xs" />
                        <p className="text-xs font-semibold text-ink-500">
                          {e.author.split(' ')[0]} · {monthsLabel(e.months)} · {e.zone}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <p className="font-extrabold text-ink-900">¿Te sirvió esta respuesta?</p>
              {current.helpful === undefined ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="secondary" icon={<ThumbsUp className="h-4 w-4" />} onClick={() => rateHelp(current.id, true)}>
                    Sí
                  </Button>
                  <Button variant="secondary" icon={<ThumbsDown className="h-4 w-4" />} onClick={() => rateHelp(current.id, false)}>
                    No
                  </Button>
                </div>
              ) : (
                <p className="mt-2 animate-fade-in rounded-2xl bg-mint-50 p-3 text-sm text-mint-700">
                  {current.helpful
                    ? '¡Gracias! Tu respuesta ayuda a mejorar los protocolos.'
                    : 'Gracias por contarnos. Rappi revisará tu caso para mejorar el protocolo.'}
                </p>
              )}
            </Card>
            <Card className="space-y-2 p-5">
              <p className="mb-1 font-extrabold text-ink-900">¿Necesitas más?</p>
              {state.role === 'nuevo' && (
                <ButtonLink href="/mi-copiloto/chat" variant="dark" block icon={<MessageCircle className="h-4 w-4" />}>
                  Hablar con mi Copiloto
                </ButtonLink>
              )}
              <Button
                variant="secondary"
                block
                icon={<Headset className="h-4 w-4" />}
                onClick={() =>
                  toast({
                    tone: 'info',
                    title: 'Soporte oficial de Rappi',
                    description: 'En la app real, aquí se abre el canal oficial de soporte. En este prototipo es una simulación.',
                  })
                }
              >
                Contactar soporte oficial
              </Button>
              <Button variant="ghost" block icon={<RotateCcw className="h-4 w-4" />} onClick={reset}>
                Reportar otra situación
              </Button>
            </Card>
            <MyCases cases={myCases} />
          </div>
        </div>
      )}
    </div>
  );
}

function MyCases({ cases }: { cases: HelpRequest[] }) {
  const { state } = useCrew();
  return (
    <Card className="p-5">
      <p className="font-extrabold text-ink-900">Mis casos</p>
      {cases.length === 0 ? (
        <EmptyState
          className="mt-3 border-0 bg-ink-50 py-6"
          icon={<Inbox className="h-6 w-6" />}
          title="Sin casos por ahora"
          description="Cuando pidas una mano, verás aquí el estado de tus casos."
        />
      ) : (
        <ul className="mt-3 divide-y divide-ink-100">
          {cases.map((c) => {
            const p = state.protocols.find((x) => x.id === c.matchedProtocolId);
            return (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <CategoryIcon category={c.category} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{categoryLabel(c.category)}</p>
                  <p className="text-xs text-ink-400">{timeAgo(c.createdAt)}</p>
                </div>
                {p ? (
                  <Link href={`/protocolos/${p.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                    Protocolo <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <Badge tone={HELP_STATUS[c.status].tone}>{HELP_STATUS[c.status].label}</Badge>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default function NecesitoUnaManoPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HelpFlow />
    </Suspense>
  );
}
