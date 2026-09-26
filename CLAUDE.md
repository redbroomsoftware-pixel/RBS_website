# Workflow Orchestration

## 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

## 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

## 3. Self-Improvement Loop
- After ANY correction from the user: update tasks/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

## 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

## 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

## 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
- **Plan First**: Write plan to tasks/todo.md with checkable items
- **Verify Plan**: Check in before starting implementation
- **Track Progress**: Mark items complete as you go
- **Explain Changes**: High-level summary at each step
- **Document Results**: Add review section to tasks/todo.md
- **Capture Lessons**: Update tasks/lessons.md after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

# RBS Website — Claude Working Instructions

## Purpose
Corporate marketing website for Red Broom Software S.A.S. Showcases the ecosystem to potential customers.
- **URL**: `redbroomsoftware.com`

> ⚠️ **Los conteos NO se escriben en prosa — ni aquí ni en el copy.** Las apps del ecosistema salen de
> `src/lib/ecosystem-stats.json` (derivado del canon `apps.json`, hoy `appCount: 25`, usado por
> `/` para el hero, el JSON-LD y las stats — verificado S827, sin literales sueltos). El portafolio
> público (`/portafolio`) ya NO usa una lista a mano: desde S755 sale de
> `listarEscenas()`/`listarRecorridos()` de `@r-bsoftware/scene-registry` (25 escenas medidas S827,
> `node --input-type=module -e "import{listarEscenas}from '@r-bsoftware/scene-registry';console.log(listarEscenas().length)"`)
> más `b2cServiceKeys` (5) declarado en
> [`src/routes/portafolio/+page.svelte`](src/routes/portafolio/+page.svelte); el badge del hero
> (S776) interpola ambos conteos, nunca los escribe. **La sección "Portfolio" de abajo describía
> `productKeys` — un identificador que S755 borró — y una lista de 18 productos a mano que ya no
> corresponde a ningún dato real (corregido S827, ver esa sección).**

## Decision Boundaries

### Act freely (no approval needed)
- UI components, client-side logic, styling
- Bug fixes (single or multi-file)
- Read AND write queries (Supabase SELECT, INSERT, UPDATE, DELETE)
- New Supabase tables or columns (migrations)
- New API routes and endpoints
- New dependencies
- Changes to AI prompts or matching algorithms
- Refactoring and code cleanup
- Error handling improvements
- Performance optimizations
- Security hardening (headers, validation, sanitization)
- Git commits to main
- Git push to main
- Deploying to Vercel
- Adding/updating environment variables
- Creating new services, utilities, or helpers
- Updating CLAUDE.md and documentation
- Running builds, tests, and verifications

### Confirm before acting (present plan, then proceed if sensible)
- Supabase RLS policy changes
- Webhook secret changes or additions
- Database migrations that DROP or ALTER existing columns
- Removing existing API routes

### NEVER act autonomously — always wait for explicit approval
- Commission rate or pricing changes
- Payment/escrow flow changes (money movement logic)
- Deleting production data
- Changing auth providers or SSO configuration
## Tech Stack
- **Framework**: SvelteKit 2 with Svelte 5 runes ($state, $derived, $effect, $props)
- **UI**: Tailwind CSS 3.3 + custom animations (fadeInUp, float, glow, marquee, countUp)
- **Fonts**: Inter Variable (@fontsource-variable/inter)
- **Deployment**: Vercel (SSR via adapter-vercel, Node.js 24.x — CI se alineó en `f5378c1`)
- **i18n**: svelte-i18n (561 keys ES/EN — `jq` recursivo sobre `src/lib/i18n/locales/{es,en}.json`,
  0 huecos entre idiomas —, fully wired — all 8 pages + 5 components use $_())
- **Error Tracking**: Sentry (@sentry/sveltekit)

> ✅ **"~522 cadenas sin tilde" (raíz, S709) ya NO describe este repo — medido, no descartado de
> oído (S827).** `node ecosystem-sdk/scripts/lint-es-accents.mjs src/lib/i18n/locales` sobre
> `es.json` de cara al usuario da **2** hallazgos reales, no ~522 — ambos corregidos S827:
> `portfolio.b2cServices.subtitle` ("Ademas"→"Además") y `privacy.section3.primary[0]`
> ("Provision"→"Provisión", este último fuera del diccionario del canario — hallado a mano
> auditando cada `...sion(es)?\b` sin acentuar en el archivo). El resto de coincidencias del
> canario en `.svelte`/`.ts` (`Footer.svelte`, `tecnologia/+page.svelte`,
> `plataformas/+page.server.ts`, `terms/+page.server.ts`) son **falsos positivos**: caen sobre
> rutas (`/tecnologia`, `/terminos`) o el parámetro de API `region` — identificadores, no texto
> de cara al usuario, y esta tarea tenía instrucción explícita de no tocarlos. El propio canario
> también da un falso positivo verificado (`\b` de JS no trata una vocal acentuada como carácter
> de palabra, así que "Envíanos" — ya correcto — parece contener "anos"); se descartó a mano, no
> con `--fix`.

## Portfolio (25 plataformas del registro + 5 servicios B2C — corregido S827)

