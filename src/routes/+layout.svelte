<script lang="ts">
	import '../app.css';
	import { getStoredLocale, setLocale } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { SiteHeader, SiteFooter } from '@r-bsoftware/palacio-ui';

	let { children } = $props();

	onMount(() => {
		const stored = getStoredLocale();
		if (stored) setLocale(stored);
	});

	// Shared shell expects a narrowed 'es' | 'en'; default anything else to 'es'.
	const shellLocale = $derived(($locale === 'en' ? 'en' : 'es') as 'es' | 'en');

	// Bridge the shared shell's (key, fallback) translator to svelte-i18n.
	// $_ returns the key itself when a key is missing, so fall back in that case.
	function shellT(key: string, fallback: string): string {
		const v = $_(key);
		return v === key ? fallback : v;
	}

	function onLocaleChange(l: 'es' | 'en') {
		setLocale(l);
	}
</script>

<!-- accent-rbs mounts the apex's Palacio Engine accent (black) so the shared shell
     and any Palacio-themed sections inherit the apex tone. Light surface throughout. -->
<div class="min-h-screen flex flex-col bg-white text-gray-900 accent-rbs">
	<SiteHeader
		surface="rbs"
		locale={shellLocale}
		{onLocaleChange}
		t={shellT}
		ctaLabel={shellT('nav.contact', 'Empezar')}
	/>
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<SiteFooter surface="rbs" locale={shellLocale} />
</div>
