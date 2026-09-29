# RAPPI CREW · “La escuela de la calle”

> **Tu experiencia guía a los nuevos.** · Campaña: **PASA LA POSTA**
>
> *No aprendas a golpes. Aprende de los que ya pasaron por ahí.*

Prototipo funcional de alta fidelidad de una propuesta de fidelización de Rappitenderos.
Un **Copiloto voluntario** acompaña a quienes empiezan y las experiencias de la flota se convierten en
**Protocolos Crew validados por Rappi**.

> ⚠️ Es un concepto independiente con fines de demostración. **No es una aplicación oficial de Rappi** ni está
> conectada a sus sistemas. Personas, historias, métricas y beneficios son ficticios.

Lo que el prototipo **no** es: no es una app de navegación, no es un clon de Waze, no usa puntos, bonos ni
incentivos económicos, y nunca obliga a nadie a ser Copiloto.

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** estricto
- **Tailwind CSS 3** + **Lucide icons** + fuente Plus Jakarta Sans (self-hosted con Fontsource)
- **Supabase** opcional (persistencia remota). Sin configurarlo, la app funciona en modo demo con
  `sessionStorage`
- Listo para **Vercel**

## Instalación y ejecución local

Requisitos: Node.js 18.18 o superior (recomendado 20+) y npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Build de producción (incluye lint y chequeo de tipos) |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:seed` | Carga los datos demo en Supabase (ver abajo) |

## Demo para el jurado (Modo presentación)

1. `npm run build && npm start` (o `npm run dev`) y abre `http://localhost:3000`.
2. Pulsa **Modo presentación** en la pantalla de entrada (también está en la barra lateral y en el menú mobile),
   o entra directo a `/presentacion`.
3. La portada explica en 1 minuto el problema, qué es Rappi Crew, el flujo central y la validación de Rappi.
   Pulsa **Iniciar recorrido guiado**: la demo vuelve a sus datos de ejemplo para que el caso salga siempre igual.
4. Una barra flotante guía 10 pasos. Avanza con **Siguiente** o con las flechas **← →** del teclado. Cada paso
   muestra el guion (qué decir) y, cuando aplica, un botón de acción:

| # | Paso | Pantalla | Acción |
| --- | --- | --- | --- |
| 1 | Nuevo Rappitendero | `/inicio` | — |
| 2 | Copiloto | `/mi-copiloto` | — |
| 3 | Problema | Chat con el Copiloto | *Enviar mensaje de Valentina* |
| 4 | Necesito una mano | Formulario precargado | Pulsa **Enviar** en el formulario |
| 5 | Administrador | `/admin` (flujo central con números en vivo) | — |
| 6 | Análisis de experiencias | `/admin/experiencias` | *Agrupar 3 experiencias en un patrón* |
| 7 | Protocolo Crew | Patrón → editor | *Proponer solución y crear protocolo* |
| 8 | Validación | Editor | *Enviar a validación y aprobar* |
| 9 | Publicación | Editor | *Publicar protocolo* |
| 10 | Visible para el Rappitendero | `/protocolos/…` | — |

   Si no pulsas el botón de acción, **Siguiente** lo ejecuta por ti, así que el caso nunca queda a medias.
5. Al terminar se abre el **cierre**, con los 8 mensajes clave y el enlace para repetir el recorrido o explorar
   libremente.

Consejos: presenta en una ventana de al menos 1280 px de ancho; el icono de guion en la barra muestra u oculta el
texto; la **X** sale del modo presentación sin perder lo hecho.

## Cómo usar la demo libremente

En la pantalla de entrada eliges un perfil, sin contraseña:

| Perfil | Persona demo | Entra a |
| --- | --- | --- |
| Nuevo Rappitendero | Valentina · 9 días | `/inicio` |
| Copiloto | Andrés · 3 años en Chapinero | `/copiloto` |
| Administrador Rappi | Laura · Operaciones | `/admin` |

- Todo es **MODO DEMO**: personas, historias, protocolos, beneficios y métricas son ficticios. El indicador está
  siempre visible arriba.
- Lo que crees persiste durante la sesión del navegador. **Cambiar perfil** y **Reiniciar demo** están en la
  barra lateral (desktop) o en el menú (mobile).
- `/como-funciona` explica la propuesta dentro de la plataforma, para cualquier perfil.

## Pantallas

