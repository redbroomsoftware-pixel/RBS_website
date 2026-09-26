#!/usr/bin/env node
// PreToolUse Bash hook — impide `git push` a main/master DESDE UNA SESIÓN EN LA NUBE (S827).
//
// ── POR QUÉ EXISTE ───────────────────────────────────────────────────────────────────
// Los 31 proyectos con repo están en auto-deploy: `git push origin main` ES un deploy a
// producción. En local eso es autónomo y está bien — el dial (S509/S527) lo permite con
// compuertas verdes, y `fresh-main-guard.js` cubre la frescura.
//
// En una sesión en la nube NO existe ninguna de esas protecciones:
//   · `~/.claude/githooks/pre-commit` no está → no corre `check-principles` ni los canarios
//   · `~/Projects/CLAUDE.md`, la memoria y `live_coordination.md` no están → cero coordinación
//   · `safe-vercel-deploy.sh` y sus 4 guardias no están
// Y GitHub no puede tapar el hueco desde el servidor: la cuenta `redbroomsoftware-pixel` es
// Free, así que branch protection y rulesets devuelven 403 en repos privados (medido S827).
//
// Por eso la defensa vive DENTRO del repo, que es lo único que viaja al sandbox: la sesión
// en la nube sí lee el `.claude/settings.json` del repositorio que clona.
//
// ── CÓMO DISTINGUE NUBE DE LOCAL ─────────────────────────────────────────────────────
// No hay variable documentada que marque «sesión en la nube» (verificado contra
// code.claude.com/docs/es/env-vars, S827). La señal usada es la máquina de Brillo: si
// existe el directorio `/home/brillo/Projects`, estamos en local. La VM de la nube clona en
// otro usuario y otra ruta, así que nunca lo tiene.
// El modo de fallo es benigno y deliberado: si la detección falla, falla hacia LOCAL, o sea
// hacia no bloquear. Un hook que estorba se esquiva con `--no-verify` y deja de proteger
// (#87). Lo que este hook protege es un push desde un entorno que no debería publicar nunca.
//
// ── QUÉ HACE Y QUÉ NO ────────────────────────────────────────────────────────────────
// BLOQUEA (exit 2): en la nube, un `git push` cuyo destino sea main/master — explícito
//   (`origin main`, `HEAD:main`), o un `git push` pelado estando en main.
// NO TOCA: pushes a ramas, en local cualquier push, y nada que no sea `git push`.
// Escape: incluir `NUBE_PUSH_OK=1` en el comando (para cuando Brillo lo autoriza a mano).
//
// Autotest:  node no-push-a-main-en-la-nube.js --autotest

'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');

const MARCA_LOCAL = '/home/brillo/Projects';
const RAMAS = ['main', 'master'];

/** ¿Estamos en la máquina de Brillo? Falla hacia `true` (no bloquear). */
function esLocal(marca = MARCA_LOCAL) {
  try {
    return fs.existsSync(marca);
  } catch {
    return true;
  }
}

/** Rama actual, o null si no se puede saber. */
function ramaActual(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd, timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8',
    }).trim();
  } catch {
    return null;
  }
}

/**
 * ¿Este comando publica en main/master?
 * `rama` es la rama actual (para el `git push` pelado); null = desconocida.
 */
function apuntaAMain(cmd, rama) {
  if (!/\bgit\s+push\b/.test(cmd)) return false;
  if (/NUBE_PUSH_OK=1/.test(cmd)) return false;

  // Destino explícito: `origin main`, `origin HEAD:main`, `origin +main`, `--force main`…
  for (const r of RAMAS) {
    // El delimitador de cierre incluye comillas y paréntesis: un `bash -c "git push origin
    // main"` o un `$(git push origin main)` terminan en `"` / `)`, no en espacio, y sin esto
    // se escapaban — lo cazó el autotest.
    const re = new RegExp(`\\bgit\\s+push\\b[^|;&]*?(?:^|[\\s:+])${r}(?:[\\s;&|'")\`]|$)`);
    if (re.test(cmd)) return true;
  }

  // `git push` pelado (sin refspec) estando en main.
  const tieneRefspec = /\bgit\s+push\s+(?:-[^\s]+\s+)*[^\s-][^\s]*\s+[^\s-]/.test(cmd);
  if (!tieneRefspec && rama && RAMAS.includes(rama)) return true;

  return false;
}

