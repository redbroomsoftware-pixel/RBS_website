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
> `src/lib/ecosystem-stats.json` (derivado del canon `apps.json`); el portafolio público sale de
> `productKeys` / `b2cServiceKeys` en [`src/routes/portafolio/+page.svelte`](src/routes/portafolio/+page.svelte).
> Esta sección decía "18-product" mientras la página listaba 16+5 y el canon 25, y el hero anunciaba
> "22 Aplicaciones" bajo un título que decía 25 — con el JSON-LD que Google indexa afirmando "22-app"
> (corregido S709: contador y schema ahora derivan de `appCount`).

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
- **Deployment**: Vercel (SSR via adapter-vercel, Node.js 22.x)
- **i18n**: svelte-i18n (580 keys ES/EN, fully wired — all 8 pages + 5 components use $_())
- **Error Tracking**: Sentry (@sentry/sveltekit)

## Portfolio (16 productos + 5 servicios B2C — verificado S709 contra `productKeys`/`b2cServiceKeys`)
1. Caracol — Restaurant POS
2. La Hoja — ERP for Restaurants
3. Cosmos Pet — Veterinary SaaS
4. Camino — CRM + AI Agents
5. Colectiva — B2B Payments + Capital
6. Constanza — Accounting
7. Comal — E-commerce SaaS
8. Plenura — Wellness Platform
9. Rito — Real Estate PE
10. Agora — Legal Tech
11. Goodbay — Farewell Marketplace
12. Mancha — Restaurant Reservations
13. Cookie Monster — Bakery E-commerce
14. Continua — Blood Donation
15. Puppy Love — Pet Matching
16. Baul — Storage Marketplace
17. Servilleta — Task Marketplace
18. Hospitality Fiscal — Vacation Rentals

## Components
Se citan con su ruta para que el canario pueda verificarlas
(`node ~/Projects/ecosystem-sdk/scripts/audit-claude-md-citas.mjs RBS_website`).

| Componente | Uso |
|-----------|---------|
| `src/lib/components/Footer.svelte` | Enlaces, tira del ecosistema, GitHub — 9 importadores |
| `src/lib/components/TypewriterText.svelte` | Texto cíclico del hero |
| `src/lib/components/AnimatedCounter.svelte` | Cuenta ascendente al entrar en pantalla |
| `src/lib/components/EcosystemDiagram.svelte` | Órbita con haces animados (S709) |

> ⚠️ **Muerto, conservado a propósito de momento** (S709): `src/lib/components/Header.svelte`
> y `src/lib/components/ChatWidget.svelte` tienen **cero importadores** — la cabecera real es
> `SiteHeader` de `@r-bsoftware/palacio-ui`, montada en `src/routes/+layout.svelte`.
> `src/lib/components/LanguageSwitcher.svelte` sólo lo importa ese `Header` muerto, y arrastra
> el mismo defecto de locale que se corrigió en `/plataformas` — invisible justamente porque
> no se renderiza. Esta tabla los listaba como vivos: documentación de un cadáver.
> Decidir ship/borrar, no dejarlos pudrirse.

## Custom Actions
- `src/lib/actions/scrollReveal.ts` — IntersectionObserver para las entradas al hacer scroll
- `src/lib/actions/spotlight.ts` — foco que sigue al cursor (escribe `--fx`/`--fy`; el
  resplandor lo pinta `.foco::before` en `src/app.css`)

## Routes (8 pages, most prerendered)
| Route | Purpose | Rendering |
|-------|---------|-----------|
| `/` | Hero, stats, capabilities, products grid | Prerendered |
| `/plataformas` | Camino-powered platforms showcase | SSR (fetches from Camino content API) |
| `/portafolio` | 16 productos + 5 servicios B2C | Prerendered |
| `/servicios` | Service offerings | Prerendered |
| `/tecnologia` | Tech stack showcase | Prerendered |
| `/contacto` | Contact form → Camino CRM | Prerendered |
| `/privacidad` | Privacy policy | Prerendered |
| `/terminos` | Terms of service | Prerendered |

## Key Patterns
- Contact form submits to Camino CRM API with UTM tracking
- All pages statically prerendered via `+layout.js`
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
