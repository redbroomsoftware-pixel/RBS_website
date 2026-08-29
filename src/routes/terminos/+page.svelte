<script lang="ts">
	import { _, locale } from 'svelte-i18n';
	import Footer from '$lib/components/Footer.svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal';

	const serviceItems = ['caracol', 'lahoja', 'cosmos', 'camino', 'colectiva', 'constanza'] as const;

	const paymentItems = $derived([0,1,2,3,4].map(i => $_(`terms.section4.items.${i}`)));
	const useItems = $derived([0,1,2,3,4,5,6,7].map(i => $_(`terms.section5.items.${i}`)));
	const availabilityItems = $derived([0,1,2,3].map(i => $_(`terms.section7.items.${i}`)));
	const cfdiItems = $derived([0,1,2,3,4,5].map(i => $_(`terms.section8.items.${i}`)));
	const cancelItems = $derived([0,1,2,3].map(i => $_(`terms.section10.items.${i}`)));
</script>

<svelte:head>
	<title>{$_('terms.meta.title')}</title>
	<meta name="description" content={$_('terms.meta.description')} />
	<meta property="og:locale" content={$locale === 'es' ? 'es_MX' : 'en_US'} />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<!-- Content -->
<main class="py-16 px-4 sm:px-6 lg:px-8">
	<article class="max-w-4xl mx-auto" use:scrollReveal>
		<div class="mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{$_('terms.title')}</h1>
			<p class="text-gray-500">{$_('terms.lastUpdated')}: {$_('terms.date')}</p>
		</div>

		<div class="prose prose-slate max-w-none space-y-8">
			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section1.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section1.content')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section2.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section2.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each serviceItems as item}
						<li><strong class="text-gray-900">{$_(`terms.section2.items.${item}.label`)}</strong> {$_(`terms.section2.items.${item}.desc`)}</li>
					{/each}
				</ul>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section3.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section3.p1')}
				</p>
				<p class="text-gray-700 leading-relaxed mt-4">
					{$_('terms.section3.p2')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section4.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section4.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each paymentItems as item}
						<li>{item}</li>
					{/each}
				</ul>
				<p class="text-gray-700 leading-relaxed mt-4">
					{$_('terms.section4.note')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section5.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section5.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each useItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section6.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section6.p1')}
				</p>
				<p class="text-gray-700 leading-relaxed mt-4">
					{$_('terms.section6.p2')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section7.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section7.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each availabilityItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section8.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section8.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each cfdiItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section9.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section9.p1')}
				</p>
				<p class="text-gray-700 leading-relaxed mt-4">
					{$_('terms.section9.p2')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section10.title')}</h2>
				<p class="text-gray-700 leading-relaxed mb-4">
					{$_('terms.section10.intro')}
				</p>
				<ul class="list-disc list-inside text-gray-700 space-y-2">
					{#each cancelItems as item}
						<li>{item}</li>
					{/each}
				</ul>
				<p class="text-gray-700 leading-relaxed mt-4">
					{$_('terms.section10.note')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section11.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section11.content')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section12.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section12.content')}
				</p>
			</section>

			<section class="bg-white rounded-2xl border border-gray-200 p-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">{$_('terms.section13.title')}</h2>
				<p class="text-gray-700 leading-relaxed">
					{$_('terms.section13.intro')}
				</p>
				<div class="mt-4 text-gray-700">
					<p><strong class="text-gray-900">Red Broom Software S.A.S. de C.V.</strong></p>
					<p>{$_('terms.section13.location')}</p>
					<p>Email: <a href="mailto:contacto@redbroomsoftware.com" class="text-gray-900 underline hover:text-gray-600">contacto@redbroomsoftware.com</a></p>
				</div>
			</section>

			<section class="bg-gray-50 rounded-2xl border border-gray-200 p-8">
				<p class="text-gray-700 leading-relaxed text-center">
					{$_('terms.acceptance')}
				</p>
			</section>
		</div>
	</article>
</main>

<Footer />
