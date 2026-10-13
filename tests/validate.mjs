import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname || '.');
const project = path.resolve(root, '..');
const main = path.join(project, 'src/intelligent-bot.user.js');
const content = fs.readFileSync(main, 'utf8');
assert.match(content, /\/\/ ==UserScript==/);
assert.match(content, /@run-at\s+document-start/);
assert.match(content, /@match\s+https:\/\/gameofbombs\.com\/\*/);
assert.doesNotMatch(content, /@match\s+http:\/\//);
assert.doesNotMatch(content, /@require\s+/);
for (const tokenPattern of [/\b\d{8,10}:[A-Za-z0-9_-]{30,}\b/, /(?:password|api[_-]?key|secret)\s*[:=]\s*["'][^"']{8,}["']/i]) {
  assert.doesNotMatch(content, tokenPattern);
}
execFileSync(process.execPath, ['--check', main], { stdio: 'inherit' });
let count = 0;
for (const folder of ['research/canvas', 'research/prototypes']) {
  for (const filename of fs.readdirSync(path.join(project, folder))) {
    if (!filename.endsWith('.js')) continue;
    execFileSync(process.execPath, ['--check', path.join(project, folder, filename)], { stdio: 'inherit' });
    count++;
  }
}
for (const file of ['docs/SOURCES.md','docs/ARCHITECTURE.md','docs/REVERSE_ENGINEERING.md']) {
  assert.ok(fs.existsSync(path.join(project, file)), `${file} missing`);
}
console.log(`Validation passed: primary userscript and ${count} research scripts parse correctly.`);
