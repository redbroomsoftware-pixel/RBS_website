<script lang="ts">
	import { _ } from 'svelte-i18n';
	let { full = false } = $props();

	const ecosystemApps: Array<{ name: string; url: string }> = [
		{ name: 'Camino', url: 'https://camino.redbroomsoftware.com' },
		{ name: 'Colectiva', url: 'https://colectiva.redbroomsoftware.com' },
		{ name: 'Constanza', url: 'https://constanza.redbroomsoftware.com' },
		{ name: 'Caracol', url: 'https://caracol.redbroomsoftware.com' },
		{ name: 'La Hoja', url: 'https://lahoja.redbroomsoftware.com' },
		{ name: 'Plenura', url: 'https://plenura.redbroomsoftware.com' },
		{ name: 'Rito', url: 'https://rito.redbroomsoftware.com' },
		{ name: 'Agora', url: 'https://agora.redbroomsoftware.com' },
		{ name: 'Comal', url: 'https://comal.redbroomsoftware.com' },
		{ name: 'Mancha', url: 'https://mancha.redbroomsoftware.com' },
		{ name: 'Cosmos Pet', url: 'https://cosmospet.redbroomsoftware.com' },
		{ name: 'Servilleta', url: 'https://servilleta.redbroomsoftware.com' },
		{ name: 'Puppy Love', url: 'https://puppylove.redbroomsoftware.com' },
		{ name: 'Continua', url: 'https://continua.redbroomsoftware.com' },
		{ name: 'Baul', url: 'https://baul.redbroomsoftware.com' },
		{ name: 'Goodbay', url: 'https://goodbay.redbroomsoftware.com' },
	];
</script>

{#if full}
	<footer class="border-t border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
				<div>
					<div class="flex items-center space-x-3 mb-4">
						<img src="/logo.svg" alt={$_("common.companyName")} class="w-8 h-8" />
						<span class="text-gray-900 font-bold">{$_("common.companyName")}</span>
					</div>
					<p class="text-gray-600 text-sm mb-4">{$_("footer.description")}</p>
					<a href="https://github.com/r-bsoftware" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="text-gray-400 hover:text-gray-900 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					</a>
				</div>
				<div>
					<h4 class="text-gray-900 font-semibold mb-4">{$_("footer.services")}</h4>
					<ul class="space-y-2 text-sm">
						<li><a href="/servicios" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("services.saas.title")}</a></li>
						<li><a href="/servicios" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("home.capabilities.pos.title")}</a></li>
						<li><a href="/servicios" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("home.capabilities.crm.title")}</a></li>
						<li><a href="/servicios" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("home.capabilities.mobile.title")}</a></li>
					</ul>
				</div>
				<div>
					<h4 class="text-gray-900 font-semibold mb-4">{$_("footer.company")}</h4>
					<ul class="space-y-2 text-sm">
						<li><a href="/portafolio" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.portfolio")}</a></li>
						<li><a href="/tecnologia" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.technology")}</a></li>
						<li><a href="/contacto" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.contact")}</a></li>
						<li><a href="https://developers.redbroomsoftware.com" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.developers")}</a></li>
					</ul>
				</div>
				<div>
					<h4 class="text-gray-900 font-semibold mb-4">{$_("footer.legal")}</h4>
					<ul class="space-y-2 text-sm">
						<li><a href="/privacidad" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.privacy")}</a></li>
						<li><a href="/terminos" class="text-gray-600 hover:text-gray-900 transition-colors">{$_("nav.terms")}</a></li>
					</ul>
				</div>
			</div>

			<!-- Ecosystem strip -->
			<div class="border-t border-gray-100 pt-6 mb-6">
				<p class="text-xs text-gray-400 mb-3">{$_("common.companyName")} {$_("footer.ecosystem")}</p>
				<div class="flex flex-wrap gap-2">
					{#each ecosystemApps as app, i}
						<a href={app.url} target="_blank" rel="noopener noreferrer" class="text-xs text-gray-400 hover:text-gray-900 transition-colors">{app.name}</a>
						{#if i !== ecosystemApps.length - 1}
							<span class="text-gray-300">·</span>
						{/if}
					{/each}
				</div>
			</div>

			<div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
				<p class="text-gray-400 text-sm">&copy; {new Date().getFullYear()} {$_("footer.copyright")}</p>
				<a href="mailto:dia@redbroomsoftware.com" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">
					dia@redbroomsoftware.com
				</a>
			</div>
		</div>
	</footer>
{:else}
	<footer class="border-t border-gray-100 py-8 px-4">
		<div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
			<p class="text-gray-400 text-sm">&copy; {new Date().getFullYear()} {$_('footer.copyright')}</p>
			<div class="flex items-center gap-6">
				<a href="/privacidad" class="text-gray-400 hover:text-gray-900 text-sm">{$_("nav.privacy")}</a>
				<a href="/terminos" class="text-gray-400 hover:text-gray-900 text-sm">{$_("nav.terms")}</a>
				<a href="mailto:dia@redbroomsoftware.com" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">
					dia@redbroomsoftware.com
				</a>
			</div>
		</div>
	</footer>
{/if}
