<script lang="ts">
	import { _ } from 'svelte-i18n';

	const apps = [
		{ name: 'Camino', roleKey: 'camino', color: 'from-blue-500 to-cyan-500' },
		{ name: 'Colectiva', roleKey: 'colectiva', color: 'from-purple-500 to-pink-500' },
		{ name: 'Constanza', roleKey: 'constanza', color: 'from-emerald-500 to-teal-500' },
		{ name: 'Caracol', roleKey: 'caracol', color: 'from-orange-500 to-red-500' },
		{ name: 'La Hoja', roleKey: 'lahoja', color: 'from-green-500 to-lime-500' },
		{ name: 'Plenura', roleKey: 'plenura', color: 'from-violet-500 to-purple-500' },
		{ name: 'Rito', roleKey: 'rito', color: 'from-amber-500 to-orange-500' },
		{ name: 'Agora', roleKey: 'agora', color: 'from-sky-500 to-blue-500' },
		{ name: 'Comal', roleKey: 'comal', color: 'from-red-500 to-rose-500' },
		{ name: 'Mancha', roleKey: 'mancha', color: 'from-teal-500 to-cyan-500' }
	];
</script>

<div class="relative py-8">
	<!-- Center hub -->
	<div class="flex justify-center mb-8">
		<div class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-float">
			<div class="text-center">
				<span class="text-white font-bold text-sm block">RBS</span>
				<span class="text-white/70 text-[10px]">{$_('ecosystemDiagram.hub')}</span>
			</div>
		</div>
	</div>

	<!-- Apps orbiting -->
	<div class="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
		{#each apps as app, i}
			<div
				class="glass rounded-xl p-3 text-center hover:scale-105 transition-transform cursor-default"
				style="animation-delay: {i * 100}ms"
			>
				<div class="w-8 h-8 rounded-lg bg-gradient-to-r {app.color} mx-auto mb-1.5 opacity-90"></div>
				<p class="text-gray-900 text-xs font-semibold">{app.name}</p>
				<p class="text-gray-500 text-[10px]">{$_(`ecosystemDiagram.roles.${app.roleKey}`)}</p>
			</div>
		{/each}
	</div>

	<!-- Connection lines (decorative) -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gray-100 rounded-full"></div>
	</div>
</div>
