'use client';

import { useMemo, useState } from 'react';
import {
  Bike,
  CalendarClock,
  Clock,
  Hand,
  MapPin,
  MessageCircle,
  Radar,
  Search,
  Sparkles,
  Timer,
  Trophy,
} from 'lucide-react';
import { useCrew } from '@/lib/store';
import { SCHEDULE_LABEL, VEHICLE_LABEL, ZONES } from '@/lib/labels';
import type { Copilot, Schedule, Vehicle } from '@/lib/types';
import { cn, monthsLabel } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Chip, Label, Select } from '@/components/ui/field';
import { EmptyState, SuccessPanel } from '@/components/ui/states';
import { VoluntaryNotice } from '@/components/voluntary-notice';
import { useToast } from '@/components/ui/toast';

interface Prefs {
  vehicle: Vehicle;
  zone: string;
  schedule: Schedule[];
}

interface Criterion {
  key: string;
  label: string;
  icon: typeof Bike;
  score: number;
  max: number;
  reason: string;
}

function scoreCopilot(c: Copilot, p: Prefs): { total: number; criteria: Criterion[] } {
  const exp = Math.round(Math.min(c.monthsOnPlatform / 48, 1) * 20);
  const veh = c.vehicle === p.vehicle ? 20 : 8;
  const zone = c.zone === p.zone ? 25 : c.nearbyZones.includes(p.zone) ? 15 : 3;
  const avail = c.availability === 'alta' ? 15 : c.availability === 'media' ? 10 : 4;
  const overlap = p.schedule.length ? p.schedule.filter((s) => c.schedule.includes(s)).length / p.schedule.length : 0;
  const sched = Math.round(overlap * 20);
  const criteria: Criterion[] = [
    {
      key: 'exp',
      label: 'Experiencia',
      icon: Trophy,
      score: exp,
      max: 20,
      reason: `${monthsLabel(c.monthsOnPlatform)} en la calle y ${c.accompanied} nuevos acompañados.`,
    },
    {
      key: 'veh',
      label: 'Vehículo',
      icon: Bike,
      score: veh,
      max: 20,
      reason:
        c.vehicle === p.vehicle
          ? `También se mueve en ${VEHICLE_LABEL[c.vehicle].toLowerCase()}: conoce tus rutas y tus retos.`
          : `Se mueve en ${VEHICLE_LABEL[c.vehicle].toLowerCase()}; algunas rutas serán distintas a las tuyas.`,
    },
    {
      key: 'zone',
      label: 'Zona habitual',
      icon: MapPin,
      score: zone,
      max: 25,
      reason:
        c.zone === p.zone
          ? `Trabaja en ${c.zone}, tu misma zona.`
          : c.nearbyZones.includes(p.zone)
            ? `Su zona es ${c.zone}, pero también cubre ${p.zone}.`
            : `Trabaja en ${c.zone}, lejos de ${p.zone}.`,
    },
    {
      key: 'avail',
      label: 'Disponibilidad',
      icon: Timer,
      score: avail,
      max: 15,
      reason: `Disponibilidad ${c.availability} para acompañar. ${c.responseTime}.`,
    },
    {
      key: 'sched',
      label: 'Horario',
      icon: CalendarClock,
      score: sched,
      max: 20,
      reason: overlap
        ? `Coinciden en: ${p.schedule.filter((s) => c.schedule.includes(s)).map((s) => SCHEDULE_LABEL[s].toLowerCase()).join(', ')}.`
        : 'No coinciden en horario: sería más difícil hablar en el momento.',
    },
  ];
  return { total: exp + veh + zone + avail + sched, criteria };
}

type Phase = 'idle' | 'searching' | 'results';

