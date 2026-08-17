<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { _, locale } from 'svelte-i18n';
	import AnimatedCounter from '$lib/components/AnimatedCounter.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';

	/* S650 — el `as const` del final congela CADA elemento con sus campos exactos, así que los
	   productos que no traen `agentBadgeKey` no lo tienen ni como opcional y la plantilla
	   (`{#if product.agentBadgeKey}`) fallaba. Un `@type` encima no puede ganarle al `as
	   const`; se declara el campo opcional en el propio elemento que lo necesita, que es donde
	   el tipo se forma. */
	const productKeys = [
		{ key: 'caracol', icon: '📦', category: 'logistics', url: 'https://caracol.redbroomsoftware.com', tech: ['SvelteKit', 'Firebase', 'CFDI 4.0', 'Multi-warehouse'] },
		{ key: 'lahoja', icon: '🍽️', category: 'hospitality', url: 'https://hoja.redbroomsoftware.com', tech: ['Next.js', 'Firebase', 'FIFO Inventory', 'WhatsApp API'] },
		{ key: 'cosmos', icon: '🐾', category: 'vertical', url: 'https://cosmos.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'SOAP Records', 'Notifications'] },
		{ key: 'camino', icon: '🛤️', category: 'core', agentBadgeKey: 'portfolio.agentBadges.aiAgents', url: 'https://camino.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Multi-provider AI', 'Twilio', 'WhatsApp Cloud API'] },
		{ key: 'colectiva', icon: '💳', category: 'core', agentBadgeKey: 'portfolio.agentBadges.oracleAI', url: 'https://colectiva.redbroomsoftware.com', tech: ['SvelteKit', 'SPEI', 'CoDi', 'MercadoPago', 'Polygon', 'Multi-provider AI'] },
		{ key: 'constanza', icon: '📊', category: 'core', agentBadgeKey: 'portfolio.agentBadges.fiscalAI', url: 'https://constanza.redbroomsoftware.com', tech: ['SvelteKit', 'Firebase', 'SAT APIs', 'AI Classification'] },
		{ key: 'comal', icon: '🛒', category: 'core', url: 'https://comal.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Colectiva', 'Theme Engine'] },
		{ key: 'plenura', icon: '🧘', category: 'vertical', agentBadgeKey: 'portfolio.agentBadges.matchingAI', url: 'https://plenura.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Multi-provider AI', 'Smart Matching'] },
		{ key: 'rito', icon: '🏢', category: 'fintech', agentBadgeKey: 'portfolio.agentBadges.dealCopilot', url: 'https://rito.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Claude AI', 'Financial Modeling'] },
		{ key: 'agora', icon: '⚖️', category: 'vertical', agentBadgeKey: 'portfolio.agentBadges.docAI', url: 'https://agora.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Trust Accounting', 'AI Documents'] },
		{ key: 'goodbay', icon: '🏖️', category: 'hospitality', url: 'https://goodbay.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Booking Engine', 'Fiscal Optimization'] },
		{ key: 'mancha', icon: '🪑', category: 'hospitality', url: 'https://mancha.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Camino API', 'Real-time'] },
		{ key: 'continua', icon: '🩸', category: 'vertical', url: 'https://continua.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Geolocation', 'Push Notifications'] },
		{ key: 'puppylove', icon: '🐕', category: 'marketplace', url: 'https://puppylove.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Matching Algorithm', 'Chat'] },
		{ key: 'baul', icon: '📦', category: 'vertical', url: 'https://baul.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Inventory Management', 'Logistics'] },
		{ key: 'servilleta', icon: '🧹', category: 'marketplace', url: 'https://servilleta.redbroomsoftware.com', tech: ['SvelteKit', 'Supabase', 'Colectiva API', 'Geolocation'] },
	];

	const b2cServiceKeys = [
		{ key: 'constanza', icon: '📊', status: 'live', url: 'https://constanza.redbroomsoftware.com/servicios' },
		{ key: 'camino', icon: '📣', status: 'live', url: 'https://camino.redbroomsoftware.com/servicios' },
		{ key: 'colectiva', icon: '💳', status: 'live', url: 'https://colectiva.redbroomsoftware.com/servicios' },
		{ key: 'aiSupport', icon: '🤖', status: 'live', url: 'https://camino.redbroomsoftware.com' },
		{ key: 'mancha', icon: '📅', status: 'live', url: 'https://mancha.redbroomsoftware.com' }
	] as const;

	const categoryKeys = [
		{ value: '', labelKey: 'portfolio.categories.all' },
		{ value: 'core', labelKey: 'portfolio.categories.core' },
		{ value: 'hospitality', labelKey: 'portfolio.categories.hospitality' },
		{ value: 'vertical', labelKey: 'portfolio.categories.verticals' },
		{ value: 'fintech', labelKey: 'portfolio.categories.fintech' },
		{ value: 'marketplace', labelKey: 'portfolio.categories.marketplaces' }
	] as const;

	const highlightIndices = [0, 1, 2, 3];

	let activeCategory = $state('');

	const filteredProducts = $derived(
		activeCategory ? productKeys.filter(p => p.category === activeCategory) : productKeys
	);
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
			{$_("portfolio.hero.badge")}
		</div>
		<h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
			{$_("portfolio.hero.titlePart1")} <span class="text-gray-500">{$_("portfolio.hero.titleHighlight")}</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			{$_("portfolio.hero.subtitle")}
		</p>
	</div>
