<script>
	import '../app.css';
	import { getStoredLocale, setLocale } from '$lib/i18n';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();

	onMount(() => {
		const stored = getStoredLocale();
		if (stored) setLocale(stored);
	});
</script>

<div class="min-h-screen bg-slate-950">
	<Header />
	<main id="main">
		{@render children()}
	</main>
</div>