> 🔴 **Esta sección decía "16 productos + 5 servicios B2C" y listaba 18 productos escritos a
> mano citando `productKeys`.** Las tres cifras eran falsas a la vez y ninguna corresponde al
> código actual: `productKeys` fue **borrado en S755** (comentario `src/routes/portafolio/
> +page.svelte:14-21`) precisamente porque esa lista de 16 (+5 B2C) vivía a mano mientras el
> canon ya tenía 25, y dos de sus entradas seguían publicando `la-hoja`, un slug retirado en
> PD-044/S205. Hoy `/portafolio` no tiene una lista de productos en este repo: renderiza
> `listarEscenas()` de `@r-bsoftware/scene-registry` — **25 escenas medidas S827** (`camino,
> colectiva, constanza, caracol, mancha, hoja, goodbay, garita, cosmos-pet, madriguera,
> puppy-love, plenura, agora, comal, baul, agente, escuela, bee, continua, servilleta, patadas,
> hub, rito, kiina, cookie-monster`) — más `b2cServiceKeys` (5, sin cambios: constanza, camino,
> colectiva, aiSupport/camino, mancha), declarado inline en
> [`src/routes/portafolio/+page.svelte`](src/routes/portafolio/+page.svelte). El catálogo de
> las 25 vive en el paquete `scene-registry`, no en este repo — no se copia aquí para no crear
> una sexta lista rival (Principle: "los conteos NO se escriben en prosa").

## Components
Se citan con su ruta para que el canario pueda verificarlas
(`node ~/Projects/ecosystem-sdk/scripts/audit-claude-md-citas.mjs RBS_website`).

| Componente | Uso |
|-----------|---------|
| `src/lib/components/Footer.svelte` | Enlaces, tira del ecosistema, GitHub — 9 importadores |
| `src/lib/components/TypewriterText.svelte` | Texto cíclico del hero |
| `src/lib/components/AnimatedCounter.svelte` | Cuenta ascendente al entrar en pantalla |
| `src/lib/components/EcosystemDiagram.svelte` | Órbita con haces animados (S709) |

> 🗑️ **Retirados en S709**: `Header.svelte` (99 L), `ChatWidget.svelte` (279 L) y
> `LanguageSwitcher.svelte` (19 L) — 397 líneas con **cero importadores**, que esta tabla
> listaba como vivas. La cabecera real es `SiteHeader` de `@r-bsoftware/palacio-ui`, montada
> en [`src/routes/+layout.svelte`](src/routes/+layout.svelte); `LanguageSwitcher` sólo lo
> importaba el `Header` muerto y arrastraba el mismo defecto de locale corregido en
> `/plataformas` — invisible justamente porque no se renderizaba, y casi se "arregla" antes
> de censar importadores. Verificado por tres vías antes de borrar: sin importadores
> estáticos, sin `import()` dinámico, y **ausentes del bundle construido**.
> Si vuelve a hacer falta un widget de chat, está en el historial.

## Custom Actions
- `src/lib/actions/scrollReveal.ts` — IntersectionObserver para las entradas al hacer scroll
- `src/lib/actions/spotlight.ts` — foco que sigue al cursor (escribe `--fx`/`--fy`; el
  resplandor lo pinta `.foco::before` en `src/app.css`)

## Routes (8 pages — NINGUNA prerenderizada)

> ⚠️ Corregido S796e: esta tabla decía «Prerendered» en 7 de 8 filas y la sección de patrones
> afirmaba «All pages statically prerendered via `+layout.js`». Es **falso y lo era desde que
> `+layout.js:4` dice `export const prerender = false`**: el build **no genera**
> `.svelte-kit/output/prerendered/` (medido contra el artefacto, no leído del código). Todo se
> sirve por SSR en Vercel. Importa porque de ahí se deduce si una ruta puede llevar `+server.ts`
> o leer cabeceras — y con la doc vieja se deduce al revés.

| Route | Purpose | Rendering |
|-------|---------|-----------|
| `/` | Hero, stats, capabilities, products grid | SSR |
| `/plataformas` | Camino-powered platforms showcase | SSR (fetches from Camino content API) |
| `/portafolio` | 25 plataformas del registro + 5 servicios B2C | SSR |
| `/servicios` | Service offerings | SSR |
| `/tecnologia` | Tech stack showcase | SSR |
| `/contacto` | Contact form → Camino CRM | SSR |
| `/privacidad` | Privacy policy | SSR |
| `/terminos` | Terms of service | SSR |

## Key Patterns
- Contact form submits to Camino CRM API with UTM tracking
- Ninguna página se prerenderiza: `src/routes/+layout.js:4` fija `prerender = false` (SSR en Vercel)
- Glassmorphism with backdrop-blur effects
- Design: dark slate backgrounds, blue→purple gradients

## Deployment
- Vercel (project: `rbs-website`, adapter-vercel)
- Custom domain: `redbroomsoftware.com` (A record → 76.76.21.21)
- Deploy: **automático** — `rbs-website` tiene git conectado en Vercel, así que un `git push origin
  master` **ES** un deploy a producción (verificado S709: push → prod sirviendo en ~75 s). La disciplina
  de pre-deploy (compuertas verdes + rollback identificado + anuncio en lc) aplica al **push**, no a un
  comando aparte. Estado por proyecto: `~/.claude/deploy-log/deploy-modes.json`, nunca en prosa.

## Camino Integration
- `/plataformas` fetches content from `camino.redbroomsoftware.com/api/public/page/plataformas` (SSR)
- Personalization rules in Camino swap hero content based on UTM campaign
- Tracking SDK (`camino-track.js`) embedded in `app.html` — tracks page views, scroll, CTA clicks
- Falls back to static defaults if Camino API unavailable

## Build & Dev
```bash
npm run dev       # Local dev server
npm run build     # Production build
npm run preview   # Preview
```

## Known Gaps
- Platform product descriptions on /plataformas use hardcoded Spanish fallbacks (sourced from Camino API when available)
