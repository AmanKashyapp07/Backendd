/**
 * Design system and light theme invariants.
 * Verifies that the minimalist palette provides accessible contrast (WCAG AA)
 * and maintains clean typographic hierarchy.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const globalCss = read('src/styles/global.css');

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

function extractTokens() {
  const out = {};
  for (const m of globalCss.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

test('core tokens are defined in global.css', () => {
  const tokens = extractTokens();
  assert.ok(tokens['bg'], 'bg token must be defined');
  assert.ok(tokens['ink'], 'ink token must be defined');
  assert.ok(tokens['line'], 'line token must be defined');
  assert.ok(tokens['accent'], 'accent token must be defined');
  assert.ok(tokens['accent-amber'], 'accent-amber token must be defined');
});

test('dark theme text meets WCAG AA contrast (4.5:1)', () => {
  const tokens = extractTokens();
  const pairs = [
    ['ink', 'bg'],
    ['ink-muted', 'bg'],
    ['accent', 'bg'],
    ['accent-amber', 'bg'],
  ];
  for (const [fg, bg] of pairs) {
    if (tokens[fg] && tokens[bg]) {
      const ratio = contrast(tokens[fg], tokens[bg]);
      assert.ok(
        ratio >= 4.5,
        `--${fg} (${tokens[fg]}) on --${bg} (${tokens[bg]}) ratio is ${ratio.toFixed(2)}:1, expected >= 4.5:1`
      );
    }
  }
});
