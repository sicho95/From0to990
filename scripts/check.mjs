import { access, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files=['src/index.html','src/app.js','src/styles.css','src/lib/db.js','src/lib/adaptive.js','src/lib/audio.js','src/lib/sync.js','src/lib/ui.js','src/lib/session.js','src/lib/curriculum.js','public/sw.js','public/manifest.webmanifest','backend-contract/openapi.yaml','backend-contract/schema.sql','scripts/generate-content.mjs'];
for(const f of files) await access(resolve(root,f));
for(const f of ['src/app.js','src/lib/db.js','src/lib/adaptive.js','src/lib/audio.js','src/lib/sync.js','src/lib/ui.js','src/lib/session.js','src/lib/curriculum.js','public/sw.js','scripts/build.mjs','scripts/generate-content.mjs']) {
  await exec(process.execPath,['--check',resolve(root,f)]);
}
const manifest=JSON.parse(await readFile(resolve(root,'public/manifest.webmanifest'),'utf8'));
if(!manifest.name || !manifest.start_url) throw new Error('Invalid manifest');
console.log('Checks OK');
