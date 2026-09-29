'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Check,
  Clock,
  Eye,
  FileSearch,
  MapPin,
  Share2,
  ThumbsUp,
  Users,
  Sparkles,
} from 'lucide-react';
import { RIDER_THREAD_ID, useCrew } from '@/lib/store';
import { PROTOCOL_STATUS, categoryLabel } from '@/lib/labels';
import { cn, formatDate, formatNumber, protocolCode } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { Avatar } from '@/components/ui/avatar';
import { CategoryIcon } from '@/components/category-icon';
import { ProtocolCard } from '@/components/protocol-card';
import { useToast } from '@/components/ui/toast';
import type { Protocol } from '@/lib/types';

export default function ProtocolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, viewProtocol } = useCrew();
  const protocol = state.protocols.find((p) => p.id === id);
  const viewed = useRef(false);
  const isAdmin = state.role === 'admin';

  useEffect(() => {
    if (!viewed.current && protocol?.status === 'publicado' && !isAdmin) {
      viewed.current = true;
      viewProtocol(protocol.id);
    }
  }, [protocol, viewProtocol, isAdmin]);

  if (!protocol || (protocol.status !== 'publicado' && !isAdmin)) {
    return (
      <EmptyState
        className="mt-10"
        icon={<FileSearch className="h-6 w-6" />}
        title="Protocolo no disponible"
        description="Este protocolo no existe o todavía no ha sido validado y publicado por Rappi."
        action={<ButtonLink href="/protocolos">Ver Protocolos Crew</ButtonLink>}
      />
    );
  }

  return <ProtocolView protocol={protocol} />;
}

