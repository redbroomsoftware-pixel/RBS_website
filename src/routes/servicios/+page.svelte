<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { _, locale } from 'svelte-i18n';
	import { scrollReveal } from '$lib/actions/scrollReveal';

	const serviceKeys = ['saas', 'pos', 'crm', 'fintech', 'legaltech', 'mobile', 'consulting'] as const;
	const serviceIcons = ['☁️', '🏪', '🤖', '🏦', '⚖️', '📱', '🎯'];
	const services = $derived(
		serviceKeys.map((key, i) => ({
			title: $_(`services.${key}.title`),
			subtitle: $_(`services.${key}.subtitle`),
			description: $_(`services.${key}.description`),
			icon: serviceIcons[i],
			features: $_(`services.${key}.features`) as unknown as string[]
		}))
	);
</script>

<svelte:head>
	<title>{$_('services.meta.title')}</title>
	<meta name="description" content={$_('services.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<link rel="canonical" href="https://redbroomsoftware.com/servicios" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/servicios" />
	<meta property="og:title" content={$_('services.meta.title')} />
	<meta property="og:description" content={$_('services.meta.description')} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section class="py-20 px-4 sm:px-6 lg:px-8 relative">
	<div class="max-w-7xl mx-auto text-center relative">
		<h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
			{$_('services.hero.titlePart1')} <span class="text-gray-500">{$_('services.hero.titleHighlight')}</span> {$_('services.hero.titlePart2')}
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			{$_('services.hero.subtitle')}
		</p>
	</div>
</section>

<!-- Services Grid -->
<section class="py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each services as service, i}
				<article use:scrollReveal={{ delay: i * 100 }} class="glass rounded-2xl p-6 hover:border-gray-900 transition-all hover:shadow-md">
					<div class="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl mb-4">
						{service.icon}
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-1">{service.title}</h3>
					<p class="text-sm text-gray-500 mb-3">{service.subtitle}</p>
					<p class="text-gray-600 text-sm mb-4">{service.description}</p>
					<ul class="space-y-2">
						{#each service.features as feature}
							<li class="flex items-center text-sm text-gray-700">
								<svg class="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-3xl font-bold text-gray-900 text-center mb-12" use:scrollReveal>{$_('services.process.title')}</h3>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
			<!-- Connecting line (desktop) -->
			<div class="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200"></div>
			{#each [
				{ num: 1, title: $_('services.process.step1.title'), desc: $_('services.process.step1.desc') },
				{ num: 2, title: $_('services.process.step2.title'), desc: $_('services.process.step2.desc') },
				{ num: 3, title: $_('services.process.step3.title'), desc: $_('services.process.step3.desc') },
				{ num: 4, title: $_('services.process.step4.title'), desc: $_('services.process.step4.desc') }
			] as step, i}
				<div class="text-center relative" use:scrollReveal={{ delay: i * 150 }}>
					<div class="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 relative z-10">
						{step.num}
					</div>
					<h4 class="text-gray-900 font-semibold mb-2">{step.title}</h4>
					<p class="text-gray-600 text-sm">{step.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto text-center">
		<h3 class="text-3xl font-bold text-gray-900 mb-4">{$_('services.cta.title')}</h3>
		<p class="text-gray-600 mb-8">{$_('services.cta.subtitle')}</p>
		<a href="/contacto" class="inline-flex px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold">
			{$_('services.cta.button')}
		</a>
	</div>
</section>

<Footer />
