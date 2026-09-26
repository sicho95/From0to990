import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [css,shell,app,authUi]=await Promise.all([
  readFile(resolve(root,'src/styles/base.css'),'utf8'),
  readFile(resolve(root,'src/lib/ui-shell.js'),'utf8'),
  readFile(resolve(root,'src/app.js'),'utf8'),
  readFile(resolve(root,'src/lib/ui-auth.js'),'utf8')
]);

if(!css.includes('background:var(--glass-strong)'))throw new Error('Bottom tab bar must use theme glass variable');
if(css.includes('.bottom-tabs{')&&css.includes('background:rgba(25,28,35,.78)'))throw new Error('Hard-coded dark bottom tab background reintroduced');
if(!css.includes(':root[data-theme="light"] .bottom-tabs'))throw new Error('Light bottom tab treatment missing');
if(!shell.includes("navItems(active,state,{admin:false})"))throw new Error('iPhone bottom tabs must stay at five items');
if(authUi.includes('auth-merge-local')||authUi.includes('Fusionner'))throw new Error('Legacy local-account merge UI must stay removed');
if(!app.includes("await clearUserData();\n    await saveAuthSession(data)"))throw new Error('Account switch must clear pedagogical local data before hydration');
console.log('UI/auth regression checks OK');
