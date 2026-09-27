import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [css,shell,app,authUi,sites,prompt]=await Promise.all([
  readFile(resolve(root,'src/styles/base.css'),'utf8'),
  readFile(resolve(root,'src/lib/ui-shell.js'),'utf8'),
  readFile(resolve(root,'src/app.js'),'utf8'),
  readFile(resolve(root,'src/lib/ui-auth.js'),'utf8'),
  readFile(resolve(root,'backend-contract/SITES_MINIMAL.md'),'utf8'),
  readFile(resolve(root,'backend-contract/AT_SITES_DEPLOY_PROMPT.md'),'utf8')
]);

if(!css.includes('background:var(--glass-strong)'))throw new Error('Bottom tab bar must use theme glass variable');
if(css.includes('.bottom-tabs{')&&css.includes('background:rgba(25,28,35,.78)'))throw new Error('Hard-coded dark bottom tab background reintroduced');
if(!css.includes(':root[data-theme="light"] .bottom-tabs'))throw new Error('Light bottom tab treatment missing');
if(!css.includes('background:rgba(250,250,252,.94)'))throw new Error('Light bottom tab must have an explicit light translucent background');
if(!shell.includes("state.auth?.user?.role==='admin'?6:5")||!shell.includes('navItems(active,state)}</nav>'))throw new Error('iPhone administration tab must be visible to admins');
if(!authUi.includes('change-required')||!app.includes('state.auth.user?.mustChangePassword'))throw new Error('Temporary password change gate missing');
if(authUi.includes('auth-merge-local')||authUi.includes('Fusionner'))throw new Error('Legacy local-account merge UI must stay removed');
if(!app.includes("await clearUserData();\n    await saveAuthSession(data)"))throw new Error('Account switch must clear pedagogical local data before hydration');
const backendText=`${sites}\n${prompt}`;
if(/RESEND_API_KEY|PASSWORD_RESET_FROM|SendGrid|Mailgun/i.test(backendText))throw new Error('Server mail provider dependency must stay removed');
if(!app.includes("mailto:"))throw new Error('Admin mailto temporary-password handoff missing');
console.log('UI/auth regression checks OK');
