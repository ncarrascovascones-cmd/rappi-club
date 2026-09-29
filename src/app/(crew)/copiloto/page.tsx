'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Inbox,
  MapPin,
  MessageCircle,
  PauseCircle,
  Send,
  Sparkles,
  Users,
  X,
  Bike,
  Clock,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { COPILOT_STATUS, SCHEDULE_LABEL, VEHICLE_LABEL } from '@/lib/labels';
import type { Invitation, Mentee } from '@/lib/types';
import { cn, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card, SectionTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button, ButtonLink } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/states';
import { Modal } from '@/components/ui/modal';
import { ChatPanel } from '@/components/chat-panel';
import { VoluntaryNotice } from '@/components/voluntary-notice';
import { useToast } from '@/components/ui/toast';

const MOOD: Record<Mentee['mood'], { label: string; tone: 'mint' | 'sun' | 'brand' }> = {
  bien: { label: 'Va muy bien', tone: 'mint' },
  dudas: { label: 'Tiene dudas', tone: 'sun' },
  necesita_apoyo: { label: 'Te escribió', tone: 'brand' },
};

export default function CopilotoPanel() {
  const { state } = useCrew();
  const { selfCopilot } = useSelectors();
  const [chat, setChat] = useState<Mentee | null>(null);
  const status = state.copilotSelfStatus;
  const pending = state.invitations.filter((i) => i.status === 'pendiente');
  const answered = state.invitations.filter((i) => i.status !== 'pendiente');
  const originated = state.protocols.filter((p) => selfCopilot.protocolsOriginated.includes(p.id));

  return (
    <div>
      <PageHeader
        eyebrow="Panel Copiloto"
        title={`Hola, ${selfCopilot.firstName} 🙌`}
        description="Gracias por compartir tu experiencia con quienes empiezan. Aquí decides cuánto y cuándo participar."
        actions={
          <ButtonLink href="/copiloto/perfil" variant="secondary" size="sm">
            <Badge tone={COPILOT_STATUS[status].tone} dot>
              {COPILOT_STATUS[status].label}
            </Badge>
            Gestionar participación
          </ButtonLink>
        }
      />

      {status !== 'activo' && (
        <div
          className={cn(
            'mb-6 flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center',
            status === 'pausa' ? 'bg-sun-50 ring-1 ring-sun-100' : 'bg-ink-100',
          )}
        >
          <PauseCircle className={cn('h-8 w-8 shrink-0', status === 'pausa' ? 'text-sun-500' : 'text-ink-500')} />
          <div className="flex-1">
            <p className="font-extrabold text-ink-900">
              {status === 'pausa' ? 'Estás en pausa' : 'No estás participando como Copiloto'}
            </p>
            <p className="text-sm text-ink-600">
              {status === 'pausa'
                ? 'No recibirás nuevas invitaciones. Tus acompañados actuales pueden seguir escribiéndote.'
                : 'Tu decisión se respeta, sin penalización. Puedes volver cuando quieras.'}
            </p>
          </div>
          <ButtonLink href="/copiloto/perfil" variant="dark" size="sm">
            {status === 'pausa' ? 'Reactivar' : 'Volver a participar'}
          </ButtonLink>
        </div>
      )}

      {/* Stats */}
      <div className="stagger mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Acompañando ahora', value: state.mentees.length, c: 'text-brand-600 bg-brand-50' },
          { icon: Sparkles, label: 'Nuevos acompañados', value: selfCopilot.accompanied, c: 'text-mint-600 bg-mint-50' },
          { icon: Send, label: 'Postas compartidas', value: selfCopilot.experiencesShared, c: 'text-sky-600 bg-sky-50' },
          { icon: BookOpen, label: 'Protocolos originados', value: originated.length, c: 'text-grape-600 bg-grape-50' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', s.c)}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">{s.value}</p>
            <p className="text-xs font-semibold text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Invitaciones */}
          <section>
            <SectionTitle
              title="Invitaciones para acompañar"
              subtitle="Nuevos Rappitenderos que coinciden contigo. Aceptar es opcional."
            />
            {status !== 'activo' ? (
              <EmptyState
                icon={<PauseCircle className="h-6 w-6" />}
                title="Invitaciones desactivadas"
                description="Mientras no participes activamente, no te llegarán invitaciones nuevas."
              />
            ) : pending.length === 0 ? (
              <EmptyState
                icon={<Inbox className="h-6 w-6" />}
                title="No tienes invitaciones pendientes"
                description="Cuando alguien nuevo coincida con tu zona y horario, te avisaremos. Sin presión."
              />
            ) : (
              <div className="stagger space-y-3">
                {pending.map((inv) => (
                  <InvitationCard key={inv.id} inv={inv} />
                ))}
              </div>
            )}
            {answered.length > 0 && (
              <ul className="mt-3 space-y-2">
                {answered.map((inv) => (
                  <li key={inv.id} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2.5 text-sm ring-1 ring-ink-100">
                    <Avatar initials={inv.initials} color={inv.color} size="xs" />
                    <span className="flex-1 text-ink-600">{inv.riderName}</span>
                    <Badge tone={inv.status === 'aceptada' ? 'mint' : 'ink'}>
                      {inv.status === 'aceptada' ? 'Aceptaste' : 'Ahora no · sin penalización'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Acompañados */}
          <section>
            <SectionTitle title="A quién acompañas" subtitle="Su avance en las primeras semanas." />
            {state.mentees.length === 0 ? (
              <EmptyState icon={<Users className="h-6 w-6" />} title="Aún no acompañas a nadie" />
            ) : (
              <div className="space-y-3">
                {state.mentees.map((m) => {
                  const msgs = state.threads[m.threadId] ?? [];
                  const last = [...msgs].reverse().find((x) => x.from !== 'system');
                  return (
                    <Card key={m.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={m.initials} color={m.color} size="md" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-ink-900">{m.name}</p>
                            <Badge tone={MOOD[m.mood].tone} dot>
                              {MOOD[m.mood].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-ink-500">
                            Semana {m.week} · {m.zone} · {VEHICLE_LABEL[m.vehicle]}
                          </p>
                        </div>
                        <Button size="sm" variant="dark" icon={<MessageCircle className="h-4 w-4" />} onClick={() => setChat(m)}>
                          <span className="hidden sm:inline">Escribir</span>
                        </Button>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={m.progress} tone="mint" className="flex-1" label={`Arranque de ${m.name}`} />
                        <span className="text-xs font-bold text-ink-500">{m.progress}%</span>
                      </div>
                      {last && (
                        <p className="mt-3 truncate rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600">
                          <b>{last.from === 'copiloto' ? 'Tú' : m.name.split(' ')[0]}:</b> {last.text}
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <VoluntaryNotice variant="copiloto" />

          <Card className="relative overflow-hidden p-5">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-100 blur-2xl" />
            <p className="relative text-lg font-extrabold text-ink-900">Pasa la Posta</p>
            <p className="relative mt-1 text-sm text-ink-600">
              ¿Qué aprendiste que te hubiera gustado saber cuando comenzaste? Tu experiencia puede convertirse en un Protocolo Crew.
            </p>
            <ButtonLink href="/pasa-la-posta" className="relative mt-4" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              Compartir experiencia
            </ButtonLink>
          </Card>

          <Card className="p-5">
            <p className="font-extrabold text-ink-900">Protocolos que nacieron de tu experiencia</p>
            <div className="mt-3 space-y-2">
              {originated.map((p) => (
                <Link
                  key={p.id}
                  href={`/protocolos/${p.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 transition hover:bg-ink-100"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-500 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink-400">Protocolo Crew {protocolShort(p.number)}</p>
                    <p className="truncate text-sm font-bold text-ink-900">{p.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-400" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!chat} onClose={() => setChat(null)} title={chat ? `Chat con ${chat.name.split(' ')[0]}` : ''} size="lg">
        {chat && (
          <ChatPanel
            className="mb-2 h-[62dvh] min-h-[360px] shadow-none ring-1 ring-ink-100 lg:h-[62dvh]"
            threadId={chat.threadId}
            as="copiloto"
            counterpart={{
              name: chat.name,
              initials: chat.initials,
              color: chat.color,
              subtitle: `Nuevo · semana ${chat.week} · ${chat.zone}`,
            }}
            suggestions={['¿Cómo te fue hoy?', 'Mira el Protocolo Crew #014', 'Vas muy bien, sigue así 💪']}
          />
        )}
      </Modal>
    </div>
  );
}

function InvitationCard({ inv }: { inv: Invitation }) {
  const { respondInvitation } = useCrew();
  const { toast } = useToast();
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);

  const respond = async (accept: boolean) => {
    setBusy(accept ? 'accept' : 'decline');
    await respondInvitation(inv.id, accept);
    setBusy(null);
    toast(
      accept
        ? { tone: 'success', title: `Ahora acompañas a ${inv.riderName.split(' ')[0]}`, description: 'Te abrimos un chat para que te presentes.' }
        : { tone: 'info', title: 'Invitación rechazada', description: 'Sin penalización. Le proponemos otro Copiloto.' },
    );
  };

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <Avatar initials={inv.initials} color={inv.color} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-ink-900">{inv.riderName}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {inv.joinedDaysAgo} días en la calle
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {inv.zone}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bike className="h-3.5 w-3.5" /> {VEHICLE_LABEL[inv.vehicle]}
            </span>
            <span>{inv.schedule.map((s) => SCHEDULE_LABEL[s]).join(', ')}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-ink-900">{inv.matchScore}%</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">match</p>
        </div>
      </div>
      <p className="mt-3 rounded-2xl bg-ink-50 p-3 text-sm text-ink-600">{inv.note}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" loading={busy === 'decline'} disabled={!!busy} icon={<X className="h-4 w-4" />} onClick={() => respond(false)}>
          Ahora no
        </Button>
        <Button variant="mint" loading={busy === 'accept'} disabled={!!busy} icon={<Check className="h-4 w-4" />} onClick={() => respond(true)}>
          Acompañar
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-400">Decir “ahora no” no tiene ninguna consecuencia.</p>
    </Card>
  );
}