export default function MatchPage() {
  const { state, requestCopilot } = useCrew();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Prefs>({
    vehicle: state.rider.vehicle,
    zone: state.rider.zone,
    schedule: state.rider.schedule,
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [accepted, setAccepted] = useState<Copilot | null>(null);

  const results = useMemo(
    () =>
      state.copilots
        .filter((c) => c.status === 'activo')
        .map((c) => ({ copilot: c, ...scoreCopilot(c, prefs) }))
        .sort((a, b) => b.total - a.total),
    [state.copilots, prefs],
  );

  const search = () => {
    if (!prefs.schedule.length) {
      toast({ tone: 'error', title: 'Elige al menos un horario', description: 'Así encontramos a alguien que coincida contigo.' });
      return;
    }
    setAccepted(null);
    setPhase('searching');
    window.setTimeout(() => setPhase('results'), 1700);
  };

  const request = async (c: Copilot) => {
    await requestCopilot(c.id);
    setAccepted(c);
    toast({ tone: 'success', title: `${c.firstName} aceptó acompañarte`, description: 'Ya puedes escribirle.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSchedule = (s: Schedule) =>
    setPrefs((p) => ({
      ...p,
      schedule: p.schedule.includes(s) ? p.schedule.filter((x) => x !== s) : [...p.schedule, s],
    }));

  const pending = state.pendingCopilotId;

  return (
    <div>
      <PageHeader
        back={{ href: '/mi-copiloto', label: 'Mi Copiloto' }}
        eyebrow="Match"
        title="Encuentra tu Copiloto"
        description="Te proponemos Rappitenderos con experiencia que se ofrecieron como voluntarios. Tú eliges a quién pedirle, y cada Copiloto decide libremente si acepta."
      />

      {accepted && (
        <SuccessPanel
          className="mb-6"
          title={`¡${accepted.firstName} aceptó acompañarte!`}
          description={`${accepted.firstName} decidió voluntariamente ser tu Copiloto. Escríbele para presentarte.`}
        >
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <ButtonLink href="/mi-copiloto/chat" icon={<MessageCircle className="h-4 w-4" />}>
              Hablar con {accepted.firstName}
            </ButtonLink>
            <ButtonLink href="/mi-copiloto" variant="secondary">
              Ver perfil
            </ButtonLink>
          </div>
        </SuccessPanel>
      )}

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Preferencias */}
        <div className="space-y-4 lg:sticky lg:top-10 lg:self-start">
          <Card className="p-5">
            <p className="font-extrabold text-ink-900">Tu perfil de match</p>
            <p className="mt-0.5 text-sm text-ink-500">Ajusta y vuelve a buscar cuando quieras.</p>
            <div className="mt-4 space-y-4">
              <div>
                <Label>Vehículo</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(VEHICLE_LABEL) as Vehicle[]).map((v) => (
                    <Chip key={v} active={prefs.vehicle === v} onClick={() => setPrefs((p) => ({ ...p, vehicle: v }))}>
                      {VEHICLE_LABEL[v]}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="zone">Zona habitual</Label>
                <Select id="zone" value={prefs.zone} onChange={(e) => setPrefs((p) => ({ ...p, zone: e.target.value }))}>
                  {ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label hint="Puedes elegir varios">Horario</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SCHEDULE_LABEL) as Schedule[]).map((s) => (
                    <Chip key={s} active={prefs.schedule.includes(s)} onClick={() => toggleSchedule(s)}>
                      {SCHEDULE_LABEL[s]}
                    </Chip>
                  ))}
                </div>
              </div>
              <Button block onClick={search} loading={phase === 'searching'} icon={<Search className="h-4 w-4" />}>
                {phase === 'results' ? 'Buscar de nuevo' : 'Encontrar mi Copiloto'}
              </Button>
            </div>
          </Card>
          <VoluntaryNotice />
        </div>

        {/* Resultados */}
        <div>
          {phase === 'idle' && (
            <Card className="flex flex-col items-center px-6 py-14 text-center">
              <div className="relative mb-5 flex h-24 w-24 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-brand-100" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
                  <Hand className="h-8 w-8" />
                </span>
              </div>
              <p className="text-xl font-extrabold text-ink-900">Un match pensado para ti</p>
              <p className="mt-2 max-w-md text-sm text-ink-500">
                Cruzamos cinco criterios: <b>experiencia</b>, <b>vehículo</b>, <b>zona habitual</b>, <b>disponibilidad</b> y{' '}
                <b>horario</b>. Así tu Copiloto entiende tu día a día.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[Trophy, Bike, MapPin, Timer, CalendarClock].map((I, i) => (
                  <span key={i} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
                    <I className="h-5 w-5" />
                  </span>
                ))}
              </div>
              <Button className="mt-6" onClick={search} icon={<Search className="h-4 w-4" />}>
                Encontrar mi Copiloto
              </Button>
            </Card>
          )}

          {phase === 'searching' && (
            <Card className="flex flex-col items-center px-6 py-16 text-center" aria-busy="true">
              <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-300/50" />
                <span className="absolute inset-3 animate-pulse-ring rounded-full bg-brand-300/40 [animation-delay:0.5s]" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
                  <Radar className="h-8 w-8 animate-spin [animation-duration:2.5s]" />
                </span>
              </div>
              <p className="text-lg font-extrabold text-ink-900">Buscando Copilotos voluntarios…</p>
              <p className="mt-1 text-sm text-ink-500">
                Revisando {prefs.zone}, {VEHICLE_LABEL[prefs.vehicle].toLowerCase()} y tu horario.
              </p>
            </Card>
          )}

          {phase === 'results' && results.length === 0 && (
            <EmptyState
              icon={<Search className="h-6 w-6" />}
              title="No hay Copilotos disponibles ahora"
              description="Todos están en pausa. Vuelve a intentarlo más tarde: es voluntario y respetamos sus tiempos."
            />
          )}

          {phase === 'results' && results.length > 0 && (
            <div className="stagger space-y-4">
              {results.map(({ copilot: c, total, criteria }, idx) => {
                const isCurrent = state.assignedCopilotId === c.id;
                const isPending = pending === c.id;
                return (
                  <Card key={c.id} className={cn('overflow-hidden', idx === 0 && 'ring-2 ring-brand-300')}>
                    {idx === 0 && (
                      <div className="flex items-center gap-2 bg-brand-50 px-5 py-2 text-xs font-bold text-brand-700">
                        <Sparkles className="h-3.5 w-3.5" /> Mejor coincidencia para ti
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar initials={c.initials} color={c.color} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-extrabold text-ink-900">{c.name}</p>
                            {isCurrent && <Badge tone="mint">Tu Copiloto actual</Badge>}
                          </div>
                          <p className="text-sm text-ink-500">
                            {monthsLabel(c.monthsOnPlatform)} · {c.zone} · {VEHICLE_LABEL[c.vehicle]}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-ink-400">
                            <Clock className="h-3.5 w-3.5" /> {c.responseTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-extrabold tracking-tight text-ink-900">{total}%</p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">match</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-ink-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-500">¿Por qué este match?</p>
                        <div className="mt-3 space-y-3">
                          {criteria.map((cr) => (
                            <div key={cr.key} className="grid grid-cols-[auto_1fr] items-start gap-3">
                              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-ink-600">
                                <cr.icon className="h-4 w-4" />
                              </span>
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-bold text-ink-800">{cr.label}</p>
                                  <p className="text-xs font-bold text-ink-500">
                                    {cr.score}/{cr.max}
                                  </p>
                                </div>
                                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-200/70">
                                  <div
                                    className={cn(
                                      'h-full origin-left animate-grow-x rounded-full',
                                      cr.score / cr.max > 0.7 ? 'bg-mint-500' : cr.score / cr.max > 0.4 ? 'bg-sun-400' : 'bg-brand-400',
                                    )}
                                    style={{ width: `${(cr.score / cr.max) * 100}%` }}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-ink-500">{cr.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-ink-500">
                          {isPending
                            ? `Esperando la respuesta de ${c.firstName}. Si no puede, no pasa nada: te proponemos a alguien más.`
                            : `${c.firstName} puede aceptar o no, sin ninguna penalización.`}
                        </p>
                        {isCurrent ? (
                          <ButtonLink href="/mi-copiloto/chat" variant="secondary" size="sm" icon={<MessageCircle className="h-4 w-4" />}>
                            Hablar con {c.firstName}
                          </ButtonLink>
                        ) : (
                          <Button
                            size="sm"
                            variant={idx === 0 ? 'primary' : 'dark'}
                            loading={isPending}
                            disabled={!!pending && !isPending}
                            onClick={() => request(c)}
                          >
                            {isPending ? 'Esperando respuesta…' : 'Pedirle que me acompañe'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
