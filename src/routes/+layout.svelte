<script lang="ts">
	import '../app.css';
	import { getStoredLocale, setLocale } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { SiteHeader } from '@r-bsoftware/palacio-ui';

	let { children } = $props();

	onMount(() => {
		const stored = getStoredLocale();
		if (stored) setLocale(stored);
	});

	// Shared shell expects a narrowed 'es' | 'en'. Se estrecha por PREFIJO de idioma,
	// no por igualdad: `$locale` sale de getLocaleFromNavigator(), que devuelve la
	// variante regional del navegador ('es-419', 'es-MX', 'en-US') y casi nunca el
	// código pelado. Comparar `=== 'en'` mandaba a un usuario con 'en-US' al shell en
	// castellano mientras svelte-i18n le servía el contenido en inglés — el mismo
	// defecto que en /plataformas, ahí en la otra dirección (S709).
	const shellLocale = $derived(
		(String($locale ?? 'es').toLowerCase().startsWith('en') ? 'en' : 'es') as 'es' | 'en'
	);

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
	<!-- Footer is rendered per-page (rich marketing Footer in $lib/components/Footer.svelte).
	     The minimal palacio-ui SiteFooter was removed here to avoid a double footer (S434). -->
</div>
