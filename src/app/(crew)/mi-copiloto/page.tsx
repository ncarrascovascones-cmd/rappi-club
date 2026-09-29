'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen,
  Check,
  Flag,
  MapPin,
  MessageCircle,
  PartyPopper,
  Package,
  Repeat,
  Clock,
  X,
  Users,
  Sparkles,
  Award,
  CalendarDays,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { SCHEDULE_LABEL, VEHICLE_LABEL } from '@/lib/labels';
import { cn, formatNumber, formatShortDate, monthsLabel } from '@/lib/utils';
import type { TimelineEvent } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, SectionTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Label, TextArea } from '@/components/ui/field';
import { EmptyState, ErrorNote, SuccessPanel } from '@/components/ui/states';
import { VoluntaryNotice } from '@/components/voluntary-notice';
import { useToast } from '@/components/ui/toast';

const REASONS = [
  'No responde a mis mensajes',
  'Me dio información que no coincide con un protocolo',
  'Trato inadecuado',
  'Quiero cambiar de Copiloto',
  'Otro',
];

const KIND_ICON: Record<TimelineEvent['kind'], typeof Check> = {
  inicio: Users,
  chat: MessageCircle,
  protocolo: BookOpen,
  hito: PartyPopper,
  posta: Sparkles,
};

