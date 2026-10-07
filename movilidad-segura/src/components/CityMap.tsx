import { Bus, House, Minus, Plus, LocateFixed, School } from 'lucide-react';
import { APPROACH, DEPOT, HOME, MAIN, OTHER_STOPS, SCHOOL_PT, pointAt, reversed, slice, toPath, type Pt } from '../lib/geo';

export type MapPhase = 'approach' | 'toSchool' | 'toHome';

interface CityMapProps {
  phase: MapPhase;
  /** Avance del vehículo dentro de la fase (0–1). */
  progress: number;
  /** Muestra las geocercas de casa y colegio. */
  geofences?: boolean;
  /** Resalta la geocerca que se acaba de cruzar. */
  activeFence?: 'home' | 'school' | null;
  controls?: boolean;
  showVehicle?: boolean;
  /** Acerca el mapa a la casa o al colegio (mapas pequeños de confirmación). */
  focus?: 'home' | 'school';
  className?: string;
}

const ROT = -9; // la cuadrícula de Lima no está alineada al norte
const CX = 200;
const CY = 210;

/** Mapa simulado (SVG) de Miraflores – San Isidro – Surco. No usa GPS ni APIs externas. */
export function CityMap({ phase, progress, geofences = true, activeFence = null, controls = true, showVehicle = true, focus, className = '' }: CityMapProps) {
  const path = phase === 'approach' ? APPROACH : phase === 'toSchool' ? MAIN : reversed(MAIN);
  const done = slice(path, 0, progress);
  const rest = slice(path, progress, 1);
  const van = pointAt(path, progress);

  // Trazo completo de la ruta del día (contexto, en gris azulado).
  const context: Pt[] = phase === 'approach' ? MAIN : APPROACH;

  let viewBox = '-20 -70 440 500';
  if (focus) {
    const [fx, fy] = rotate(focus === 'home' ? HOME : SCHOOL_PT);
    viewBox = `${fx - 130} ${fy - 55} 260 110`;
  }

  return (
    <div className={`overflow-hidden bg-[#EDF1F6] ${className.includes('absolute') ? '' : 'relative'} ${className}`}>
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        className="absolute inset-0 h-full w-full"
        aria-label="Mapa simulado del recorrido"
      >
        <defs>
          <pattern id="blocks" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#EDF1F6" />
            <rect x="3" y="3" width="34" height="34" rx="3" fill="#E4E9F0" />
            <path d="M3 20h34M20 3v34" stroke="#EDF1F6" strokeWidth="1.4" />
          </pattern>
          <linearGradient id="sea" x1="0" x2="1">
            <stop offset="0" stopColor="#C9DCF2" />
            <stop offset="1" stopColor="#D8E6F6" />
          </linearGradient>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0B1F3A" floodOpacity="0.25" />
          </filter>
        </defs>

        <g transform={`rotate(${ROT} ${CX} ${CY})`}>
          {/* Manzanas */}
          <rect x="-600" y="-600" width="1600" height="1600" fill="url(#blocks)" />

          {/* Parques */}
          <rect x="163" y="243" width="34" height="74" rx="4" fill="#DCEBDF" />
          <rect x="283" y="243" width="74" height="34" rx="4" fill="#DCEBDF" />
          <rect x="203" y="43" width="74" height="34" rx="4" fill="#DCEBDF" />
          <rect x="363" y="363" width="114" height="74" rx="6" fill="#DCEBDF" />
          <circle cx="40" cy="160" r="16" fill="#DCEBDF" />

          {/* Calles secundarias */}
          {Array.from({ length: 40 }, (_, i) => -600 + i * 40).map((v) => (
            <g key={v} stroke="#FFFFFF" strokeWidth="2.6">
              <line x1={v} y1="-600" x2={v} y2="1000" />
              <line x1="-600" y1={v} x2="1000" y2={v} />
            </g>
          ))}

          {/* Avenidas principales */}
          <g stroke="#FFFFFF" strokeLinecap="round">
            <line x1="-600" y1="200" x2="1000" y2="200" strokeWidth="9" />
            <line x1="-600" y1="360" x2="1000" y2="360" strokeWidth="9" />
            <line x1="120" y1="-600" x2="120" y2="1000" strokeWidth="9" />
            <line x1="240" y1="-600" x2="240" y2="1000" strokeWidth="8" />
            <line x1="-600" y1="40" x2="1000" y2="40" strokeWidth="7" />
            <line x1="400" y1="-600" x2="400" y2="1000" strokeWidth="11" />
            <line x1="-200" y1="620" x2="560" y2="-160" strokeWidth="8" />
          </g>
          <g stroke="#F6E7B8" strokeLinecap="round" opacity="0.9">
            <line x1="400" y1="-600" x2="400" y2="1000" strokeWidth="3" />
          </g>

          {/* Nombres de vías */}
          <g fill="#8A97AB" fontSize="7.2" fontWeight="600" letterSpacing="0.3">
            <text x="268" y="196">
              AV. JAVIER PRADO ESTE
            </text>
            <text x="-30" y="356">
              AV. BENAVIDES
            </text>
            <text x="116" y="80" transform="rotate(-90 116 80)">
              AV. AREQUIPA
            </text>
            <text x="246" y="300" transform="rotate(90 246 300)">
              AV. PRIMAVERA
            </text>
            <text x="406" y="120" transform="rotate(90 406 120)">
              PANAMERICANA SUR
            </text>
            <text x="190" y="36">
              AV. ANGAMOS
            </text>
          </g>

          {/* Geocercas */}
          {geofences && (
            <g>
              <Fence c={HOME} active={activeFence === 'home'} />
              <Fence c={SCHOOL_PT} active={activeFence === 'school'} />
            </g>
          )}

          {/* Ruta de contexto */}
          <path
            d={toPath(context)}
            fill="none"
            stroke="#9FB2CC"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 7"
            opacity="0.8"
          />

          {/* Ruta pendiente */}
          {rest.length > 1 && (
            <path
              d={toPath(rest)}
              fill="none"
              stroke="#2563EB"
              strokeOpacity="0.35"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 8"
            />
          )}
          {/* Ruta recorrida */}
          {done.length > 1 && (
            <>
              <path d={toPath(done)} fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d={toPath(done)} fill="none" stroke="#2563EB" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {/* Paradas de otros niños */}
          {OTHER_STOPS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          ))}

          {/* Base de la movilidad */}
          <g transform={`translate(${DEPOT[0]} ${DEPOT[1]}) rotate(${-ROT})`}>
            <rect x="-5" y="-5" width="10" height="10" rx="2.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
          </g>

          {/* Casa y colegio */}
          <Pin at={HOME} label="Casa" icon="home" />
          <Pin at={SCHOOL_PT} label="Colegio Demo" icon="school" />

          {/* Movilidad */}
          {showVehicle && (
            <g transform={`translate(${van[0]} ${van[1]}) rotate(${-ROT})`} style={{ transition: 'none' }}>
              <circle r="15" fill="#2563EB" opacity="0.25" className="origin-center animate-ping2" style={{ transformBox: 'fill-box' }} />
              <circle r="17" fill="#2563EB" opacity="0.12" />
              <rect x="-13" y="-13" width="26" height="26" rx="9" fill="#0B1F3A" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#pinShadow)" />
              <Bus x={-7.5} y={-7.5} width={15} height={15} color="#FFFFFF" strokeWidth={2.2} />
            </g>
          )}
        </g>

        {/* Océano Pacífico (fuera de la rotación para una costa natural) */}
        <path d="M-600 -600 L 24 -600 C 10 -200, -6 40, 6 180 S 44 420, 90 560 L 140 1000 L -600 1000 Z" fill="url(#sea)" />
        <path d="M24 -600 C 10 -200, -6 40, 6 180 S 44 420, 90 560 L 140 1000" fill="none" stroke="#B8CDE6" strokeWidth="2" />
        <text x="-24" y="300" transform="rotate(-80 -24 300)" fill="#7C9CC4" fontSize="8" fontWeight="600" letterSpacing="2.5">
          OCÉANO PACÍFICO
        </text>

        {/* Distritos */}
        <g fill="#7E8BA0" fontSize="8" fontWeight="700" letterSpacing="1.6" opacity="0.75">
          <text x="44" y="-20">
            SAN ISIDRO
          </text>
          <text x="20" y="410">
            MIRAFLORES
          </text>
          <text x="178" y="420">
            SURQUILLO
          </text>
          <text x="300" y="30">
            SANTIAGO DE SURCO
          </text>
        </g>
      </svg>

      {controls && (
        <>
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white/95 shadow-card backdrop-blur">
            <span className="grid h-10 w-10 place-items-center text-ink-2">
              <Plus size={18} />
            </span>
            <span className="h-px bg-line" />
            <span className="grid h-10 w-10 place-items-center text-ink-2">
              <Minus size={18} />
            </span>
          </div>
          <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-brand shadow-card">
            <LocateFixed size={18} />
          </span>
          <span className="absolute bottom-3 left-3 rounded-md bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-ink-3">Mapa simulado · Lima</span>
        </>
      )}
    </div>
  );
}

