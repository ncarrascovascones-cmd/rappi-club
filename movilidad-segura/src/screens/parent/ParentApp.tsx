import { useEffect, useState } from 'react';
import { Bell, History, House, Navigation } from 'lucide-react';
import { GeofenceAlert, NotificationBanner } from '../../components/Overlays';
import { useStore } from '../../state/store';
import { HomeScreen } from './HomeScreen';
import { TripScreen } from './TripScreen';
import { HistoryScreen } from './HistoryScreen';
import { AlertsScreen } from './AlertsScreen';

export type ParentTab = 'home' | 'trip' | 'history' | 'alerts';

const focusTab = (stage: string): ParentTab => (stage === 'finished' ? 'history' : stage === 'idle' ? 'home' : 'trip');

// Último pedido de «mostrar el viaje» atendido. Es de módulo porque el panel de simulación
// puede pedirlo en el mismo instante en que se monta la app del padre.
let handledFocus = 0;

export function ParentApp({ onSwitchProfile }: { onSwitchProfile: () => void }) {
  const { state } = useStore();
  const [tab, setTab] = useState<ParentTab>(() => (state.focusSeq > handledFocus ? focusTab(state.stage) : 'home'));
  const unread = state.notifications.filter((n) => n.id > state.lastReadId).length;

  // El panel de simulación lleva al padre directamente a la pantalla del viaje.
  useEffect(() => {
    if (state.focusSeq > handledFocus) setTab(focusTab(state.stage));
    handledFocus = state.focusSeq;
  }, [state.focusSeq, state.stage]);

  // Durante el recorrido automático el padre siempre ve el viaje.
  useEffect(() => {
    if (state.autoplay) setTab(focusTab(state.stage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.autoplay]);

  const tabs: { id: ParentTab; label: string; icon: typeof House; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: House },
    { id: 'trip', label: 'Viaje', icon: Navigation },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'alerts', label: 'Alertas', icon: Bell, badge: unread },
  ];

  return (
    <div className="relative flex h-full flex-col bg-surface">
      <div className="relative min-h-0 flex-1">
        {tab === 'home' && <HomeScreen go={setTab} onSwitchProfile={onSwitchProfile} unread={unread} />}
        {tab === 'trip' && <TripScreen go={setTab} />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'alerts' && <AlertsScreen />}
      </div>

      <nav className="pb-hb relative z-20 grid grid-cols-4 border-t border-line bg-white/95 px-2 pt-2 backdrop-blur">
        {tabs.map(({ id, label, icon: Icon, badge }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 py-1 text-[11px] font-semibold transition ${active ? 'text-brand' : 'text-ink-4 hover:text-ink-2'}`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.3 : 2} />
                {!!badge && (
                  <span className="absolute -right-2 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </button>
          );
        })}
      </nav>

      <NotificationBanner onOpen={() => setTab('trip')} />
      <GeofenceAlert />
    </div>
  );
}
