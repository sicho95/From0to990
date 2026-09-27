import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [app,shell]=await Promise.all([
  readFile(resolve(root,'src/app.js'),'utf8'),
  readFile(resolve(root,'src/lib/ui-shell.js'),'utf8')
]);
if(!shell.includes('data-act="onboard-zero"'))throw new Error('Bouton Je pars de zéro absent');
if(!shell.includes('onboard-zero-btn'))throw new Error('Protection tactile bouton zéro absente');
if(!app.includes("a==='onboard-zero'"))throw new Error('Action onboard-zero absente');
if(!app.includes("cefrLevel:'pre-a1'")||!app.includes("placementComplete:true")||!app.includes("profileSetupComplete:true"))throw new Error('Initialisation Pré-A1 incomplète');
if(app.includes("if(a==='onboard-test'||a==='onboard-zero')"))throw new Error('Ancien chemin partagé fragile réintroduit');
console.log('Onboarding zero QA OK');
