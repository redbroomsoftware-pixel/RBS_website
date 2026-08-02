<script lang="ts">
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';
	import TypewriterText from '$lib/components/TypewriterText.svelte';
	import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
	import EcosystemDiagram from '$lib/components/EcosystemDiagram.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';
	// El número de apps NO se escribe en la prosa: se deriva del canon
	// (`apps.json`) y se interpola. Antes vivía a mano en once cadenas y decía 22
	// cuando el ecosistema tenía 25.
	import ecosystemStats from '$lib/ecosystem-stats.json';

	const appCount = ecosystemStats.appCount;
	const conCuenta = { values: { appCount } };

	const techLogos = [
		'SvelteKit', 'Next.js', 'TypeScript', 'Supabase', 'Firebase', 'PostgreSQL',
		'Tailwind', 'Anthropic', 'OpenAI', 'Vercel', 'Jitsi',
		'SPEI', 'CoDi', 'WhatsApp', 'Node.js'
	];

	const ecosystemAppKeys = [
		{ key: 'patadas', gradient: 'from-orange-500 to-red-500' },
		{ key: 'camino', gradient: 'from-cyan-500 to-blue-500' },
		{ key: 'colectiva', gradient: 'from-purple-500 to-pink-500' },
		{ key: 'constanza', gradient: 'from-blue-500 to-indigo-500' },
		{ key: 'agora', gradient: 'from-indigo-500 to-violet-500' },
		{ key: 'caracol', gradient: 'from-green-500 to-emerald-500' },
		{ key: 'comal', gradient: 'from-blue-400 to-cyan-400' },
		{ key: 'lahoja', gradient: 'from-teal-500 to-green-500' },
		{ key: 'mancha', gradient: 'from-red-500 to-orange-500' },
		{ key: 'plenura', gradient: 'from-pink-500 to-rose-500' },
		{ key: 'rito', gradient: 'from-amber-500 to-yellow-500' },
		{ key: 'cosmosPet', gradient: 'from-yellow-500 to-amber-500' }
	] as const;

	// Cuatro Funciones — apex mirror of Palacio's lupa (Forge/Patadas/Labs/Atlas).
	// Spec: docs/cross-cutting/internal/palacio-themed-client-funnel.md §7.7 RATIFIED 2026-05-17.
	const functionKeys = [
		{ key: 'forge', icon: '⚒️', href: 'https://palacio.redbroomsoftware.com#forge' },
		{ key: 'patadas', icon: '↗', href: 'https://patadas.redbroomsoftware.com?source=apex' },
		{ key: 'labs', icon: '✦', href: 'https://developers.redbroomsoftware.com' },
		{ key: 'atlas', icon: '◇', href: 'https://developers.redbroomsoftware.com/apps/' }
	] as const;
</script>

