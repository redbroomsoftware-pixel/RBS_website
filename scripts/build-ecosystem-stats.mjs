#!/usr/bin/env node
/**
 * build-ecosystem-stats.mjs — deriva los conteos del ecosistema desde el canon.
 *
 * ── EL PROBLEMA QUE RESUELVE (S586, 2026-08-02) ───────────────────────────────
 * Este sitio afirmaba «22 apps» en ONCE lugares distintos (es + en): el título de la
 * página, la meta descripción, el badge del hero, el subtítulo, la tarjeta de Atlas
 * («Veintidos apps en produccion») y el subtítulo del ecosistema. Todos escritos a mano.
 * El canon decía 25.
 *
 * Corregir los once números habría durado hasta la siguiente app. El número **deja de
 * existir en la prosa**: las cadenas llevan `{appCount}` y el valor se interpola desde
 * este archivo generado. No se puede desincronizar porque ya no hay dos copias.
 *
 * Mismo patrón que `docs/scripts/build-ecosystem-stats.mjs`: el JSON se genera aquí y se
 * COMMITEA, porque el build de Vercel sólo ve este repo — `ecosystem-sdk` no está ahí.
 * Por eso hay además un guardián (`check-ecosystem-stats.mjs`) que falla si el JSON
 * commiteado se quedó atrás respecto al canon.
 *
 * Uso:
 *   node scripts/build-ecosystem-stats.mjs            # regenera
 *   node scripts/build-ecosystem-stats.mjs --check    # sólo comprueba (código 1 si difiere)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(__dirname, '..');
const SDK = resolve(RAIZ, '../ecosystem-sdk');
const SALIDA = join(RAIZ, 'src/lib/ecosystem-stats.json');

const soloComprobar = process.argv.includes('--check');

function contarApps() {
	const p = join(SDK, 'packages/mcp-server/src/registry/apps.json');
	if (!existsSync(p)) return null;
	return Object.keys(JSON.parse(readFileSync(p, 'utf8'))).length;
}

const appCount = contarApps();

if (appCount === null) {
	// Sin el canon a mano NO se inventa un número ni se deja el archivo a medias: se sale
	// con un mensaje. Un `0` silencioso publicaría «0 apps» en la portada.
	console.error(
		'✗ no encuentro el canon en ' +
			join(SDK, 'packages/mcp-server/src/registry/apps.json') +
			'\n  (este script corre en local, no en el build de Vercel — el JSON generado va commiteado)'
	);
	process.exit(2);
}

const actual = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf8')) : null;

if (soloComprobar) {
	if (!actual) {
		console.error('✗ falta src/lib/ecosystem-stats.json — corre el script sin --check');
		process.exit(1);
	}
	if (actual.appCount !== appCount) {
		console.error(
			`🔴 el sitio dice ${actual.appCount} apps y el canon tiene ${appCount}.\n` +
				'   corre: node scripts/build-ecosystem-stats.mjs && commitea el JSON'
		);
		process.exit(1);
	}
	console.log(`✓ ecosystem-stats al día (${appCount} apps)`);
	process.exit(0);
}

// `generated_at` se conserva cuando el número no cambió, para que regenerar no ensucie el
// diff con una fecha nueva en cada corrida.
const sinCambio = actual && actual.appCount === appCount;
const salida = {
	appCount,
	generated_at: sinCambio ? actual.generated_at : new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
	source: 'ecosystem-sdk/packages/mcp-server/src/registry/apps.json'
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 2) + '\n', 'utf8');
console.log(`✓ src/lib/ecosystem-stats.json → ${appCount} apps${sinCambio ? ' (sin cambio)' : ''}`);
