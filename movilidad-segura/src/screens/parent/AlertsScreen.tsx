import { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { notifIcon, notifTone } from '../../components/Overlays';
import { ScreenTitle } from '../../components/ui';
import { useStore } from '../../state/store';

export function AlertsScreen() {
  const { state, dispatch } = useStore();
  const list = [...state.notifications].sort((a, b) => b.id - a.id);
  // Conserva los puntos de «no leída» durante esta visita.
  const [lastRead] = useState(state.lastReadId);

  useEffect(() => {
    dispatch({ type: 'MARK_READ' });
  }, [dispatch, state.seq]);

  return (
    <div className="pt-sb h-full overflow-y-auto pb-8 no-scrollbar">
      <ScreenTitle title="Alertas" subtitle="Notificaciones automáticas del recorrido" />

      {list.length === 0 ? (
        <div className="mx-5 mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white p-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand">
            <BellRing size={24} />
          </span>
          <p className="mt-4 font-semibold">Todo tranquilo por ahora</p>
          <p className="mt-1 text-[13.5px] text-ink-3">Aquí verás cada abordaje, llegada, entrega y alerta de geocerca en tiempo real.</p>
        </div>
      ) : (
        <ul className="space-y-2.5 px-5">
          {list.map((n, i) => (
            <li key={n.id} className="card flex animate-fade-up items-start gap-3 p-4" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${notifTone(n.kind)}`}>{notifIcon(n.kind)}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[14.5px] font-semibold leading-snug">{n.title}</span>
                  {n.id > lastRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-2">{n.body}</span>
                <span className="mt-1 block text-[12px] text-ink-4 tabular">{n.time}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