<svelte:head>
	<title>{$_('home.meta.title', conCuenta)}</title>
	<meta name="description" content={$_('home.meta.description', conCuenta)} />
	<link rel="canonical" href="https://redbroomsoftware.com/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/" />
	<meta property="og:title" content={$_('home.meta.title', conCuenta)} />
	<meta property="og:description" content={$_('home.meta.description', conCuenta)} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={$_('home.meta.title', conCuenta)} />

	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": "https://redbroomsoftware.com/#organization",
		"name": "Red Broom Software",
		"legalName": "Red Broom Software S.A.S. de C.V.",
		"alternateName": ["RBS", "RedBroom"],
		"url": "https://redbroomsoftware.com",
		"logo": { "@type": "ImageObject", "url": "https://redbroomsoftware.com/logo.svg" },
		"description": "22-app AI-powered business ecosystem. POS, CRM, payments, accounting, legal, e-commerce — all connected.",
		"foundingDate": "2023",
		"address": { "@type": "PostalAddress", "addressCountry": "MX" },
		"contactPoint": [{ "@type": "ContactPoint", "email": "dia@redbroomsoftware.com", "contactType": "sales", "availableLanguage": ["Spanish", "English"] }],
		"sameAs": ["https://github.com/r-bsoftware"]
	}
	\u003C/script>`}
</svelte:head>

<!-- Hero -->
	<section class="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
		<div class="max-w-7xl mx-auto text-center relative">
			<div class="inline-flex items-center px-4 py-2 glass rounded-full text-sm text-gray-600 mb-8">
				<span class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
				{$_('home.hero.badge', conCuenta)}
			</div>

			<h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
				{$_('home.hero.titlePart1')}<br />
				<TypewriterText words={[$_('home.hero.typewriterWords.0'), $_('home.hero.typewriterWords.1'), $_('home.hero.typewriterWords.2'), $_('home.hero.typewriterWords.3')]} interval={2500} />
				<br />
				<span class="text-gray-500">{$_('home.hero.forGlobalBusiness')}</span>
			</h1>

			<p class="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
				{$_('home.hero.subtitle', conCuenta)}
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="https://patadas.redbroomsoftware.com/get-started" target="_blank" rel="noopener noreferrer" class="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-lg font-semibold hover:-translate-y-0.5">
					{$_('home.cta.findSolution')}
				</a>
				<a href="https://patadas.redbroomsoftware.com/developers/apply" target="_blank" rel="noopener noreferrer" class="px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-xl hover:border-gray-900 transition-all text-lg font-semibold">
					{$_('home.cta.joinDeveloper')}
				</a>
			</div>

			<!-- Stats -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
				<div>
					<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={22} /></p>
					<p class="text-gray-500 text-sm">{$_('home.stats.apps')}</p>
				</div>
				<div>
					<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={10} suffix="+" /></p>
					<p class="text-gray-500 text-sm">{$_('home.stats.industries')}</p>
				</div>
				<div>
					<p class="text-4xl font-bold text-gray-900">1</p>
					<p class="text-gray-500 text-sm">{$_('home.stats.sdk')}</p>
				</div>
				<div>
					<p class="text-4xl font-bold text-gray-900">2</p>
					<p class="text-gray-500 text-sm">{$_('home.stats.languages')}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Tech Marquee -->
	<section class="py-8 overflow-hidden border-y border-gray-100">
		<div class="flex animate-marquee whitespace-nowrap">
			{#each [...techLogos, ...techLogos] as logo}
				<span class="mx-8 text-gray-400 text-sm font-medium">{logo}</span>
			{/each}
		</div>
	</section>

	<!-- Patadas CTA -->
	<section class="py-24 px-4 sm:px-6 lg:px-8">
		<div class="max-w-5xl mx-auto">
			<div class="glass-strong rounded-3xl p-8 md:p-12 text-center" use:scrollReveal>
				<div class="text-5xl mb-4">⚡</div>
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{$_('home.patadas.title')}</h2>
				<p class="text-xl text-gray-700 mb-2">{$_('home.patadas.subtitle')}</p>
				<p class="text-gray-600 max-w-2xl mx-auto mb-8">
					{$_('home.patadas.description')}
				</p>
				<a href="https://patadas.redbroomsoftware.com" target="_blank" rel="noopener noreferrer" class="inline-flex px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-lg font-semibold hover:-translate-y-0.5">
					{$_('home.patadas.button')} →
				</a>
			</div>
		</div>
	</section>

	<!-- Cuatro Funciones — apex mirror of Palacio's lupa (Forge/Patadas/Labs/Atlas) -->
	<section class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-16 max-w-3xl mx-auto" use:scrollReveal>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">{$_('home.functions.title')}</h2>
				<p class="text-xl text-gray-600">
					{$_('home.functions.subtitle')}
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each functionKeys as fn, i}
					<a
						href={fn.href}
						target="_blank"
						rel="noopener noreferrer"
						use:scrollReveal={{ delay: i * 100 }}
						class="glass rounded-2xl p-8 hover:border-gray-900 transition-all group block"
					>
						<div class="text-4xl mb-4">{fn.icon}</div>
						<h3 class="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">{$_(`home.functions.${fn.key}.tagline`)}</h3>
						<p class="text-2xl font-bold text-gray-900 mb-3">{$_(`home.functions.${fn.key}.title`)}</p>
						<p class="text-gray-600 leading-relaxed text-sm">{$_(`home.functions.${fn.key}.desc`, conCuenta)}</p>
						<p class="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-900 transition-colors">
							{$_(`home.functions.${fn.key}.cta`)} →
						</p>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Ecosystem Grid -->
	<section class="py-24 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-16" use:scrollReveal>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">{$_('home.ecosystem.title')}</h2>
				<p class="text-xl text-gray-600">{$_('home.ecosystem.subtitle', conCuenta)}</p>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each ecosystemAppKeys as app, i}
					<div
						use:scrollReveal={{ delay: i * 50 }}
						class="glass rounded-xl p-5 hover:shadow-md transition-all group"
					>
						<div class="w-10 h-10 rounded-lg bg-gradient-to-r {app.gradient} mb-3 opacity-90 group-hover:opacity-100 transition-opacity"></div>
						<span class="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-medium mb-2">
							{$_(`home.ecosystem.apps.${app.key}.badge`)}
						</span>
						<h3 class="text-lg font-bold text-gray-900">{$_(`home.ecosystem.apps.${app.key}.name`)}</h3>
						<p class="text-gray-600 text-sm">{$_(`home.ecosystem.apps.${app.key}.desc`)}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Ecosystem Diagram -->
	<section class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
		<div class="max-w-5xl mx-auto">
			<div class="text-center mb-12" use:scrollReveal>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">{$_('home.ecosystemDiagram.title')}</h2>
				<p class="text-xl text-gray-600">{$_('home.ecosystemDiagram.subtitle')}</p>
			</div>
			<div use:scrollReveal>
				<EcosystemDiagram />
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
		<div class="max-w-4xl mx-auto text-center relative" use:scrollReveal>
			<h2 class="text-4xl font-bold text-gray-900 mb-6">{$_('home.finalCta.title')}</h2>
			<p class="text-xl text-gray-600 mb-10">
				{$_('home.finalCta.subtitle')}
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="https://patadas.redbroomsoftware.com/get-started" target="_blank" rel="noopener noreferrer" class="px-10 py-5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-lg font-semibold hover:-translate-y-0.5">
					{$_('home.finalCta.findSolution')}
				</a>
				<a href="mailto:dia@redbroomsoftware.com" class="px-10 py-5 bg-white text-gray-900 border border-gray-300 rounded-xl hover:border-gray-900 transition-all text-lg font-semibold">
					{$_('home.finalCta.directContact')}
				</a>
			</div>
		</div>
	</section>
<Footer full={true} />
