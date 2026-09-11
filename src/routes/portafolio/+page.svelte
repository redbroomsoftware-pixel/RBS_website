<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { _, locale } from 'svelte-i18n';
	import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
	import { listarEscenas, listarRecorridos } from '@r-bsoftware/scene-registry';

	/* S650 — el `as const` del final congela CADA elemento con sus campos exactos, así que los
	   productos que no traen `agentBadgeKey` no lo tienen ni como opcional y la plantilla
	   (`{#if product.agentBadgeKey}`) fallaba. Un `@type` encima no puede ganarle al `as
	   const`; se declara el campo opcional en el propio elemento que lo necesita, que es donde
	   el tipo se forma. */
	/**
	 * S755 — el catálogo sale del REGISTRO, no de una lista a mano.
	 *
	 * Aquí vivían 16 productos escritos a mano (+5 B2C) mientras el canon eran 25, y dos de ellos
	 * seguían publicando `la-hoja`, un slug RETIRADO en PD-044/S205. Era una de las cuatro listas
	 * rivales del ecosistema; ésta muere aquí.
	 *
	 * El dato es el mismo que consume el catálogo cinemático de Patadas: una sola fuente, dos
	 * consumidores. Los textos del registro ya son bilingües, así que no pasan por i18n.
	 */
	/**
	 * S776 — El badge del hero CUENTA estas dos listas; no lleva cifra escrita a mano.
	 *
	 * S755 mató la lista de 16 productos (ver comentario de arriba) pero dejó vivo un
	 * `portfolio.hero.badge` que seguía diciendo «16 plataformas + 5 servicios B2C» mientras la
	 * página servía 25 tarjetas — medido contra el HTML de producción. La lista se migró al
	 * registro y su CONTEO se quedó atrás: prosa que se pudre al lado del dato que la desmiente
	 * (Principle #24). Interpolar el conteo hace que la corrección sea imposible de olvidar.
	 */
	const escenas = listarEscenas();
	const recorridos = listarRecorridos();

	/** Los filtros son los SECTORES del registro: la misma agrupación que ve el visitante en Patadas. */
	const sectoresDe = (slug: string) =>
		recorridos.filter((r) => r.protagonista === slug || r.acompanantes.includes(slug)).map((r) => r.sector);

	const sectores = recorridos.map((r) => r.sector).filter((x) => x !== 'generico');

	const etiquetaSector: Record<string, { es: string; en: string }> = {
		restaurante: { es: 'Restaurantes', en: 'Restaurants' },
		hospedaje: { es: 'Hospedaje', en: 'Hospitality' },
		'salud-y-cuidado': { es: 'Salud y cuidado', en: 'Health & care' },
		despacho: { es: 'Despachos', en: 'Practices' },
		'comercio-y-logistica': { es: 'Comercio y logística', en: 'Retail & logistics' },
		educacion: { es: 'Educación', en: 'Education' },
		comunidad: { es: 'Comunidad', en: 'Community' }
	};

	const b2cServiceKeys = [
		{ key: 'constanza', icon: '📊', status: 'live', url: 'https://constanza.redbroomsoftware.com/servicios' },
		{ key: 'camino', icon: '📣', status: 'live', url: 'https://camino.redbroomsoftware.com/servicios' },
		// S776 — era `/servicios`, que da 404 (medido con control: una ruta inventada da lo mismo,
		// y la raíz da 200). Un enlace muerto en el portafolio pierde al visitante que sí quería entrar.
		{ key: 'colectiva', icon: '💳', status: 'live', url: 'https://colectiva.redbroomsoftware.com' },
		{ key: 'aiSupport', icon: '🤖', status: 'live', url: 'https://camino.redbroomsoftware.com' },
		{ key: 'mancha', icon: '📅', status: 'live', url: 'https://mancha.redbroomsoftware.com' }
	] as const;


	const highlightIndices = [0, 1, 2, 3];

	let activeCategory = $state('');

	const escenasVisibles = $derived(
		activeCategory ? escenas.filter((e) => sectoresDe(e.slug).includes(activeCategory as never)) : escenas
	);
	const idioma = $derived($locale === 'en' ? 'en' : 'es');