</section>

<!-- Category Filters -->
<section class="px-4 sm:px-6 lg:px-8 pb-8">
	<div class="max-w-7xl mx-auto">
		<div class="flex flex-wrap gap-2 justify-center">
			{#each categoryKeys as cat}
				<button
					onclick={() => activeCategory = cat.value}
					class="px-4 py-2 rounded-full text-sm font-medium transition-all
						{activeCategory === cat.value
							? 'bg-black text-white border border-black'
							: 'glass text-gray-600 hover:text-gray-900'}"
				>
					{$_(cat.labelKey)}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Products Grid -->
<section class="py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#each filteredProducts as product, i (product.key)}
				<article
					use:scrollReveal={{ delay: Math.min(i * 80, 400) }}
					class="glass rounded-2xl p-6 hover:border-gray-900 transition-all hover:shadow-md group"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
								{product.icon}
							</div>
							<div>
								<h3 class="text-xl font-bold text-gray-900">{$_(`portfolio.products.${product.key}.name`)}</h3>
								<p class="text-sm text-gray-500">{$_(`portfolio.products.${product.key}.subtitle`)}</p>
							</div>
						</div>
						<div class="flex flex-col items-end gap-1">
							<span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
								{$_('portfolio.products.live')}
							</span>
							{#if product.agentBadgeKey}
								<span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
									{$_(product.agentBadgeKey)}
								</span>
							{/if}
						</div>
					</div>

					<p class="text-gray-600 text-sm mb-4">{$_(`portfolio.products.${product.key}.description`)}</p>

					<div class="flex flex-wrap gap-2 mb-4">
						{#each product.tech as tech}
							<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{tech}</span>
						{/each}
					</div>

					<ul class="grid grid-cols-2 gap-2 mb-4">
						{#each highlightIndices as idx}
							<li class="flex items-center text-sm text-gray-700">
								<svg class="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								{$_(`portfolio.products.${product.key}.highlights.${idx}`)}
							</li>
						{/each}
					</ul>

					<a href={product.url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-gray-900 hover:text-gray-600 text-sm font-medium transition-colors">
						{$_('portfolio.products.visitProduct')}
						<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
						</svg>
					</a>
				</article>
			{/each}
		</div>
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
				<p class="text-4xl font-bold text-gray-900"><AnimatedCounter value={16} /></p>
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
