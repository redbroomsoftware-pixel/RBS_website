/**
 * Foco que sigue al cursor sobre una tarjeta.
 *
 * Escribe la posición del puntero en `--fx` / `--fy`; el resplandor lo pinta el
 * pseudo-elemento `.foco::before` de `app.css`. Se separa así para que el JS no
 * toque estilos de pintado: aquí sólo viajan dos números.
 *
 * Detalles que no son adorno:
 *  - Se escucha en `pointermove`, no en `mousemove`, para cubrir también lápiz
 *    y táctil sin registrar dos juegos de escuchas.
 *  - La escritura se agrupa en un `requestAnimationFrame`: pointermove dispara
 *    muy por encima de la tasa de refresco y escribir la variable en cada
 *    evento haría trabajo que nadie llega a ver.
 *  - Quien pide movimiento reducido no recibe escuchas en absoluto — el CSS ya
 *    apaga la transición, pero sin esto seguiríamos calculando en cada gesto.
 */
export function spotlight(node: HTMLElement) {
	const quieto =
		typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (quieto) return {};

	let pendiente = 0;
	let x = 0;
	let y = 0;

	function pintar() {
		pendiente = 0;
		node.style.setProperty('--fx', `${x}px`);
		node.style.setProperty('--fy', `${y}px`);
	}

	function mover(e: PointerEvent) {
		const r = node.getBoundingClientRect();
		x = e.clientX - r.left;
		y = e.clientY - r.top;
		if (!pendiente) pendiente = requestAnimationFrame(pintar);
	}

	node.addEventListener('pointermove', mover);

	return {
		destroy() {
			node.removeEventListener('pointermove', mover);
			if (pendiente) cancelAnimationFrame(pendiente);
		}
	};
}