| # | Pantalla | Ruta |
| --- | --- | --- |
| 1 | Login / selección de perfil | `/` |
| 2 | Dashboard del nuevo | `/inicio` |
| 3 | Copiloto (perfil, contacto, incidencia, historial) | `/mi-copiloto`, `/mi-copiloto/chat` |
| 4 | Match: Encuentra tu Copiloto | `/mi-copiloto/match` |
| 5 | Necesito una mano | `/necesito-una-mano` |
| 6 | Protocolo Crew (lista y detalle) | `/protocolos`, `/protocolos/p-014` |
| 7 | Pasa la Posta | `/pasa-la-posta` |
| 8 | Beneficios Crew | `/beneficios` |
| 9 | La Voz de la Crew | `/voz-de-la-crew` |
| 10 | Panel y perfil del Copiloto | `/copiloto`, `/copiloto/perfil` |
| 11 | Admin Rappi Crew | `/admin`, `/admin/experiencias`, `/admin/patrones`, `/admin/protocolos`, `/admin/protocolos/[id]` |
| 12 | Analítica (datos DEMO) | `/admin/analitica` |
| — | Cómo funciona | `/como-funciona` |
| — | Modo presentación (portada y cierre) | `/presentacion`, `/presentacion/cierre` |

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Uso | Obligatoria |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | No (sin ella: modo demo local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública del proyecto | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo para `npm run db:seed`. **Nunca** la expongas en el cliente ni en Vercel como `NEXT_PUBLIC_` | No |

## Supabase

La app funciona sin Supabase. Si lo configuras, protocolos, experiencias, casos, patrones y reportes de
incidencia se leen al cargar y se guardan remotamente al crearlos o modificarlos (la sesión local sigue siendo
la fuente de verdad inmediata para que la demo sea fluida).

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta `supabase/schema.sql`. Crea las tablas `crew_protocols`, `crew_experiences`,
   `crew_help_requests`, `crew_clusters` y `crew_incidents` (cada una con `id`, `data jsonb`, `created_at` y
   `updated_at`).
3. En **Project Settings → API**, copia la URL, la anon key y la service role key en `.env.local`.
4. Carga los datos demo: `npm run db:seed`.
5. Reinicia `npm run dev`. En la barra lateral verás **“Conectado a Supabase”**.

> Las políticas RLS de `schema.sql` son **abiertas, solo para demo**: cualquiera con la anon key puede leer y
> escribir. Antes de usar datos reales, cámbialas por políticas basadas en Supabase Auth y roles.

Si la conexión falla, la app muestra un aviso y sigue funcionando con los datos demo.

## Deploy en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Next.js
   automáticamente (build `next build`, sin configuración extra).
3. Opcional: en **Settings → Environment Variables**, agrega `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Haz deploy. Cada push a la rama principal publica una nueva versión.

También puedes usar la CLI: `npx vercel` (preview) y `npx vercel --prod`.

## Estructura

```
src/
  app/
    page.tsx                  Login / selección de perfil
    (crew)/layout.tsx         AppShell: sidebar desktop + bottom nav mobile
    (crew)/inicio …           Pantallas del nuevo Rappitendero
    (crew)/copiloto …         Panel y perfil del Copiloto
    (crew)/admin …            Panel administrativo y analítica
  components/
    ui/                       Primitivas: Button, Card, Badge, Modal, Toast, estados (empty, error, success, skeleton)
    app-shell.tsx             Navegación por rol y RoleGate
    chat-panel.tsx            Chat Copiloto ↔ nuevo
    charts.tsx                Gráficos SVG ligeros con tooltip y vista de tabla
  lib/
    types.ts                  Modelo de dominio
    demo-data.ts              Datos demo (ficticios)
    store.tsx                 Estado global + acciones + persistencia de sesión
    supabase/                 Cliente y repositorio remoto
supabase/schema.sql           Esquema y políticas demo
scripts/seed-supabase.ts      Seed de datos demo
```

## Principios de producto reflejados en la interfaz

- **El Copiloto es voluntario**: puede aceptar, rechazar, pausar o retirarse sin penalización. La regla aparece
  en el match, en el perfil del Copiloto, en su panel y al retirarse.
- **El Copiloto no es supervisor ni soporte oficial**: comparte experiencia práctica. Las soluciones oficiales
  son los Protocolos Crew **validados por Rappi**.
- **Reconocimiento no monetario**: insignias e historias en La Voz de la Crew, sin premios económicos.
- **Beneficios conceptuales** sin marcas reales, “sujetos a disponibilidad y acuerdos con aliados”.
- **Analítica marcada como DEMO** en cada indicador.
