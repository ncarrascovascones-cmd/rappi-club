'use client';

import { useState } from 'react';
import { Check, HandHeart, LogOut, Pause, Play } from 'lucide-react';
import { useCrew } from '@/lib/store';
import { VOLUNTARY_RULE_DETAIL } from '@/lib/labels';
import type { CopilotStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Modal } from './ui/modal';
import { useToast } from './ui/toast';

const STATUS_UI: Record<CopilotStatus, { label: string; dot: string; box: string; text: string }> = {
  activo: { label: 'ACTIVO', dot: 'bg-mint-500', box: 'bg-mint-50 ring-mint-200', text: 'text-mint-700' },
  pausa: { label: 'PAUSADO', dot: 'bg-sun-500', box: 'bg-sun-50 ring-sun-100', text: 'text-sun-700' },
  retirado: { label: 'NO PARTICIPA', dot: 'bg-ink-400', box: 'bg-ink-100 ring-ink-200', text: 'text-ink-600' },
};

const STATUS_HINT: Record<CopilotStatus, string> = {
  activo: 'Recibes invitaciones de nuevos Rappitenderos y decides cuáles aceptar.',
  pausa: 'No recibes invitaciones nuevas. Tus acompañados actuales pueden seguir escribiéndote.',
  retirado: 'No participas como Copiloto. Tus postas y protocolos siguen ayudando a la Crew.',
};

/** “Mi participación”: estado voluntario del Copiloto con acciones para pausar, reactivar o retirarse. */
export function ParticipationCard({ className }: { className?: string }) {
  const { state, setCopilotStatus } = useCrew();
  const { toast } = useToast();
  const status = state.copilotSelfStatus;
  const [busy, setBusy] = useState<CopilotStatus | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const ui = STATUS_UI[status];

  const change = async (next: CopilotStatus) => {
    setBusy(next);
    await setCopilotStatus(next);
    setBusy(null);
    setLeaveOpen(false);
    const msg: Record<CopilotStatus, { title: string; description: string }> = {
      activo: { title: 'Participación activa', description: 'Volverás a recibir invitaciones de nuevos Rappitenderos.' },
      pausa: { title: 'Participación pausada', description: 'No recibirás nuevas invitaciones hasta que la reactives.' },
      retirado: { title: 'Dejaste de participar como Copiloto', description: 'Gracias por todo lo que compartiste. Sin penalización.' },
    };
    toast({ tone: next === 'retirado' ? 'info' : 'success', ...msg[next] });
  };

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-ink-900">Mi participación</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-mint-700">
            <HandHeart className="h-4 w-4" /> Tu participación es voluntaria.
          </p>
        </div>
        <span className={cn('inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-extrabold tracking-wider ring-1', ui.box, ui.text)}>
          <span className={cn('h-2 w-2 rounded-full', ui.dot)} />
          {ui.label}
        </span>
      </div>
      <p className="mt-3 text-sm text-ink-600">
        <span className="font-semibold text-ink-500">Estado: </span>
        {STATUS_HINT[status]}
      </p>
      <p className="mt-1 text-xs text-ink-400">{VOLUNTARY_RULE_DETAIL}</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {status === 'activo' && (
          <Button variant="secondary" className="flex-1" loading={busy === 'pausa'} disabled={!!busy} icon={<Pause className="h-4 w-4" />} onClick={() => change('pausa')}>
            Pausar participación
          </Button>
        )}
        {status === 'pausa' && (
          <Button variant="mint" className="flex-1" loading={busy === 'activo'} disabled={!!busy} icon={<Play className="h-4 w-4" />} onClick={() => change('activo')}>
            Reactivar participación
          </Button>
        )}
        {status !== 'retirado' ? (
          <Button variant="danger" className="flex-1" disabled={!!busy} icon={<LogOut className="h-4 w-4" />} onClick={() => setLeaveOpen(true)}>
            Dejar de participar
          </Button>
        ) : (
          <Button variant="mint" className="flex-1" loading={busy === 'activo'} icon={<Play className="h-4 w-4" />} onClick={() => change('activo')}>
            Volver a participar
          </Button>
        )}
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
              <b>Tu participación es voluntaria y tu decisión se respeta.</b> No tienes que explicar por qué.
            </p>
          </div>
          <ul className="space-y-2">
            {[
              'Sin ninguna penalización en tu cuenta, tus pedidos ni tus beneficios.',
              'Dejarás de recibir invitaciones de nuevos Rappitenderos.',
              'Rappi propondrá con cuidado otro Copiloto a quienes acompañas hoy.',
              'Tus postas y protocolos originados siguen siendo parte de la Crew.',
              'Puedes volver cuando quieras.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-600" /> {t}
              </li>
            ))}
          </ul>
          {status === 'activo' && (
            <button
              type="button"
              onClick={() => change('pausa')}
              className="text-xs font-bold text-ink-500 underline-offset-2 hover:text-ink-900 hover:underline"
            >
              ¿Solo necesitas un respiro? Mejor pausa tu participación.
            </button>
          )}
        </div>
      </Modal>
    </Card>
  );
}
