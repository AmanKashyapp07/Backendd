import fs from 'node:fs';
import path from 'node:path';

const chaptersDir = path.resolve('src/content/chapters');
const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith('.mdx')).sort();

console.log(`Auditing ${files.length} MDX files in ${chaptersDir}...\n`);

let totalErrors = 0;
let totalWarnings = 0;

for (const file of files) {
  const filePath = path.join(chaptersDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const warnings = [];

  // 1. Check Frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    issues.push('Missing frontmatter');
  } else {
    const fm = fmMatch[1];
    if (!/order:\s*\d+/.test(fm)) issues.push('Frontmatter missing `order`');
    if (!/title:\s*["']?.+["']?/.test(fm)) issues.push('Frontmatter missing `title`');
    if (!/summary:\s*["']?.+["']?/.test(fm)) issues.push('Frontmatter missing `summary`');
    if (!/readingTime:\s*["']?.+["']?/.test(fm)) issues.push('Frontmatter missing `readingTime`');
  }

  // 2. Check Code Fence Balance
  const tripleBackticks = (content.match(/```/g) || []).length;
  if (tripleBackticks % 2 !== 0) {
    issues.push(`Unmatched code fences: found ${tripleBackticks} triple-backticks (must be even)`);
  }

  // 3. Check Callout Tag Balance
  const openCallouts = (content.match(/<Callout\b[^>]*>/g) || []).length;
  const closeCallouts = (content.match(/<\/Callout>/g) || []).length;
  if (openCallouts !== closeCallouts) {
    issues.push(`Unmatched <Callout> tags: ${openCallouts} open, ${closeCallouts} close`);
  }

  // 4. Check Diagram Tag Balance
  const openDiagrams = (content.match(/<Diagram\b[^>]*>/g) || []).length;
  const closeDiagrams = (content.match(/<\/Diagram>/g) || []).length;
  if (openDiagrams !== closeDiagrams) {
    issues.push(`Unmatched <Diagram> tags: ${openDiagrams} open, ${closeDiagrams} close`);
  }

  // 5. Check SVGs inside Diagram
  const openSvgs = (content.match(/<svg\b[^>]*>/g) || []).length;
  const closeSvgs = (content.match(/<\/svg>/g) || []).length;
  if (openSvgs !== closeSvgs) {
    issues.push(`Unmatched <svg> tags: ${openSvgs} open, ${closeSvgs} close`);
  }

  // 6. Check for obsolete multi-language tabs or go/python remnants
  if (/data-tab|code-tab|rehype-code-tabs/.test(content)) {
    warnings.push('Contains remnants of obsolete code-tab markup');
  }
  if (/\b(?:golang|goroutine|pydantic|fastapi|uvicorn)\b/i.test(content)) {
    warnings.push('Mentions Go/Python ecosystem terms');
  }
  if (/DsThakurRawat/i.test(content)) {
    warnings.push('Mentions legacy author @DsThakurRawat');
  }

  // Report
  const status = issues.length === 0 ? (warnings.length === 0 ? '✓ PASS' : '⚠ WARN') : '✗ FAIL';
  console.log(`[${status}] ${file} (${(content.length / 1024).toFixed(1)} KB)`);
  if (issues.length > 0) {
    for (const err of issues) console.log(`    ERROR: ${err}`);
    totalErrors += issues.length;
  }
  if (warnings.length > 0) {
    for (const w of warnings) console.log(`    WARN:  ${w}`);
    totalWarnings += warnings.length;
  }
}

console.log(`\nAudit Complete: ${files.length} files checked.`);
console.log(`Total Errors: ${totalErrors}, Total Warnings: ${totalWarnings}`);

if (totalErrors > 0) {
  process.exit(1);
}
