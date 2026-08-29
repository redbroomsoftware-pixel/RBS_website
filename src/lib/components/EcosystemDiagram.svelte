<script lang="ts">
	import { _ } from 'svelte-i18n';

	/* El diagrama promete "un ecosistema conectado" y hasta S709 dibujaba una
	   rejilla con un círculo gris detrás — el propio markup lo llamaba
	   "connection lines (decorative)". Ahora las conexiones son reales: cada app
	   está unida al hub por una línea, y por esa línea viaja un pulso que
	   representa el evento cruzando el SDK compartido, que es el diferenciador
	   que esta sección existe para contar.

	   Sin dependencia de animación: el pulso es `stroke-dashoffset` en SVG, CSS
	   puro. Traer Framer Motion para esto costaría ~40 KB y no haría nada que
	   esto no haga. */

	const apps = [
		{ name: 'Camino', roleKey: 'camino', color: 'from-blue-500 to-cyan-500', beam: '#3b82f6' },
		{ name: 'Colectiva', roleKey: 'colectiva', color: 'from-purple-500 to-pink-500', beam: '#a855f7' },
		{ name: 'Constanza', roleKey: 'constanza', color: 'from-emerald-500 to-teal-500', beam: '#10b981' },
		{ name: 'Caracol', roleKey: 'caracol', color: 'from-orange-500 to-red-500', beam: '#f97316' },
		{ name: 'La Hoja', roleKey: 'lahoja', color: 'from-green-500 to-lime-500', beam: '#22c55e' },
		{ name: 'Plenura', roleKey: 'plenura', color: 'from-violet-500 to-purple-500', beam: '#8b5cf6' },
		{ name: 'Rito', roleKey: 'rito', color: 'from-amber-500 to-orange-500', beam: '#f59e0b' },
		{ name: 'Agora', roleKey: 'agora', color: 'from-sky-500 to-blue-500', beam: '#0ea5e9' },
		{ name: 'Comal', roleKey: 'comal', color: 'from-red-500 to-rose-500', beam: '#ef4444' },
		{ name: 'Mancha', roleKey: 'mancha', color: 'from-teal-500 to-cyan-500', beam: '#14b8a6' }
	];

	/* Posiciones en la órbita. Coordenadas en el sistema del viewBox (0-100),
	   que es el mismo que usan las tarjetas en porcentaje — así el extremo de
	   cada línea cae exactamente en el centro de su tarjeta. */
	const CX = 50;
	const CY = 50;
	const R = 37;
	const HUB_R = 9; // el haz arranca en el borde del hub, no en su centro
	const NODE_R = 7; // y termina antes de meterse bajo la tarjeta

	const nodos = apps.map((app, i) => {
		const ang = (-90 + i * (360 / apps.length)) * (Math.PI / 180);
		const ux = Math.cos(ang);
		const uy = Math.sin(ang);
		return {
			...app,
			x: CX + ux * R,
			y: CY + uy * R,
			x1: CX + ux * HUB_R,
			y1: CY + uy * HUB_R,
			x2: CX + ux * (R - NODE_R),
			y2: CY + uy * (R - NODE_R),
			delay: i * 420
		};
	});
</script>

<!-- Órbita con haces — sm en adelante. En móvil un orbital de 10 nodos es
     ilegible, así que abajo se sirve la disposición apilada. -->
<div class="relative hidden sm:block mx-auto aspect-square w-full max-w-[560px]">
	<svg
		class="absolute inset-0 h-full w-full"
		viewBox="0 0 100 100"
		fill="none"
		aria-hidden="true"
	>
		<!-- anillo de referencia -->
		<circle cx={CX} cy={CY} r={R} stroke="#e5e7eb" stroke-width="0.2" stroke-dasharray="1 1.5" />

		{#each nodos as n}
			<!-- vía en reposo -->
			<line x1={n.x1} y1={n.y1} x2={n.x2} y2={n.y2} stroke="#e5e7eb" stroke-width="0.35" />
			<!-- pulso que viaja: un evento cruzando el SDK -->
			<line
				class="haz"
				x1={n.x1}
				y1={n.y1}
				x2={n.x2}
				y2={n.y2}
				stroke={n.beam}
				stroke-width="0.7"
				stroke-linecap="round"
				pathLength="100"
				style="--retraso: {n.delay}ms"
			/>
		{/each}
	</svg>

	<!-- Hub -->
	<div
		class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 animate-float"
	>
		<div class="text-center">
			<span class="block text-sm font-bold text-white">RBS</span>
			<span class="text-[10px] text-white/70">{$_('ecosystemDiagram.hub')}</span>
		</div>
	</div>

	<!-- Apps en órbita -->
	{#each nodos as n}
		<div
			class="glass absolute w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-xl p-2 text-center transition-transform hover:scale-110"
			style="left: {n.x}%; top: {n.y}%"
		>
			<div class="mx-auto mb-1 h-7 w-7 rounded-lg bg-gradient-to-r {n.color} opacity-90"></div>
			<p class="text-[11px] font-semibold leading-tight text-gray-900">{n.name}</p>
			<p class="text-[9px] leading-tight text-gray-500">
				{$_(`ecosystemDiagram.roles.${n.roleKey}`)}
			</p>
		</div>
	{/each}
</div>

<!-- Móvil: mismo contenido, disposición apilada -->
<div class="sm:hidden">
	<div class="mb-8 flex justify-center">
		<div
			class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 animate-float"
		>
			<div class="text-center">
				<span class="block text-sm font-bold text-white">RBS</span>
				<span class="text-[10px] text-white/70">{$_('ecosystemDiagram.hub')}</span>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-2 gap-3">
		{#each apps as app}
			<div class="glass rounded-xl p-3 text-center">
				<div class="mx-auto mb-1.5 h-8 w-8 rounded-lg bg-gradient-to-r {app.color} opacity-90"></div>
				<p class="text-xs font-semibold text-gray-900">{app.name}</p>
				<p class="text-[10px] text-gray-500">{$_(`ecosystemDiagram.roles.${app.roleKey}`)}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	/* El pulso: un tramo corto de trazo recorriendo la línea. El atributo
	   `pathLength="100"` del propio <line> la normaliza a 100 unidades sin
	   importar su largo real, así que el dasharray de abajo mide en porcentaje
	   de la línea y los diez haces viajan igual aunque midan distinto. */
	.haz {
		stroke-dasharray: 14 86;
		stroke-dashoffset: 100;
		animation: recorrer 3.2s linear infinite;
		animation-delay: var(--retraso);
	}

	@keyframes recorrer {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* Quien pidió menos movimiento ve las vías, no los pulsos. */
	@media (prefers-reduced-motion: reduce) {
		.haz {
			animation: none;
			stroke-dasharray: none;
			stroke-dashoffset: 0;
			opacity: 0.35;
		}
	}
</style>
