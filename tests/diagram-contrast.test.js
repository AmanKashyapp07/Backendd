/**
 * The diagram palette must stay readable in light theme.
 *
 * The migrated SVGs use semantic tokens (--dg-*) rather than literal colours,
 * so their legibility is decided entirely by the palette in Diagram.astro.
 * This test pins every foreground/background pairing that actually occurs
 * in the artwork against WCAG AA.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/components/Diagram.astro'), 'utf8');

/** Pull the --dg-* declarations out of the diagram block. */
function palette() {
  const start = css.indexOf('.diagram-figure {');
  const block = css.slice(start, css.indexOf('}', start));
  const out = {};
  for (const m of block.matchAll(/--dg-([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const hex = (s) => {
  const h = s.length === 4 ? s.slice(1).split('').map((c) => c + c).join('') : s.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(hex(a)), lum(hex(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* Foreground on background, as the artwork actually combines them. */
const PAIRS = [
  ['ink', 'paper'], ['ink-2', 'paper'], ['ink-3', 'paper'],
  ['ink', 'surface'], ['ink-2', 'surface'], ['ink-3', 'surface'],
  ['ink', 'surface-2'], ['ink-2', 'surface-2'],
  ['accent', 'paper'], ['accent-2', 'paper'],
  ['on-accent', 'accent'], ['on-accent', 'accent-2'],
  ['ok', 'paper'], ['ok', 'surface'],
  ['warn', 'paper'], ['warn-2', 'paper'],
  ['info', 'paper'], ['info', 'surface'],
  ['plum', 'paper'],
  // The inverse plate carries its own ink ramp.
  ['on-inverse', 'inverse'], ['on-inverse-2', 'inverse'], ['on-inverse-3', 'inverse'],
  ['on-inverse-accent', 'inverse'], ['on-inverse-ok', 'inverse'],
  ['on-inverse-warn', 'inverse'], ['on-inverse-info', 'inverse'],
];

const p = palette();

test('every diagram token is defined', () => {
  const roles = new Set();
  for (const file of fs.readdirSync(path.join(root, 'src/content/chapters'))) {
    const t = fs.readFileSync(path.join(root, 'src/content/chapters', file), 'utf8');
    for (const m of t.matchAll(/var\(--dg-([\w-]+)\)/g)) roles.add(m[1]);
  }
  for (const role of roles) {
    assert.ok(p[role], `--dg-${role} is used by a diagram but not defined in palette`);
  }
});

test('diagram text meets WCAG AA (4.5:1)', () => {
  const opaque = (v) => /^#[0-9a-fA-F]{3,6}$/.test(v ?? '');
  const fails = PAIRS
    .filter(([fg, bg]) => opaque(p[fg]) && opaque(p[bg]))
    .map(([fg, bg]) => [fg, bg, contrast(p[fg], p[bg])])
    .filter(([, , r]) => r < 4.5);
  assert.deepEqual(
    fails.map(([fg, bg, r]) => `--dg-${fg} on --dg-${bg} = ${r.toFixed(2)}:1`),
    [],
  );
});