</script>

<svelte:head>
	<title>{$_('portfolio.meta.title')}</title>
	<meta name="description" content={$_('portfolio.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<link rel="canonical" href="https://redbroomsoftware.com/portafolio" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/portafolio" />
	<meta property="og:title" content={$_('portfolio.meta.title')} />
	<meta property="og:description" content={$_('portfolio.meta.description')} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section class="py-20 px-4 sm:px-6 lg:px-8 relative">
	<div class="max-w-7xl mx-auto text-center relative">
		<div class="inline-flex items-center px-4 py-2 glass rounded-full text-sm text-gray-600 mb-6">
			<span class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
			{$_("portfolio.hero.badge", { values: { plataformas: escenas.length, b2c: b2cServiceKeys.length } })}
		</div>
		<h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
			{$_("portfolio.hero.titlePart1")} <span class="text-gray-500">{$_("portfolio.hero.titleHighlight")}</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			{$_("portfolio.hero.subtitle")}
		</p>
	</div>
</section>

<!-- Filtros por sector — del registro, no de una lista a mano -->
<section class="px-4 sm:px-6 lg:px-8 pb-8">
	<div class="max-w-7xl mx-auto">
		<div class="flex flex-wrap gap-2 justify-center">
			<button
				onclick={() => (activeCategory = '')}
				class="px-4 py-2 rounded-full text-sm font-medium transition-all
					{activeCategory === '' ? 'bg-black text-white border border-black' : 'glass text-gray-600 hover:text-gray-900'}"
			>
				{idioma === 'en' ? 'All' : 'Todas'}
			</button>
			{#each sectores as sector}
				<button
					onclick={() => (activeCategory = sector)}
					class="px-4 py-2 rounded-full text-sm font-medium transition-all
						{activeCategory === sector ? 'bg-black text-white border border-black' : 'glass text-gray-600 hover:text-gray-900'}"
				>
					{etiquetaSector[sector]?.[idioma] ?? sector}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Las escenas — una por app, reveladas al hacer scroll (S755) -->
<section class="py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		{#each escenasVisibles as escena, i (escena.slug)}
			<article class="escena" data-slug={escena.slug}>
				<div class="lienzo">
					{#if escena.asset.tipo === 'captura'}
						<img src={escena.asset.url} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" width="1280" height="800" />
					{:else}
						<div class="degradado" style="--from:{escena.asset.from};--to:{escena.asset.to}" aria-hidden="true"></div>
					{/if}
				</div>
				<div>
					<h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
						{escena.escena.titular[idioma]}
					</h3>
					<p class="text-gray-600 text-lg mb-5 leading-relaxed">{escena.escena.frase[idioma]}</p>
					<a
						href={escena.destino}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center text-gray-900 hover:text-gray-600 text-sm font-medium transition-colors"
					>
						{$_('portfolio.products.visitProduct')}
						<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
						</svg>
					</a>
				</div>
			</article>
		{/each}
	</div>
</section>

<!-- B2C Services -->
<section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-12" use:scrollReveal>
			<div class="inline-flex items-center px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 mb-6">
				{$_("portfolio.b2cServices.new")}
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				{$_("portfolio.b2cServices.title").split(" ")[0]} <span class="text-gray-500">B2C</span>
			</h2>
			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				{$_("portfolio.b2cServices.subtitle")}
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#each b2cServiceKeys as service, i}
				<article
					use:scrollReveal={{ delay: i * 100 }}
					class="glass rounded-2xl p-6 hover:border-gray-900 transition-all hover:shadow-md group"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
								{service.icon}
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">{$_(`portfolio.b2cServices.${service.key}.name`)}</h3>
								<p class="text-sm text-gray-500">{$_(`portfolio.b2cServices.${service.key}.subtitle`)}</p>
							</div>
						</div>
						{#if service.status === 'live'}
							<span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
								{$_('portfolio.b2cServices.active')}
							</span>
						{:else}
							<span class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
								{$_('portfolio.b2cServices.comingSoon')}
							</span>
						{/if}
					</div>

					<p class="text-gray-600 text-sm mb-4">{$_(`portfolio.b2cServices.${service.key}.description`)}</p>

					<ul class="grid grid-cols-2 gap-2 mb-4">
						{#each highlightIndices as idx}
							<li class="flex items-center text-sm text-gray-700">
								<svg class="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								{$_(`portfolio.b2cServices.${service.key}.highlights.${idx}`)}
							</li>
						{/each}
					</ul>

					{#if service.status === 'live'}
						<a href={service.url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-gray-900 hover:text-gray-600 text-sm font-medium transition-colors">
							{$_('portfolio.b2cServices.learnMore')}
							<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
							</svg>
						</a>
					{:else}
						<span class="inline-flex items-center text-gray-400 text-sm">{$_("portfolio.b2cServices.availableSoon")}</span>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Stats -->
<section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-center" use:scrollReveal>
			<div>
				<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={escenas.length} /></p>
				<p class="text-gray-500">{$_("portfolio.stats.saasProducts")}</p>
			</div>
			<div>
				<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={5} /></p>
				<p class="text-gray-500">{$_("portfolio.stats.b2cServices")}</p>
			</div>
			<div>
				<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={10} suffix="+" /></p>
				<p class="text-gray-500">{$_("portfolio.stats.industries")}</p>
			</div>
			<div>
				<p class="text-4xl font-bold text-gray-900">99.9%</p>
				<p class="text-gray-500">{$_("portfolio.stats.uptime")}</p>
			</div>
			<div>
				<p class="text-4xl font-bold text-gray-900">24/7</p>
				<p class="text-gray-500">{$_("portfolio.stats.support")}</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto text-center" use:scrollReveal>
		<h3 class="text-3xl font-bold text-gray-900 mb-4">{$_("portfolio.cta.title")}</h3>
		<p class="text-gray-600 mb-8">{$_("portfolio.cta.subtitle")}</p>
		<a href="/contacto" class="inline-flex px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold hover:-translate-y-0.5">
			{$_('portfolio.cta.button')}
		</a>
	</div>
</section>

<Footer />

<style>
	/* La animación REVELA lo que ya está en el DOM. Estado base VISIBLE dentro de un @supports:
	   al revés —ocultar por defecto y mostrar al animar— un navegador sin `animation-timeline`
	   serviría una página en blanco, que es el modo de fallo clásico de esta técnica. Y nunca
	   `opacity: 0` como base: esconde a la vista, no al dedo ni al lector de pantalla (#130). */
	.escena {
		display: grid;
		gap: 1.5rem;
		align-items: center;
		padding: 3.5rem 0;
		opacity: 1;
	}

	@media (min-width: 64rem) {
		.escena {
			grid-template-columns: 1.15fr 1fr;
			gap: 3rem;
			padding: 5rem 0;
		}
		.escena:nth-child(even) .lienzo {
			order: 2;
		}
	}

	.lienzo {
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 1rem 2.5rem -0.75rem rgb(0 0 0 / 0.18);
	}

	.lienzo :global(img) {
		width: 100%;
		height: auto;
		display: block;
	}

	.degradado {
		aspect-ratio: 16 / 10;
		background: linear-gradient(140deg, var(--from), var(--to));
	}

	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.escena {
				animation: entrar linear both;
				animation-timeline: view();
				animation-range: entry 5% cover 32%;
			}
			@keyframes entrar {
				from {
					opacity: 0.35;
					transform: translateY(2rem) scale(0.99);
				}
				to {
					opacity: 1;
					transform: none;
				}
			}
		}
	}
</style>
