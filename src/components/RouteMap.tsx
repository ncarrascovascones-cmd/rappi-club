/**
 * Mapa ilustrado y conceptual de "Ruta a Casa".
 * No usa mapas reales ni GPS: es una ilustración SVG.
 */
const ROUTE = 'M44 188 C 70 170, 92 150, 112 150 S 158 172, 176 160 S 206 108, 226 102 S 272 70, 292 52';
const stops = [
  { x: 112, y: 150 },
  { x: 176, y: 160 },
  { x: 226, y: 102 },
];

export function RouteMap({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 340 230" className="h-auto w-full" role="img" aria-label="Mapa conceptual de la ruta aproximada hacia casa">
      <defs>
        <linearGradient id="route-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FF7A3D" />
          <stop offset="1" stopColor="#E0230F" />
        </linearGradient>
        <pattern id="blocks" width="34" height="34" patternUnits="userSpaceOnUse">
          <rect x="4" y="4" width="26" height="26" rx="6" fill="#ECE8E2" />
        </pattern>
      </defs>

      {/* Fondo de ciudad */}
      <rect width="340" height="230" rx="22" fill="#F5F2EE" />
      <rect width="340" height="230" rx="22" fill="url(#blocks)" />

      {/* Parque y río */}
      <rect x="196" y="150" width="96" height="56" rx="16" fill="#D8EEDC" />
      <path d="M-10 70 C 60 40, 120 90, 200 50 S 300 10, 350 20" stroke="#D5E6F6" strokeWidth="16" fill="none" />

      {/* Avenidas */}
      <path d="M0 118 H340 M150 0 V230 M0 200 H340" stroke="#FFFFFF" strokeWidth="9" />

      {/* Zona de residencia */}
      <circle cx="292" cy="52" r="34" fill="#FF5A2C" opacity="0.08" />
      <circle cx="292" cy="52" r="34" fill="none" stroke="#FF5A2C" strokeOpacity="0.35" strokeDasharray="4 4" />

      {/* Ruta */}
      <path d={ROUTE} fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
      <path
        d={ROUTE}
        fill="none"
        stroke={active ? 'url(#route-grad)' : '#B7B7C2'}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="10 10"
        className={active ? 'animate-dash' : ''}
      />

      {/* Paradas intermedias */}
      {stops.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r="11" fill="#FFFFFF" stroke={active ? '#FF5A2C' : '#B7B7C2'} strokeWidth="3" />
          <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#16161D">
            {i + 1}
          </text>
        </g>
      ))}

      {/* Punto A */}
      <g>
        {active && <circle cx="44" cy="188" r="12" fill="#16161D" opacity="0.35" className="origin-[44px_188px] animate-pulse-ring" />}
        <circle cx="44" cy="188" r="12" fill="#16161D" />
        <text x="44" y="192" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">A</text>
        <rect x="62" y="196" width="76" height="22" rx="11" fill="#16161D" />
        <text x="100" y="211" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">Tu ubicación</text>
      </g>

      {/* Punto B: Casa */}
      <g>
        <path d="M292 70 c-12-14-18-22-18-30 a18 18 0 0 1 36 0 c0 8-6 16-18 30z" fill="url(#route-grad)" />
        <path d="M284 42 l8-7 8 7 v8 h-16z" fill="#FFFFFF" />
        <rect x="264" y="80" width="56" height="22" rx="11" fill="#FFFFFF" stroke="#FFD9CC" />
        <text x="292" y="95" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#F03D16">Casa · B</text>
      </g>
    </svg>
  );
}
