import fs from 'node:fs';
import path from 'node:path';

const chaptersDir = path.resolve('src/content/chapters');
const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith('.mdx'));

let count = 0;
for (const file of files) {
  const filePath = path.join(chaptersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/_{4,}/.test(content)) {
    content = content.replace(/_{4,}/g, '---');
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Replaced underscores in ${file}`);
  }
}

console.log(`\nUpdated ${count} files.`);