export default function MiCopilotoPage() {
  const { state, reportIncident } = useCrew();
  const { assigned } = useSelectors();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!assigned) {
    return (
      <>
        <PageHeader eyebrow="Copiloto" title="Mi Copiloto" />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Aún no tienes Copiloto"
          description="Encuentra un Rappitendero con experiencia que quiera acompañarte voluntariamente."
          action={<ButtonLink href="/mi-copiloto/match">Encontrar mi Copiloto</ButtonLink>}
        />
      </>
    );
  }

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setReason(null);
      setText('');
      setError(null);
      setSent(false);
    }, 250);
  };

  const submit = async () => {
    if (!reason) return setError('Elige un motivo para continuar.');
    if (text.trim().length < 10) return setError('Cuéntanos un poco más (mínimo 10 caracteres).');
    setError(null);
    setSending(true);
    try {
      await reportIncident({ reason, text: text.trim() });
      setSent(true);
    } catch {
      toast({ tone: 'error', title: 'No pudimos enviar el reporte', description: 'Inténtalo de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Copiloto"
        title="Mi Copiloto"
        description="Alguien que ya recorrió el camino y decidió, por su cuenta, acompañarte en tus primeras semanas."
        actions={
          <ButtonLink href="/mi-copiloto/match" variant="secondary" size="sm" icon={<Repeat className="h-4 w-4" />}>
            Encuentra tu Copiloto
          </ButtonLink>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          {/* Perfil */}
          <Card className="animate-fade-up overflow-hidden">
            <div className="relative h-28 bg-ink-gradient">
              <div className="bg-dots absolute inset-0" />
              <div className="absolute right-4 top-4">
                <Badge tone="white" dot>
                  {assigned.status === 'activo' ? 'Disponible' : 'En pausa'}
                </Badge>
              </div>
            </div>
            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <Avatar initials={assigned.initials} color={assigned.color} size="xl" ring online />
                <div className="flex flex-wrap gap-1.5">
                  {assigned.badges.map((b) => (
                    <Badge key={b} tone="sun" icon={<Award className="h-3 w-3" />}>
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900">{assigned.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{assigned.bio}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Clock, label: 'En la plataforma', value: monthsLabel(assigned.monthsOnPlatform) },
                  { icon: Package, label: 'Experiencia', value: `${formatNumber(assigned.deliveries)} entregas` },
                  { icon: MapPin, label: 'Zona habitual', value: assigned.zone },
                  { icon: Users, label: 'Ha acompañado', value: `${assigned.accompanied} nuevos` },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-ink-50 p-3">
                    <s.icon className="h-4 w-4 text-brand-500" />
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">{s.label}</p>
                    <p className="text-sm font-extrabold text-ink-900">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-ink-600">
                <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200">{VEHICLE_LABEL[assigned.vehicle]}</span>
                {assigned.schedule.map((s) => (
                  <span key={s} className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200">
                    {SCHEDULE_LABEL[s]}
                  </span>
                ))}
                <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200">También {assigned.nearbyZones.join(' y ')}</span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Sabe mucho de</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assigned.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/mi-copiloto/chat" icon={<MessageCircle className="h-4 w-4" />} className="flex-1">
                  Contactar a {assigned.firstName}
                </ButtonLink>
                <Button variant="secondary" icon={<Flag className="h-4 w-4" />} onClick={() => setOpen(true)}>
                  Reportar una incidencia
                </Button>
              </div>
              <p className="mt-2 text-xs text-ink-400">{assigned.responseTime}</p>
            </div>
          </Card>

          <VoluntaryNotice />
        </div>

        <div className="space-y-6">
          {/* Qué hace y qué no */}
          <Card className="p-5">
            <p className="font-extrabold text-ink-900">Cómo funciona el acompañamiento</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                'Comparte lo que aprendió en la calle',
                'Te recomienda Protocolos Crew',
                'Te escucha cuando algo sale mal',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                    <Check className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
              {[
                'No es tu supervisor ni evalúa tu trabajo',
                'No es el soporte oficial de Rappi',
                'No decide sobre tu cuenta ni tus pedidos',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-ink-500">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                    <X className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>

          {/* Historial */}
          <Card className="p-5">
            <SectionTitle title="Historial de acompañamiento" className="mb-4" />
            {state.timeline.length === 0 ? (
              <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Todavía sin historial" />
            ) : (
              <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-ink-100">
                {state.timeline.map((ev) => {
                  const Icon = KIND_ICON[ev.kind];
                  return (
                    <li key={ev.id} className="relative flex gap-3">
                      <span
                        className={cn(
                          'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                          ev.kind === 'hito' ? 'bg-sun-100 text-sun-700' : ev.kind === 'protocolo' ? 'bg-mint-100 text-mint-700' : 'bg-brand-50 text-brand-600',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{formatShortDate(ev.date)}</p>
                        <p className="text-sm font-bold text-ink-900">{ev.title}</p>
                        <p className="text-xs text-ink-500">{ev.detail}</p>
                        {ev.kind === 'protocolo' && (
                          <Link href="/protocolos/p-014" className="mt-1 inline-block text-xs font-bold text-brand-600 hover:underline">
                            Abrir protocolo
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={close}
        title={sent ? 'Reporte enviado' : 'Reportar una incidencia'}
        description={sent ? undefined : 'Tu reporte es confidencial y lo revisa el equipo de Rappi Crew, no tu Copiloto.'}
        footer={
          sent ? (
            <Button variant="dark" onClick={close}>
              Entendido
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button onClick={submit} loading={sending} icon={<Flag className="h-4 w-4" />}>
                Enviar reporte
              </Button>
            </>
          )
        }
      >
        {sent ? (
          <SuccessPanel
            title="Gracias por avisarnos"
            description="El equipo de Rappi Crew revisará tu reporte. Si lo prefieres, puedes buscar otro Copiloto en cualquier momento."
          >
            <ButtonLink href="/mi-copiloto/match" variant="secondary" size="sm" onClick={close}>
              Ver otros Copilotos
            </ButtonLink>
          </SuccessPanel>
        ) : (
          <div className="space-y-4 pb-2">
            <div>
              <Label>¿Qué pasó?</Label>
              <div className="grid gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setReason(r);
                      setError(null);
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold ring-1 transition',
                      reason === r ? 'bg-brand-50 text-brand-700 ring-brand-300' : 'bg-white text-ink-700 ring-ink-200 hover:bg-ink-50',
                    )}
                  >
                    {r}
                    {reason === r && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="inc-text" hint={`${text.length}/500`}>
                Cuéntanos más
              </Label>
              <TextArea
                id="inc-text"
                maxLength={500}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe brevemente la situación…"
                invalid={!!error && text.trim().length < 10}
              />
            </div>
            {error && <ErrorNote>{error}</ErrorNote>}
            <p className="rounded-2xl bg-ink-50 p-3 text-xs text-ink-500">
              ¿Es un problema con un pedido? Usa{' '}
              <Link href="/necesito-una-mano" className="font-bold text-brand-600" onClick={close}>
                Necesito una mano
              </Link>
              .
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