function ProtocolView({ protocol }: { protocol: Protocol }) {
  const { state, toggleSaveProtocol, markProtocolHelpful, sendMessage } = useCrew();
  const { toast } = useToast();
  const [checked, setChecked] = useState<number[]>([]);
  const saved = state.savedProtocolIds.includes(protocol.id);
  const helpful = state.helpfulProtocolIds.includes(protocol.id);
  const isPublished = protocol.status === 'publicado';
  const related = state.protocols
    .filter((p) => p.status === 'publicado' && p.id !== protocol.id)
    .sort((a, b) => Number(b.category === protocol.category) - Number(a.category === protocol.category))
    .slice(0, 2);
  const cluster = state.clusters.find((c) => c.id === protocol.clusterId);

  const share = () => {
    if (state.role === 'nuevo' && state.assignedCopilotId) {
      sendMessage(RIDER_THREAD_ID, 'nuevo', `Mira este protocolo: ${protocolCode(protocol.number)} · ${protocol.title}. ¿Tú lo haces así?`);
      toast({ tone: 'success', title: 'Compartido con tu Copiloto', description: 'Lo verás en tu chat.' });
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/protocolos/${protocol.id}`).catch(() => undefined);
      toast({ tone: 'success', title: 'Enlace copiado', description: 'Compártelo con quien lo necesite.' });
    }
  };

  return (
    <div>
      <Link
        href={state.role === 'admin' ? `/admin/protocolos/${protocol.id}` : '/protocolos'}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900"
      >
        ← {state.role === 'admin' ? 'Volver al editor' : 'Protocolos Crew'}
      </Link>

      {!isPublished && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-sun-50 px-4 py-3 text-sm font-semibold text-sun-700 ring-1 ring-sun-100">
          <Eye className="h-4 w-4" /> Vista previa · Estado: {PROTOCOL_STATUS[protocol.status].label}. Los Rappitenderos aún no lo ven.
        </div>
      )}

      {/* Encabezado */}
      <section className="relative animate-fade-up overflow-hidden rounded-[32px] bg-ink-gradient p-6 text-white shadow-lift sm:p-8">
        <div className="bg-dots absolute inset-0 opacity-50" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-300">{protocolCode(protocol.number)}</p>
          </div>
          <h1 className="mt-3 text-[32px] font-extrabold leading-tight tracking-tight sm:text-[44px]">{protocol.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isPublished || protocol.status === 'aprobado' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg">
                ✓ Validado por Rappi
              </span>
            ) : (
              <Badge tone="sun">{PROTOCOL_STATUS[protocol.status].label}</Badge>
            )}
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              {categoryLabel(protocol.category)}
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Actualizado el {formatDate(protocol.updatedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {protocol.readMinutes} min de lectura
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {formatNumber(protocol.views)} consultas
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">El problema</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{protocol.problem}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-600">La situación</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-800">{protocol.situation}</p>
            </Card>
          </div>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-extrabold text-ink-900">Solución paso a paso</p>
              <span className="text-xs font-bold text-ink-400">
                {checked.length}/{protocol.steps.length} pasos
              </span>
            </div>
            <ol className="mt-4 space-y-2">
              {protocol.steps.map((s, i) => {
                const done = checked.includes(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-2xl p-3 text-left transition',
                        done ? 'bg-mint-50' : 'hover:bg-ink-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition',
                          done ? 'bg-mint-500 text-white' : 'bg-brand-gradient text-white shadow-glow',
                        )}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className={cn('pt-1 text-[15px] leading-relaxed', done ? 'text-ink-500' : 'text-ink-800')}>{s}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-xs text-ink-400">Toca cada paso para marcarlo mientras lo aplicas.</p>
          </Card>

          <Card className="border-l-4 border-sun-400 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-sun-500" />
              <p className="text-lg font-extrabold text-ink-900">Cuándo escalar</p>
            </div>
            <p className="mt-1 text-sm text-ink-500">Contacta al soporte oficial de Rappi si:</p>
            <ul className="mt-3 space-y-2">
              {protocol.escalate.filter(Boolean).map((e) => (
                <li key={e} className="flex items-start gap-2 text-[15px] text-ink-800">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-500" />
                  {e}
                </li>
              ))}
            </ul>
          </Card>

          <p className="flex items-start gap-3 rounded-2xl bg-mint-50 p-4 text-sm font-semibold leading-relaxed text-mint-700 ring-1 ring-mint-100">
            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" />
            Este protocolo fue construido a partir de experiencias reales y validado por Rappi.
          </p>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <p className="flex items-center gap-2 font-extrabold text-ink-900">
              <Sparkles className="h-4 w-4 text-brand-500" /> Origen de la solución
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{protocol.origin}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-ink-50 p-3">
                <Users className="h-4 w-4 text-brand-500" />
                <p className="mt-1 text-xl font-extrabold text-ink-900">{protocol.experiencesCount}</p>
                <p className="text-xs text-ink-500">experiencias reales</p>
              </div>
              <div className="rounded-2xl bg-ink-50 p-3">
                <MapPin className="h-4 w-4 text-brand-500" />
                <p className="mt-1 truncate text-sm font-extrabold text-ink-900">{cluster?.zones.join(', ') || 'Varias zonas'}</p>
                <p className="text-xs text-ink-500">zonas de origen</p>
              </div>
            </div>
            {protocol.contributors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Aportaron su experiencia</p>
                <ul className="mt-2 space-y-2">
                  {protocol.contributors.map((name) => {
                    const initials = name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('');
                    const voice = state.copilots.find((c) => c.name === name);
                    return (
                      <li key={name} className="flex items-center gap-2">
                        <Avatar initials={initials} color={voice?.color ?? '#6B6B78'} size="xs" />
                        <span className="text-sm font-semibold text-ink-800">{name}</span>
                        {voice && <Badge tone="mint">Copiloto</Badge>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4 text-xs text-ink-500">
              <CalendarDays className="h-4 w-4" />
              Fecha de actualización: <b className="text-ink-800">{formatDate(protocol.updatedAt)}</b>
            </div>
          </Card>

          {isPublished && (
            <Card className="p-5">
              <p className="font-extrabold text-ink-900">¿Te sirvió este protocolo?</p>
              <p className="mt-0.5 text-xs text-ink-500">{formatNumber(protocol.helpful)} Rappitenderos dijeron que sí.</p>
              <div className="mt-3 grid gap-2">
                <Button
                  variant={helpful ? 'mint' : 'dark'}
                  icon={helpful ? <Check className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                  onClick={() => {
                    if (!helpful) {
                      markProtocolHelpful(protocol.id);
                      toast({ tone: 'success', title: '¡Gracias!', description: 'Tu respuesta ayuda a mejorar los protocolos.' });
                    }
                  }}
                >
                  {helpful ? 'Te sirvió' : 'Sí, me sirvió'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    icon={saved ? <BookmarkCheck className="h-4 w-4 text-brand-500" /> : <Bookmark className="h-4 w-4" />}
                    onClick={() => {
                      toggleSaveProtocol(protocol.id);
                      toast({ tone: 'success', title: saved ? 'Quitado de guardados' : 'Protocolo guardado' });
                    }}
                  >
                    {saved ? 'Guardado' : 'Guardar'}
                  </Button>
                  <Button variant="secondary" icon={<Share2 className="h-4 w-4" />} onClick={share}>
                    Compartir
                  </Button>
                </div>
                <ButtonLink href={`/necesito-una-mano?c=${protocol.category}`} variant="ghost" size="sm">
                  ¿No resolvió tu caso? Pide una mano
                </ButtonLink>
              </div>
            </Card>
          )}

          {related.length > 0 && isPublished && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 font-extrabold text-ink-900">
                <CategoryIcon category={protocol.category} size="sm" /> También te puede servir
              </p>
              {related.map((p) => (
                <ProtocolCard key={p.id} protocol={p} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
