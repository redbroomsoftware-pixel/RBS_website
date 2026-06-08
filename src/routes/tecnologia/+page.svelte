<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { _, locale } from 'svelte-i18n';
	import { scrollReveal } from '$lib/actions/scrollReveal';

	const techStackKeys = {
		frontend: [
			{ key: 'sveltekit', icon: '🔥' },
			{ key: 'typescript', icon: '📘' },
			{ key: 'tailwind', icon: '🎨' },
			{ key: 'flutter', icon: '📱' }
		],
		backend: [
			{ key: 'supabase', icon: '⚡' },
			{ key: 'firebase', icon: '🔥' },
			{ key: 'nodejs', icon: '🟢' },
			{ key: 'postgresql', icon: '🐘' }
		],
		ai: [
			{ key: 'groq', icon: '⚡' },
			{ key: 'claude', icon: '🤖' },
			{ key: 'gpt4', icon: '💬' },
			{ key: 'gemini', icon: '🧠' },
			{ key: 'whisper', icon: '🎙️' },
			{ key: 'customml', icon: '📊' }
		],
		integrations: [
			{ key: 'satcfdi', icon: '🧾' },
			{ key: 'speicodi', icon: '💳' },
			{ key: 'whatsapp', icon: '💬' },
			{ key: 'twilio', icon: '📞' },
			{ key: 'fintocbelvo', icon: '🏦' },
			{ key: 'stripe', icon: '💰' }
		],
		infrastructure: [
			{ key: 'vercel', icon: '▲' },
			{ key: 'supabasecloud', icon: '☁️' },
			{ key: 'github', icon: '🔄' },
			{ key: 'cloudflare', icon: '🛡️' }
		]
	};

	const principleKeys = ['svelteFirst', 'typeSafety', 'edgePerformance', 'aiNative'] as const;
</script>