// ── autotest ────────────────────────────────────────────────────────────────────────
if (process.argv.includes('--autotest')) {
  const casos = [
    // [comando, rama, ¿debe bloquear?]
    ['git push origin main', 'x', true],
    ['git push origin HEAD:main', 'x', true],
    ['git push origin master', 'x', true],
    ['git push --force origin main', 'x', true],
    ['git push', 'main', true],
    ['git push -u origin main', 'x', true],
    ['git push origin mi-rama', 'x', false],
    ['git push', 'mi-rama', false],
    ['git push origin HEAD:mi-rama', 'main', false],
    ['NUBE_PUSH_OK=1 git push origin main', 'x', false],
    ['git log --oneline main', 'main', false],
    ['git status', 'main', false],
    ['echo "git push origin main"', 'x', true], // conservador a propósito: no parseamos shell
  ];
  let fallos = 0;
  for (const [cmd, rama, esperado] of casos) {
    const got = apuntaAMain(cmd, rama);
    const ok = got === esperado;
    if (!ok) fallos++;
    console.log(`  ${ok ? '✓' : '✗'}  ${esperado ? 'bloquea' : 'pasa   '}  ${JSON.stringify(cmd)} (rama ${rama})${ok ? '' : `  → dio ${got}`}`);
  }
  // control: el detector de entorno debe discriminar
  const localOk = esLocal(MARCA_LOCAL) === true;
  const nubeOk = esLocal('/ruta/que/no/existe/jamas') === false;
  console.log(`  ${localOk ? '✓' : '✗'}  detecta LOCAL con la marca real`);
  console.log(`  ${nubeOk ? '✓' : '✗'}  detecta NUBE con una marca ausente (control)`);
  if (!localOk || !nubeOk) fallos++;
  console.log(fallos === 0 ? `\n${casos.length + 2}/${casos.length + 2} ✅` : `\n🔴 ${fallos} fallo(s)`);
  process.exit(fallos === 0 ? 0 : 1);
}

// ── hook ────────────────────────────────────────────────────────────────────────────
let raw = '';
process.stdin.on('data', (c) => { if (raw.length < (1 << 20)) raw += c; });
process.stdin.on('end', () => {
  let ev;
  try { ev = JSON.parse(raw); } catch { process.exit(0); }
  if (ev?.tool_name !== 'Bash') process.exit(0);

  const cmd = String(ev?.tool_input?.command ?? '');
  if (!cmd) process.exit(0);
  if (esLocal()) process.exit(0);           // en la máquina de Brillo no nos metemos

  const cwd = ev?.cwd || process.cwd();
  if (!apuntaAMain(cmd, ramaActual(cwd))) process.exit(0);

  process.stderr.write(
    'BLOQUEADO: push a main desde una sesión en la nube.\n\n' +
    'Los repos de RBS están en AUTO-DEPLOY: este push publicaría en producción sin las\n' +
    'compuertas que sólo existen en la máquina de Brillo (pre-commit de principios,\n' +
    'live_coordination.md, safe-vercel-deploy.sh). GitHub no puede impedirlo desde el\n' +
    'servidor porque la cuenta es Free y no tiene branch protection.\n\n' +
    'Haz esto en su lugar:\n' +
    '  git switch -c <rama-descriptiva>\n' +
    '  git push -u origin <rama-descriptiva>\n' +
    'y abre un PR. Brillo revisa y mergea desde su máquina.\n'
  );
  process.exit(2);
});
