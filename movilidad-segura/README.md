# Movilidad Segura · MVP

> **Sabe dónde está tu hijo en cada momento del recorrido.**

MVP visual y funcional de una plataforma de **seguridad y trazabilidad para transporte escolar**.
Es una web responsive que se ve y se usa como una app móvil. Todo funciona con **datos simulados**:
no hay backend, GPS real ni APIs externas.

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior.

```bash
cd movilidad-segura
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

- **Celular** (o DevTools en 390×844): la app ocupa toda la pantalla.
- **Escritorio**: se muestra dentro de un teléfono, junto a un panel que explica el concepto al socio.

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Typecheck + build de producción en `dist/` |
| `npm run build:single` | Genera **un solo archivo HTML** autocontenido en `dist-single/index.html` (para enviarlo por correo, abrirlo sin servidor o publicarlo como Artifact) |
| `npm run preview` | Sirve el build de producción |
| `npm run typecheck` | Solo TypeScript |

## Cómo presentarlo en 2 minutos

1. Entra como **Padre / Madre** → toca **Ver viaje**. La movilidad avanza en el mapa y, al entrar a la geocerca
   de la casa, salta sola la alerta **“La movilidad está a 5 minutos de llegar”**.
2. **Entendido** → la movilidad llega → **“Mateo abordó la movilidad · 7:11 a. m.”** → **Ver viaje en vivo**.
3. El viaje avanza hacia el colegio; la alerta de llegada al colegio aparece sola. Luego **“Mateo llegó al colegio”**,
   **Ver resumen** y **Ver viaje de regreso**.
4. Regreso, alerta “a 5 minutos de casa” y **entrega confirmada** con *Recibido por* y *código 4827*.
5. **Finalizar viaje** → **Historial de viajes**.

Atajo: botón **Modo demo** (abajo a la derecha) → **Reproducir recorrido completo** recorre todo solo (≈1,5 min).
En escritorio, la vista **Ambos** muestra el teléfono del conductor y el del padre a la vez: cuando el conductor
marca *Recogido*, la notificación llega al padre en vivo.

### Panel de simulación (“Modo demo”)

Está fuera del teléfono, con estilo de herramienta interna, para que no parezca parte del producto:

- **Vista**: Padre · Conductor · Ambos (ambos solo en pantallas anchas).
- **Recorrido**: 1. Movilidad en camino · 2. Niño abordó · 3. En ruta · 4. Cerca del colegio · 5. Llegó al colegio ·
  6. Recogido del colegio · 7. Regreso a casa · 8. Cerca de casa · 9. Niño entregado.
- **Reproducir recorrido completo** y **Reiniciar**.

El estado se guarda en `localStorage`; al recargar la página continúa donde estaba. Usa *Reiniciar* para empezar de cero.

## Qué incluye

**Perfil Padre / Madre**

- Inicio: “Buenos días, Nicolás”, tarjeta de Mateo (colegio, ruta, estado en vivo), próximo viaje y conductor.
- Viaje en vivo con mapa simulado de Lima (Miraflores → Surco), geocercas, marcador animado, tiempo estimado y
  línea de progreso Casa → En ruta → Colegio.
- Alertas automáticas de geocerca (casa, colegio, regreso) como modal grande + notificaciones push simuladas.
- Confirmaciones de abordaje, llegada, recojo en el colegio y entrega con código.
- Historial de viajes (hoy, ayer, lunes) con detalle de cada viaje, y bandeja de alertas.

**Perfil Conductor / Tutora**

- “Ruta de hoy · Ruta 04 · 8 niños”, contadores de recogidos/entregados y selector Ida / Regreso.
- Por niño: **Recogido** (registra hora, dirección y coordenadas, y avisa al padre) y **Entregado**
  (en la ida: entrega en el colegio; en el regreso: *¿Quién recibió al niño?* → *Código de entrega* → *Entrega confirmada*).
- **Reportar incidencia**: Retraso, Tráfico, Cambio de ruta, Problema con vehículo, Emergencia → **Enviar alerta**.
  La incidencia aparece en el viaje y en las alertas del padre.
- Mapa de la ruta e historial de incidencias.

Los dos perfiles comparten el mismo estado: lo que hace el conductor se refleja en la app del padre.

## Estructura de archivos

```
movilidad-segura/
├── index.html
├── package.json
├── tailwind.config.js        Paleta (#0B1F3A, #2563EB, #16A34A, #F5F7FA), sombras y animaciones
├── vite.config.ts            Build normal y build de un solo archivo (--mode single)
└── src/
    ├── main.tsx
    ├── App.tsx               Layout: selector de perfil, teléfono(s), panel de presentación y Modo demo
    ├── styles/index.css
    ├── data/mock.ts          Datos ficticios: familia, conductor, niños de la ruta, historial, incidencias
    ├── state/store.tsx       Estado global (useReducer + localStorage): etapas, notificaciones, eventos, incidencias
    ├── lib/
    │   ├── geo.ts            Trazos de la ruta y utilidades para posicionar la movilidad
    │   ├── stageMap.ts       Posición del vehículo por etapa y cálculo del tiempo estimado
    │   └── useAnimatedValue.ts
    ├── components/
    │   ├── CityMap.tsx       Mapa SVG simulado de Lima con geocercas y marcador animado
    │   ├── Phone.tsx         Marco de teléfono (escritorio) / pantalla completa (móvil)
    │   ├── Overlays.tsx      Notificación push y alerta grande de geocerca
    │   ├── DemoPanel.tsx     Panel “SIMULACIÓN”
    │   ├── PresentationPanel.tsx
    │   └── ui.tsx            Logo, avatar, píldoras, bottom sheet, check animado…
    └── screens/
        ├── ProfileSelect.tsx
        ├── parent/           ParentApp, HomeScreen, TripScreen, HistoryScreen, AlertsScreen
        └── driver/           DriverApp, DriverSheets (recogido, entregado, incidencias)
```

## Editar los datos

- `src/data/mock.ts`: nombres, colegio, placa, niños de la ruta, códigos de entrega e historial.
- `src/state/store.tsx`: horas simuladas de cada etapa (`STAGE_CLOCK`) y textos de las notificaciones (`TEMPLATES`).
- `src/lib/geo.ts`: trazo de la ruta sobre el mapa.

Stack: React 18 · TypeScript · Vite · Tailwind CSS · Lucide React · Inter (fuente local, sin CDN).
