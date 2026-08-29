<script>
	import { _, locale } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';

	/**
	 * S650 — `data` llega de una API externa (el CMS de Camino) y su forma NO la fija este
	 * repo. Intenté enumerarla y cada intento la estrechó mal: 11 → 17 → 21 errores, porque
	 * cada campo que olvidaba se convertía en uno nuevo. **Un tipo exacto sobre una carga
	 * ajena es una promesa que nadie verifica**, y este archivo es una página de marketing,
	 * no un camino de datos. Se anota permisivo y se dice por qué.
	 * @type {{ data: any }}
	 */
	let { data } = $props();

	/**
	 * S650 — acción de Svelte sin tipos en un archivo JS: `svelte-check` comprueba también el
	 * JS de este proyecto, así que `node` era `any` implícito y `params` un `{}` sin campos —
	 * 12 de los 14 errores del CI salían de aquí. Se anota con JSDoc en vez de convertir el
	 * archivo a TypeScript: el tipado llega igual y el cambio no toca el resto del componente.
	 * @param {HTMLElement} node
	 * @param {{ delay?: number, threshold?: number }} [params]
	 */
	function scrollReveal(node, params = {}) {
		const { delay = 0, threshold = 0.15 } = params;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => node.classList.add('visible'), delay);
						observer.unobserve(node);
					}
				});
			},
			{ threshold }
		);
		observer.observe(node);
		return { destroy() { observer.disconnect(); } };
	}

	// Extract content blocks from Camino API response, or use defaults
	const content = data.content?.page?.content || [];

	/** @param {string} id */
	function getBlock(id) {
		return content.find((/** @type {any} */ b) => b.id === id)?.data;
	}

	// Defaults for when Camino API is unavailable
	const heroData = $derived(getBlock('hero-main') || {
		title: $_('plataformas.hero.title'),
		title_highlight: $_('plataformas.hero.titleHighlight'),
		subtitle: $_('plataformas.hero.subtitle'),
		cta_primary: { text: $_('plataformas.hero.ctaPrimary'), href: '#plataformas' },
		cta_secondary: { text: $_('plataformas.hero.ctaSecondary'), href: '/contacto' }
	});

	const bannerData = $derived(getBlock('bundle-discount') || {
		title: $_('plataformas.bundle.title'),
		subtitle: $_('plataformas.bundle.subtitle'),
		description: $_('plataformas.bundle.description'),
		items: [
			{ label: $_('plataformas.bundle.apps2'), value: '5%' },
			{ label: $_('plataformas.bundle.apps3'), value: '10%' },
			{ label: $_('plataformas.bundle.apps4'), value: '15%' }
		]
	});

	const gridData = $derived(getBlock('plataformas-grid') || {
		title: $_('plataformas.grid.title'),
		subtitle: $_('plataformas.grid.subtitle'),
		platforms: defaultPlatforms()
	});

	const ctaData = $derived(getBlock('enterprise-cta') || {
		title: $_('plataformas.enterprise.title'),
		subtitle: $_('plataformas.enterprise.subtitle'),
		cta_primary: { text: $_('plataformas.enterprise.ctaPrimary'), href: '/contacto' },
		cta_secondary: { text: $_('plataformas.enterprise.ctaSecondary'), href: 'https://camino.redbroomsoftware.com/register?utm_source=rbs_website&utm_medium=plataformas_enterprise' }
	});

	// ─── Dynamic Pricing ────────────────────────────────────────────────────────
	// Map platform display IDs to Camino pricing API app IDs
	const PRICING_APP_MAP = {
		'caracol': 'caracol',
		'comal': 'comal',
		'constanza': 'constanza',
		'plenura': 'plenura',
		'rito': 'rito',
		'agora': 'agora',
		'la-hoja': 'la-hoja',
		'mancha': 'mancha',
		'cosmos-pet': 'cosmos_pet',
		'garita': 'garita',
		'patadas': 'patadas',
		'goodbay': 'goodbay',
		'cookie-monster': 'cookie-monster',
		'puppy-love': 'puppy-love',
		'baul': 'baul',
		'continua': 'continua',
		'colectiva': 'colectiva'
	};

	const pricingData = data.pricing;
	const currency = data.currency || 'MXN';
	/* Dos defectos apilados, y el segundo sólo se ve al quitar el primero (S709).

	   1. Era `const isEs = $locale === 'es'` — una asignación suelta, que se evalúa
	      UNA vez al inicializar el componente y no vuelve a recalcularse. El resto
	      del archivo ya usaba $derived en sus otros cuatro cómputos; a éste se le
	      escapó.
	   2. Puesto en $derived, SEGUÍA sirviendo inglés: `=== 'es'` sólo acierta si el
	      navegador reporta exactamente 'es', y casi ninguno lo hace — el de prueba
	      reporta `es-419`, y un usuario mexicano reporta `es-MX`. svelte-i18n resuelve
	      igual las traducciones (hace fallback de es-419 a es), así que TODO el resto
	      de la página salía en castellano y sólo estos dos textos caían al inglés:
	      "Not sure which one you need?" y "Get free recommendation →".

	   Por eso se compara por PREFIJO de idioma y no por igualdad: cualquier variante
	   regional de español entra por la puerta correcta, y sólo el inglés explícito
	   ('en', 'en-US', 'en-GB') sale por la otra. */
	const isEs = $derived(!String($locale ?? 'es').toLowerCase().startsWith('en'));

	/**
	 * Format a price amount using Intl.NumberFormat based on currency.
	 */
	/** @param {number} amount @param {string} [curr] */
	function formatPrice(amount, curr = currency) {
		const loc = curr === 'MXN' ? 'es-MX' : curr === 'EUR' ? 'de-DE' : 'en-US';
		return new Intl.NumberFormat(loc, {
			style: 'currency',
			currency: curr,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	/**
	 * Derive a display pricing string from the Camino pricing API response for an app.
	 * Returns the lowest non-free tier's price formatted as "Desde $X/mes" or "From $X/mo".
	 * Falls back to the hardcoded default if pricing data is unavailable.
	 */
	/** @param {string} platformId @param {any} fallback */
	function getDynamicPricing(platformId, fallback) {
		const appId = /** @type {Record<string, string>} */ (PRICING_APP_MAP)[platformId];
		if (!appId || !pricingData?.[appId]) return fallback;

		const appPricing = pricingData[appId];
		const tiers = appPricing.tiers || [];

		// Find the lowest non-free, non-custom tier price
		const paidTiers = tiers.filter((/** @type {any} */ t) => t.price > 0 && !t.custom_pricing);

		if (paidTiers.length === 0) {
			// All tiers are free or custom — check for per-cover model
			const coverTier = tiers.find((/** @type {any} */ t) => t.per_cover_rate && t.per_cover_rate > 0);
			if (coverTier) {
				const formatted = formatPrice(coverTier.per_cover_rate, appPricing.currency);
				return isEs ? `Desde ${formatted}/cubierto` : `From ${formatted}/cover`;
			}
			return fallback;
		}

		const lowestPrice = Math.min(...paidTiers.map((/** @type {any} */ t) => t.price));
		const formatted = formatPrice(lowestPrice, appPricing.currency);

		// Per-user pricing with implementation fee (e.g. caracol)
		if (appPricing.pricing_model === 'per_user_plus_implementation') {
			const perUser = appPricing.subscription_info?.per_user_price;
			if (perUser) {
				const perUserFormatted = formatPrice(perUser, appPricing.currency);
				return isEs ? `${perUserFormatted}/usuario/mes` : `${perUserFormatted}/user/mo`;
			}
		}

		// Per-user pricing model
		if (appPricing.pricing_model === 'subscription' || appPricing.pricing_model === 'per_user_subscription') {
			const lowestTier = paidTiers.find((/** @type {any} */ t) => t.price === lowestPrice);
			// Standard tiers with per-user pricing
			if (lowestTier) {
				return isEs ? `${formatted}/usuario/mes` : `${formatted}/user/mo`;
			}
		}

		return isEs ? `Desde ${formatted}/mes` : `From ${formatted}/mo`;
	}

	// TODO: Fallback platform content is hardcoded in Spanish. When Camino API is
	// unavailable, visitors see Spanish regardless of locale. Restructuring this to
	// use i18n keys is planned but too complex for this pass — requires reworking
	// the Camino content merge logic.
	function defaultPlatforms() {
		return [
			{ id: 'caracol', name: 'Caracol POS', tagline: 'Punto de venta para restaurantes y bares', pricing: getDynamicPricing('caracol', '$425/usuario/mes'), features: ['CFDI 4.0 en punto de venta', 'Control de inventario y añadas', 'Modo mostrador rápido'], color: 'amber', cta_href: 'https://camino.redbroomsoftware.com/register?app=caracol&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'comal', name: 'Comal', tagline: 'Tu tienda en línea — en pesos, con facturación', pricing: getDynamicPricing('comal', 'Desde $399/mes'), features: ['Vs Shopify: $399 vs $600+ MXN', 'Clubs de suscripción incluidos', 'CFDI automático por venta'], color: 'rose', cta_href: 'https://camino.redbroomsoftware.com/register?app=comal&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'constanza', name: 'Constanza', tagline: 'Facturación CFDI y contabilidad fiscal', pricing: getDynamicPricing('constanza', 'Desde $590/mes'), features: ['Timbrado CFDI con clasificación IA', 'Conciliación bancaria automática', 'RESICO Guardian (optimizador fiscal)'], color: 'purple', cta_href: 'https://camino.redbroomsoftware.com/register?app=constanza&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'plenura', name: 'Plenura', tagline: 'Marketplace de bienestar y terapia', pricing: getDynamicPricing('plenura', 'Desde $299/mes + comisión'), features: ['Escrow protege a ambas partes', '5 herramientas de IA clínica', 'Video sesiones integradas'], color: 'teal', cta_href: 'https://camino.redbroomsoftware.com/register?app=plenura&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'rito', name: 'Rito', tagline: 'Capital privado inmobiliario', pricing: getDynamicPricing('rito', 'Desde $2,499/mes'), features: ['AI Copilot para análisis de deals', 'Portal LP con capital calls', 'Cumplimiento fiscal mexicano nativo'], color: 'indigo', cta_href: 'https://camino.redbroomsoftware.com/register?app=rito&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'agora', name: 'Agora', tagline: 'Gestión de despachos jurídicos', pricing: getDynamicPricing('agora', 'Próximamente'), features: ['IOLTA trust accounting', 'Redacción IA con plantillas MX', 'Ghost timer para tiempo facturable'], color: 'sky', cta_href: 'https://camino.redbroomsoftware.com/register?app=agora&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'la-hoja', name: 'La Hoja', tagline: 'ERP para cafeterías y panaderías', pricing: 'Desde $499/mes', features: ['Inventario FIFO para perecederos', 'Gestión multi-sucursal', 'Reportes operativos en tiempo real'], color: 'lime', cta_href: 'https://camino.redbroomsoftware.com/register?app=la-hoja&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'mancha', name: 'Mancha', tagline: 'Reservaciones para restaurantes', pricing: getDynamicPricing('mancha', 'Desde $12/cubierto'), features: ['Integración nativa con Caracol POS', 'Booking por WhatsApp con IA', 'Pricing dinámico por demanda'], color: 'orange', cta_href: 'https://camino.redbroomsoftware.com/register?app=mancha&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'cosmos-pet', name: 'Cosmos Pet', tagline: 'Gestión de clínicas veterinarias', pricing: getDynamicPricing('cosmos-pet', 'Desde $599/mes'), features: ['Expediente clínico digital', 'Inventario veterinario', 'Facturación CFDI integrada'], color: 'cyan', cta_href: 'https://camino.redbroomsoftware.com/register?app=cosmos-pet&utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'garita', name: 'Garita', tagline: 'Control de acceso y amenidades para propiedades', pricing: getDynamicPricing('garita', 'Desde $1,500/mes'), features: ['Control de acceso inteligente', '8 verticales: residencial, gym, spa, club, coworking', 'Portal de residente y reservaciones'], color: 'emerald', cta_href: 'https://garita.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'patadas', name: 'Patadas', tagline: 'Marketplace de IA — conecta con soluciones o desarrolladores', pricing: getDynamicPricing('patadas', 'Desde $49/mes + comisión'), features: ['Matching inteligente con IA', 'Escrow protege ambas partes', 'Verificación de desarrolladores'], color: 'violet', cta_href: 'https://patadas.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'goodbay', name: 'Goodbay', tagline: 'Gestión de rentas vacacionales y hospitalidad', pricing: getDynamicPricing('goodbay', 'Desde $199/mes'), features: ['Listings de propiedades', 'Gestión de limpieza con verificación', 'Wallet con monedas virtuales'], color: 'pink', cta_href: 'https://goodbay.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'cookie-monster', name: 'Cookie Monster', tagline: 'Portal de consumidor multi-plataforma', pricing: getDynamicPricing('cookie-monster', 'Gratis para consumidores'), features: ['Agrega restaurantes, cafés, tiendas en un solo lugar', 'Carrito unificado multi-comercio', 'Programa de lealtad cross-platform'], color: 'yellow', cta_href: 'https://cookies.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'puppy-love', name: 'Puppy Love', tagline: 'Matching de mascotas y publicidad para negocios pet', pricing: getDynamicPricing('puppy-love', 'Gratis / Premium $99/mes'), features: ['Matching tipo Tinder para mascotas', 'Plataforma de anuncios B2B para negocios pet', 'Recompensas MXC por matches'], color: 'red', cta_href: 'https://puppylove.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'baul', name: 'Baúl', tagline: 'Gestión de bodegas de almacenamiento', pricing: getDynamicPricing('baul', 'Desde $299/mes'), features: ['Tracking de pallets y cajas', 'Portal de clientes', 'Logística de pickup y delivery'], color: 'stone', cta_href: 'https://baul.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'continua', name: 'Continua', tagline: 'Coordinación de donación de sangre', pricing: getDynamicPricing('continua', 'Gratis para donantes'), features: ['Alertas a donantes en tiempo real', 'Dashboard para hospitales y bancos de sangre', 'Recompensas MXC por donación'], color: 'red', cta_href: 'https://continua.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' },
			{ id: 'colectiva', name: 'Colectiva', tagline: 'Pagos, wallets y gestión de capital', pricing: getDynamicPricing('colectiva', 'Desde $499/mes'), features: ['CoDi + SPEI en tiempo real', 'Wallet empresarial con MXC', 'Escrow y gestión de equity'], color: 'purple', cta_href: 'https://colectiva.redbroomsoftware.com?utm_source=rbs_website&utm_medium=plataformas' }
		];
	}

	// Color map for Tailwind (static classes for purging)
	// Palacio re-skin: pricing text reads as strong black on light; cards share a uniform
	// hairline → gray-900 hover. The per-app color key is retained (used by c()) but maps to neutral.
	const colors = {
		amber:  { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		rose:   { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		purple: { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		teal:   { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		indigo: { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		sky:    { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		lime:   { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		orange: { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		cyan:   { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		blue:   { text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' },
		emerald:{ text: 'text-gray-900', border: 'hover:border-gray-900', shadow: 'hover:shadow-md' }
	};

	/** @param {string} color */
	function c(color) { return /** @type {Record<string, any>} */ (colors)[color] || colors.blue; }
</script>

<svelte:head>
	<title>{$_('plataformas.meta.title')}</title>
	<meta name="description" content={$_('plataformas.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<link rel="canonical" href="https://redbroomsoftware.com/plataformas" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/plataformas" />
	<meta property="og:title" content={$_('plataformas.meta.title')} />
	<meta property="og:description" content={$_('plataformas.meta.description')} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section class="py-20 px-4 sm:px-6 lg:px-8 relative">
	<div class="max-w-7xl mx-auto text-center relative">
		<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight" use:scrollReveal>
			{heroData.title} <span class="text-gray-500">{heroData.title_highlight}</span>
		</h1>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8" use:scrollReveal={{ delay: 100 }}>
			{heroData.subtitle}
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center" use:scrollReveal={{ delay: 200 }}>
			<a href={heroData.cta_primary.href} class="bg-black text-white hover:bg-gray-800 transition-all rounded-xl px-8 py-4 font-semibold" data-camino-cta="hero-primary">
				{heroData.cta_primary.text}
			</a>
			<a href={heroData.cta_secondary.href} class="bg-white text-gray-900 border border-gray-300 hover:border-gray-900 transition-all rounded-xl px-8 py-4 font-semibold" data-camino-cta="hero-secondary">
				{heroData.cta_secondary.text}
			</a>
		</div>
	</div>
</section>

<!-- Bundle Discount Banner -->
<section class="px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
	<div class="max-w-4xl mx-auto" use:scrollReveal={{ delay: 200 }}>
		<div class="glass rounded-2xl p-6 md:p-8">
			<div class="flex flex-col md:flex-row items-center gap-6">
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">
						<span class="text-emerald-600">{bannerData.title}</span> — {bannerData.subtitle}
					</h3>
					<p class="text-gray-600 text-sm">{bannerData.description}</p>
				</div>
				<div class="flex gap-4">
					{#each bannerData.items as item}
						<div class="text-center">
							<div class="text-2xl font-bold text-emerald-600">{item.value}</div>
							<div class="text-xs text-gray-500">{item.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Platforms Grid -->
<section id="plataformas" class="py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-10" use:scrollReveal>
			<h2 class="text-3xl font-bold text-gray-900 mb-2">{gridData.title}</h2>
			<p class="text-gray-600">{gridData.subtitle}</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each gridData.platforms as platform, i}
				<div
					class="glass rounded-2xl p-6 {c(platform.color).border} {c(platform.color).shadow} transition-all hover:shadow-lg flex flex-col"
					use:scrollReveal={{ delay: i * 80 }}
				>
					<div class="mb-4">
						<h3 class="text-lg font-bold text-gray-900">{platform.name}</h3>
						<p class="text-sm text-gray-500 mt-1">{platform.tagline}</p>
					</div>
					<div class="mb-4">
						<span class="text-xl font-bold {c(platform.color).text}">{platform.pricing}</span>
					</div>
					<ul class="space-y-2 mb-6 flex-1">
						{#each platform.features as feature}
							<li class="flex items-start gap-2 text-sm text-gray-700">
								<svg class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
					<a
						href={platform.cta_href}
						class="block text-center bg-black text-white hover:bg-gray-800 transition-all rounded-xl px-6 py-3 font-semibold text-sm"
						data-camino-cta="platform-{platform.id}"
					>
						{$_('plataformas.trialButton')}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Patadas Discovery CTA -->
<section class="py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto text-center" use:scrollReveal>
		<div class="glass rounded-2xl p-8 md:p-12">
			<div class="text-4xl mb-4">⚡</div>
			<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
				{isEs ? '¿No sabes cuál necesitas?' : "Not sure which one you need?"}
			</h2>
			<p class="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
				{isEs
					? 'Nuestro marketplace de IA analiza tu negocio en 2 minutos y te recomienda la combinación perfecta — o te conecta con un desarrollador certificado.'
					: 'Our AI marketplace analyzes your business in 2 minutes and recommends the perfect product combination — or connects you with a vetted developer.'}
			</p>
			<a
				href="https://patadas.redbroomsoftware.com/get-started"
				class="inline-block bg-black text-white hover:bg-gray-800 transition-all rounded-xl px-8 py-4 font-semibold"
				data-camino-cta="patadas-discovery"
			>
				{isEs ? 'Obtener recomendación gratis →' : 'Get free recommendation →'}
			</a>
		</div>
	</div>
</section>

<!-- Enterprise CTA -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto text-center" use:scrollReveal>
		<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
			{ctaData.title}
		</h2>
		<p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{ctaData.subtitle}</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href={ctaData.cta_primary.href} class="bg-black text-white hover:bg-gray-800 transition-all rounded-xl px-8 py-4 font-semibold" data-camino-cta="enterprise-primary">
				{ctaData.cta_primary.text}
			</a>
			<a href={ctaData.cta_secondary.href} class="bg-white text-gray-900 border border-gray-300 hover:border-gray-900 transition-all rounded-xl px-8 py-4 font-semibold" data-camino-cta="enterprise-secondary">
				{ctaData.cta_secondary.text}
			</a>
		</div>
	</div>
</section>

<Footer />
