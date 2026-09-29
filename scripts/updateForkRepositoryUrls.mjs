import fs from 'fs';
import path from 'path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const from = 'https://github.com/adobe/react-spectrum';
const to = 'https://github.com/johansciard/react-spectrum-demo';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === 'package.json') {
      const content = fs.readFileSync(full, 'utf8');
      if (!content.includes(from)) continue;
      fs.writeFileSync(full, content.replaceAll(from, to));
    }
  }
}

walk(root);
console.log('Updated repository URLs in package.json files');