/** Coordenadas de un punto de la cuadrícula tras aplicar la rotación del mapa. */
function rotate([x, y]: Pt): Pt {
  const r = (ROT * Math.PI) / 180;
  const dx = x - CX;
  const dy = y - CY;
  return [CX + dx * Math.cos(r) - dy * Math.sin(r), CY + dx * Math.sin(r) + dy * Math.cos(r)];
}

function Fence({ c, active }: { c: Pt; active: boolean }) {
  return (
    <g>
      {active && (
        <circle
          cx={c[0]}
          cy={c[1]}
          r="76"
          fill="#2563EB"
          opacity="0.18"
          className="animate-ping2"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '2.4s' }}
        />
      )}
      <circle
        cx={c[0]}
        cy={c[1]}
        r="76"
        fill="#2563EB"
        fillOpacity={active ? 0.12 : 0.06}
        stroke="#2563EB"
        strokeOpacity={active ? 0.7 : 0.35}
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
    </g>
  );
}

function Pin({ at, label, icon }: { at: Pt; label: string; icon: 'home' | 'school' }) {
  const Icon = icon === 'home' ? House : School;
  const w = label.length * 5.6 + 18;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${-ROT})`}>
      <g filter="url(#pinShadow)">
        <circle r="13" fill={icon === 'home' ? '#16A34A' : '#FFFFFF'} stroke={icon === 'home' ? '#FFFFFF' : '#0B1F3A'} strokeWidth="2.5" />
        <Icon x={-6.5} y={-6.5} width={13} height={13} color={icon === 'home' ? '#FFFFFF' : '#0B1F3A'} strokeWidth={2.3} />
      </g>
      <g transform={`translate(${-w / 2} 18)`}>
        <rect width={w} height="17" rx="8.5" fill="#0B1F3A" />
        <text x={w / 2} y="11.6" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
          {label}
        </text>
      </g>
    </g>
  );
}