<svelte:head>
	<title>{$_('technology.meta.title')}</title>
	<meta name="description" content={$_('technology.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<link rel="canonical" href="https://redbroomsoftware.com/tecnologia" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://redbroomsoftware.com/tecnologia" />
	<meta property="og:title" content={$_('technology.meta.title')} />
	<meta property="og:description" content={$_('technology.meta.description')} />
	<meta property="og:image" content="https://redbroomsoftware.com/logo.svg" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section class="py-20 px-4 sm:px-6 lg:px-8 relative">
	<div class="max-w-7xl mx-auto text-center relative">
		<h2 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
			{$_('technology.hero.titlePart1')} <span class="text-gray-500">{$_('technology.hero.titleHighlight')}</span>
		</h2>
		<p class="text-xl text-gray-600 max-w-3xl mx-auto">
			{$_('technology.hero.subtitle')}
		</p>
	</div>
</section>

<!-- Principles -->
<section class="py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each principleKeys as key, i}
				<div use:scrollReveal={{ delay: i * 100 }} class="glass rounded-xl p-6">
					<h3 class="text-lg font-bold text-gray-900 mb-2">{$_(`technology.principles.${key}.title`)}</h3>
					<p class="text-gray-600 text-sm">{$_(`technology.principles.${key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Frontend -->
<section class="py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_("technology.sections.frontend")}</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each techStackKeys.frontend as tech}
				<div class="glass rounded-xl p-5 hover:border-gray-900 transition-all">
					<div class="text-2xl mb-2">{tech.icon}</div>
					<h4 class="text-gray-900 font-semibold">{$_(`technology.stack.${tech.key}.name`)}</h4>
					<p class="text-gray-600 text-sm">{$_(`technology.stack.${tech.key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Backend -->
<section class="py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_("technology.sections.backend")}</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each techStackKeys.backend as tech}
				<div class="glass rounded-xl p-5 hover:border-gray-900 transition-all">
					<div class="text-2xl mb-2">{tech.icon}</div>
					<h4 class="text-gray-900 font-semibold">{$_(`technology.stack.${tech.key}.name`)}</h4>
					<p class="text-gray-600 text-sm">{$_(`technology.stack.${tech.key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- AI -->
<section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_("technology.sections.ai")}</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each techStackKeys.ai as tech}
				<div class="glass rounded-xl p-5 hover:border-gray-900 transition-all">
					<div class="text-2xl mb-2">{tech.icon}</div>
					<h4 class="text-gray-900 font-semibold">{$_(`technology.stack.${tech.key}.name`)}</h4>
					<p class="text-gray-600 text-sm">{$_(`technology.stack.${tech.key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Agent Architecture -->
<section class="py-16 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="mb-10" use:scrollReveal>
			<h3 class="text-2xl font-bold text-gray-900 mb-2">{$_('technology.agents.title')}</h3>
			<p class="text-gray-600 max-w-2xl">
				{$_('technology.agents.subtitle')}
			</p>
		</div>

		<!-- Pipeline flow -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
			<div class="glass rounded-xl p-5">
				<div class="text-gray-900 font-mono text-xs mb-2">1. REQUEST</div>
				<p class="text-gray-900 font-semibold text-sm mb-1">{$_('technology.agents.pipeline.request.title')}</p>
				<p class="text-gray-600 text-xs">{$_('technology.agents.pipeline.request.desc')}</p>
			</div>
			<div class="bg-gray-50 border border-gray-900 rounded-xl p-5">
				<div class="text-gray-900 font-mono text-xs mb-2">2. ROUTE</div>
				<p class="text-gray-900 font-semibold text-sm mb-1">{$_('technology.agents.pipeline.route.title')}</p>
				<p class="text-gray-600 text-xs">{$_('technology.agents.pipeline.route.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="text-gray-900 font-mono text-xs mb-2">3. EXECUTE</div>
				<p class="text-gray-900 font-semibold text-sm mb-1">{$_('technology.agents.pipeline.execute.title')}</p>
				<p class="text-gray-600 text-xs">{$_('technology.agents.pipeline.execute.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="text-gray-900 font-mono text-xs mb-2">4. METER</div>
				<p class="text-gray-900 font-semibold text-sm mb-1">{$_('technology.agents.pipeline.meter.title')}</p>
				<p class="text-gray-600 text-xs">{$_('technology.agents.pipeline.meter.desc')}</p>
			</div>
		</div>

		<!-- Live agents -->
		<h4 class="text-lg font-semibold text-gray-900 mb-4" use:scrollReveal>{$_('technology.agents.liveTitle')}</h4>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Colectiva</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.oracle.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.oracle.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Rito</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.dealCopilot.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.dealCopilot.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Camino</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.support.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.support.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Plenura</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.wellness.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.wellness.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Constanza</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.fiscal.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.fiscal.desc')}</p>
			</div>
			<div class="glass rounded-xl p-5">
				<div class="flex items-center gap-2 mb-3">
					<span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
					<span class="text-xs text-emerald-600 font-medium">{$_('technology.agents.live')} · Agora</span>
				</div>
				<h5 class="text-gray-900 font-semibold mb-1">{$_('technology.agents.legal.title')}</h5>
				<p class="text-gray-600 text-sm">{$_('technology.agents.legal.desc')}</p>
			</div>
		</div>
	</div>
</section>

<!-- Integrations -->
<section class="py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_("technology.sections.integrations")}</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each techStackKeys.integrations as tech}
				<div class="glass rounded-xl p-5 hover:border-gray-900 transition-all">
					<div class="text-2xl mb-2">{tech.icon}</div>
					<h4 class="text-gray-900 font-semibold">{$_(`technology.stack.${tech.key}.name`)}</h4>
					<p class="text-gray-600 text-sm">{$_(`technology.stack.${tech.key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Infrastructure -->
<section class="py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<h3 class="text-2xl font-bold text-gray-900 mb-6">{$_("technology.sections.infrastructure")}</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each techStackKeys.infrastructure as tech}
				<div class="glass rounded-xl p-5 hover:border-gray-900 transition-all">
					<div class="text-2xl mb-2">{tech.icon}</div>
					<h4 class="text-gray-900 font-semibold">{$_(`technology.stack.${tech.key}.name`)}</h4>
					<p class="text-gray-600 text-sm">{$_(`technology.stack.${tech.key}.description`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-3xl mx-auto text-center">
		<h3 class="text-3xl font-bold text-gray-900 mb-4">{$_("technology.cta.title")}</h3>
		<p class="text-gray-600 mb-8">{$_("technology.cta.subtitle")}</p>
		<a href="/contacto" class="inline-flex px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold">
			{$_('technology.cta.button')}
		</a>
	</div>
</section>

<Footer />
