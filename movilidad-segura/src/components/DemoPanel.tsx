import { Check, Columns2, FlaskConical, Pause, Play, RotateCcw, Smartphone, X } from 'lucide-react';
import { DEMO_STEPS, stageIdx, useStore } from '../state/store';

export type ViewMode = 'parent' | 'driver' | 'dual';

interface DemoPanelProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  view: ViewMode | null;
  setView: (v: ViewMode) => void;
}

/**
 * Panel de SIMULACIÓN para presentar la demo. No forma parte de la app final:
 * vive fuera del teléfono y se abre con el botón «Modo demo».
 */
export function DemoPanel({ open, setOpen, view, setView }: DemoPanelProps) {
  const { state, dispatch } = useStore();
  const current = stageIdx(state.stage);

  const go = (stage: (typeof DEMO_STEPS)[number]['stage']) => {
    dispatch({ type: 'SET_AUTOPLAY', on: false });
    if (view === 'driver' || view === null) setView('parent');
    dispatch({ type: 'SET_STAGE', stage, focus: true });
  };

  const toggleAutoplay = () => {
    if (state.autoplay) return dispatch({ type: 'SET_AUTOPLAY', on: false });
    if (view === 'driver' || view === null) setView('parent');
    dispatch({ type: 'SET_STAGE', stage: 'approaching', focus: true });
    dispatch({ type: 'SET_AUTOPLAY', on: true });
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Modo demo"
          className="fixed left-0 top-1/2 z-[200] flex -translate-y-1/2 items-center gap-2 rounded-r-xl bg-[#111827]/80 px-2 py-3 text-[12.5px] font-semibold text-white shadow-lift backdrop-blur transition hover:bg-[#111827] md:left-auto md:right-6 md:top-auto md:bottom-6 md:translate-y-0 md:rounded-full md:px-3.5 md:py-2.5"
        >
          <FlaskConical size={16} /> <span className="hidden md:inline">Modo demo</span>
          {state.autoplay && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
        </button>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[200] max-h-[85dvh] animate-sheet-up overflow-y-auto rounded-t-3xl bg-[#0F1522] p-5 text-white shadow-2xl no-scrollbar md:inset-x-auto md:bottom-6 md:right-6 md:w-[340px] md:animate-scale-in md:rounded-3xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">Simulación</p>
              <p className="mt-1 text-[12.5px] text-white/50">Solo para la presentación · no es parte de la app</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/15"
              aria-label="Cerrar panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Vista */}
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Vista</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl bg-white/5 p-1">
            {(
              [
                { id: 'parent', label: 'Padre', icon: Smartphone, cls: '' },
                { id: 'driver', label: 'Conductor', icon: Smartphone, cls: '' },
                { id: 'dual', label: 'Ambos', icon: Columns2, cls: 'hidden lg:flex' },
              ] as const
            ).map(({ id, label, icon: Icon, cls }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`${cls || 'flex'} items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-semibold transition ${view === id ? 'bg-white text-[#0F1522]' : 'text-white/70 hover:bg-white/10'}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Pasos */}
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">Recorrido</p>
          <ol className="mt-2 space-y-1">
            {DEMO_STEPS.map((s, i) => {
              const idx = stageIdx(s.stage);
              const isCurrent = idx === current || (s.stage === 'delivered' && state.stage === 'finished');
              const done = idx < current && !isCurrent;
              return (
                <li key={s.stage}>
                  <button
                    onClick={() => go(s.stage)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13.5px] transition ${isCurrent ? 'bg-brand text-white' : 'text-white/80 hover:bg-white/[0.07]'}`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold ${
                        isCurrent ? 'bg-white text-brand' : done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={toggleAutoplay}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-[13.5px] font-semibold text-[#0F1522] transition hover:bg-emerald-400"
            >
              {state.autoplay ? <Pause size={16} /> : <Play size={16} />}
              {state.autoplay ? 'Pausar recorrido' : 'Reproducir recorrido completo'}
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white/80 hover:bg-white/15"
              aria-label="Reiniciar"
              title="Reiniciar simulación"
            >
              <RotateCcw size={17} />
            </button>
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-white/40">
            Las alertas de geocerca se disparan solas cuando la movilidad entra al radio de casa o colegio.
          </p>
        </div>
      )}
    </>
  );
}
