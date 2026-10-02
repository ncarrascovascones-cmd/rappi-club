'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Award,
  BookOpen,
  Heart,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useCrew, useSelectors } from '@/lib/store';
import { COPILOT_STATUS, SCHEDULE_LABEL, VEHICLE_LABEL } from '@/lib/labels';
import { formatNumber, monthsLabel, protocolShort } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/field';
import { ParticipationCard } from '@/components/participation-card';
import { useToast } from '@/components/ui/toast';

export default function CopilotProfilePage() {
  const { state, voices } = useCrew();
  const { selfCopilot: c } = useSelectors();
  const { toast } = useToast();
  const status = state.copilotSelfStatus;
  const [capacity, setCapacity] = useState(3);
  const originated = state.protocols.filter((p) => c.protocolsOriginated.includes(p.id));
  const voice = voices.find((v) => v.name === c.name);
  const thanks = state.experiences.filter((e) => e.author === c.name).reduce((a, e) => a + e.thanks, 0);

  return (
    <div>
      <PageHeader
        back={{ href: '/copiloto', label: 'Panel Copiloto' }}
        eyebrow="Perfil del Copiloto"
        title="Tu participación en la Crew"
        description="Ser Copiloto es voluntario. Puedes aceptar, pausar o dejar de participar sin penalización."
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

          <ParticipationCard />

          {status !== 'retirado' && (
            <Card className="p-5">
              <p className="text-sm font-bold text-ink-800">¿A cuántas personas quieres acompañar a la vez?</p>
              <p className="text-xs text-ink-500">Tú pones el límite. Puedes cambiarlo cuando quieras.</p>
              <div className="mt-3 flex gap-2">
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

    </div>
  );
}
