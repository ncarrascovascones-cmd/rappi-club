'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  HandHeart,
  Heart,
  LogOut,
  Pause,
  Play,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { COPILOT_STATUS, SCHEDULE_LABEL, VEHICLE_LABEL } from '@/lib/labels';
import type { CopilotStatus } from '@/lib/types';
import { cn, formatNumber, monthsLabel, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/field';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export default function CopilotProfilePage() {
  const { state, setCopilotStatus, voices } = useCrew();
  const { selfCopilot: c } = useSelectors();
  const { toast } = useToast();
  const status = state.copilotSelfStatus;
  const [busy, setBusy] = useState<CopilotStatus | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [capacity, setCapacity] = useState(3);
  const originated = state.protocols.filter((p) => c.protocolsOriginated.includes(p.id));
  const voice = voices.find((v) => v.name === c.name);
  const thanks = state.experiences.filter((e) => e.author === c.name).reduce((a, e) => a + e.thanks, 0);

  const change = async (next: CopilotStatus) => {
    setBusy(next);
    await setCopilotStatus(next);
    setBusy(null);
    setLeaveOpen(false);
    const msg: Record<CopilotStatus, { title: string; description: string }> = {
      activo: { title: 'Estás participando', description: 'Volverás a recibir invitaciones de nuevos Rappitenderos.' },
      pausa: { title: 'Participación en pausa', description: 'No recibirás nuevas invitaciones hasta que reactives.' },
      retirado: { title: 'Dejaste de participar como Copiloto', description: 'Gracias por todo lo que compartiste. Sin penalización.' },
    };
    toast({ tone: next === 'retirado' ? 'info' : 'success', ...msg[next] });
  };

  return (
    <div>
      <PageHeader
        back={{ href: '/copiloto', label: 'Panel Copiloto' }}
        eyebrow="Perfil del Copiloto"
        title="Tu participación en la Crew"
        description="Ser Copiloto es voluntario. Tú decides si participas, cuánto y hasta cuándo."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Card className="animate-fade-up overflow-hidden">
            <div className="relative h-24 bg-mint-gradient">
              <div className="bg-dots absolute inset-0" />
            </div>
            <div className="px-5 pb-6 sm:px-6">
              <div className="-mt-10 flex items-end justify-between gap-3">
                <Avatar initials={c.initials} color={c.color} size="xl" ring />
                <Badge tone={COPILOT_STATUS[status].tone} dot>
                  {COPILOT_STATUS[status].label}
                </Badge>
              </div>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">{c.name}</p>
              <p className="text-sm text-ink-500">
                {monthsLabel(c.monthsOnPlatform)} en Rappi · {c.zone} · {VEHICLE_LABEL[c.vehicle]} ·{' '}
                {c.schedule.map((s) => SCHEDULE_LABEL[s]).join(', ')}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, label: 'Nuevos acompañados', value: c.accompanied },
                  { icon: Send, label: 'Experiencias aportadas', value: c.experiencesShared },
                  { icon: BookOpen, label: 'Protocolos originados', value: originated.length },
                  { icon: Heart, label: 'Agradecimientos', value: formatNumber((voice?.thanks ?? 0) + thanks) },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-ink-50 p-3">
                    <s.icon className="h-4 w-4 text-mint-600" />
                    <p className="mt-2 text-2xl font-extrabold text-ink-900">{s.value}</p>
                    <p className="text-[11px] font-semibold leading-tight text-ink-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Estado de participación */}
          <Card className="p-5 sm:p-6">
            <p className="text-lg font-extrabold text-ink-900">Estado de participación</p>
            <p className="mt-1 text-sm text-ink-500">Cámbialo cuando quieras. Ninguna opción tiene consecuencias en tu cuenta.</p>

            {status === 'retirado' ? (
              <div className="mt-4 rounded-2xl bg-ink-50 p-4">
                <p className="font-bold text-ink-900">Hoy no participas como Copiloto.</p>
                <p className="mt-1 text-sm text-ink-600">
                  Tus aportes y protocolos siguen siendo tuyos y siguen ayudando a la Crew. Si algún día quieres volver, aquí estará la puerta.
                </p>
                <Button className="mt-4" variant="mint" loading={busy === 'activo'} icon={<Play className="h-4 w-4" />} onClick={() => change('activo')}>
                  Volver a participar
                </Button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { id: 'activo', icon: Play, title: 'Participando', desc: 'Recibes invitaciones y acompañas a nuevos.' },
                    { id: 'pausa', icon: Pause, title: 'En pausa', desc: 'Sin nuevas invitaciones. Ideal para semanas pesadas.' },
                  ] as const
                ).map((o) => {
                  const active = status === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => !active && change(o.id)}
                      disabled={!!busy}
                      aria-pressed={active}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl p-4 text-left ring-1 transition',
                        active ? 'bg-mint-50 ring-mint-200' : 'bg-white ring-ink-200 hover:bg-ink-50',
                      )}
                    >
                      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', active ? 'bg-mint-500 text-white' : 'bg-ink-100 text-ink-500')}>
                        {busy === o.id ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <o.icon className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className="flex items-center gap-2 font-bold text-ink-900">
                          {o.title} {active && <Check className="h-4 w-4 text-mint-600" />}
                        </span>
                        <span className="text-xs text-ink-500">{o.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {status !== 'retirado' && (
              <div className="mt-5">
                <p className="text-sm font-bold text-ink-800">¿A cuántas personas quieres acompañar a la vez?</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <Chip
                      key={n}
                      active={capacity === n}
                      onClick={() => {
                        setCapacity(n);
                        toast({ tone: 'success', title: 'Preferencia guardada', description: `Máximo ${n} ${n === 1 ? 'persona' : 'personas'} a la vez.` });
                      }}
                    >
                      {n}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {status !== 'retirado' && (
            <Card className="border border-brand-100 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <LogOut className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-extrabold text-ink-900">Dejar de participar como Copiloto</p>
                  <p className="mt-1 text-sm text-ink-600">
                    Tu participación es voluntaria. Puedes retirarte en cualquier momento, sin explicar por qué y sin ninguna
                    penalización en tu cuenta, tus pedidos o tus beneficios.
                  </p>
                  <Button variant="danger" size="sm" className="mt-4" onClick={() => setLeaveOpen(true)}>
                    Dejar de participar como Copiloto
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 font-extrabold text-ink-900">
              <Award className="h-5 w-5 text-sun-500" /> Reconocimiento
            </p>
            <p className="mt-1 text-xs text-ink-500">Simbólico y público. Nunca económico.</p>
            <div className="mt-4 space-y-2">
              {c.badges.map((b) => (
                <div key={b} className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sun-50 to-white p-3 ring-1 ring-sun-100">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sun-400 to-brand-500 text-white">
                    <Award className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-bold text-ink-900">{b}</p>
                </div>
              ))}
            </div>
            {voice && (
              <Link href="/voz-de-la-crew" className="mt-4 block rounded-2xl bg-ink-900 p-4 text-white transition hover:bg-ink-800">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-300">La Voz de la Crew</p>
                <p className="mt-1 text-sm font-semibold">“{voice.quote}”</p>
                <p className="mt-2 text-xs text-white/60">Tu historia está destacada este mes →</p>
              </Link>
            )}
          </Card>

          <Card className="p-5">
            <p className="font-extrabold text-ink-900">Protocolos originados</p>
            <div className="mt-3 space-y-2">
              {originated.map((p) => (
                <Link key={p.id} href={`/protocolos/${p.id}`} className="flex items-center justify-between gap-2 rounded-2xl bg-ink-50 p-3 hover:bg-ink-100">
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-ink-400">{protocolShort(p.number)}</span>
                    <span className="block truncate text-sm font-bold text-ink-900">{p.title}</span>
                  </span>
                  <span className="text-xs font-semibold text-ink-500">{formatNumber(p.views)} consultas</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 font-extrabold text-ink-900">
              <ShieldCheck className="h-5 w-5 text-mint-600" /> Tu rol, claro
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li>• Compartes experiencia práctica, no das instrucciones oficiales.</li>
              <li>• No eres supervisor ni soporte de Rappi.</li>
              <li>• Rappi valida cualquier solución antes de publicarla.</li>
              <li>• Participar no es requisito para nada en tu cuenta.</li>
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        open={leaveOpen}
        onClose={() => setLeaveOpen(false)}
        title="¿Dejar de participar como Copiloto?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLeaveOpen(false)}>
              Seguir participando
            </Button>
            <Button variant="dark" loading={busy === 'retirado'} onClick={() => change('retirado')}>
              Sí, dejar de participar
            </Button>
          </>
        }
      >
        <div className="space-y-3 pb-2 text-sm text-ink-600">
          <div className="flex gap-3 rounded-2xl bg-mint-50 p-4 text-mint-700">
            <HandHeart className="h-5 w-5 shrink-0" />
            <p>
              <b>Es tu decisión y la respetamos.</b> Participar como Copiloto siempre fue voluntario.
            </p>
          </div>
          <p>Esto es lo que pasa si te retiras:</p>
          <ul className="space-y-2">
            {[
              'No tendrás ninguna penalización en tu cuenta, pedidos ni beneficios.',
              'Dejarás de recibir invitaciones de nuevos Rappitenderos.',
              'Rappi propondrá con cuidado otro Copiloto a quienes acompañas hoy.',
              'Tus experiencias y protocolos originados siguen siendo parte de la Crew.',
              'Puedes volver cuando quieras.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" /> {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-400">¿Solo necesitas un respiro? También puedes poner tu participación en pausa.</p>
        </div>
      </Modal>
    </div>
  );
}
