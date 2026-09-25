import {allGeneralQuestions} from '../src/lib/curriculum.js';

const qs=allGeneralQuestions();
const vague=/\b(cette situation|dans la situation|selon la situation)\b/i;
const bad=[];
for(const q of qs){
  if(!q.prompt?.trim())bad.push(`${q.id}: prompt vide`);
  if(vague.test(q.prompt||''))bad.push(`${q.id}: contexte vague -> ${q.prompt}`);
  if(!Array.isArray(q.choices)||q.choices.length<2)bad.push(`${q.id}: choix insuffisants`);
  if(new Set(q.choices||[]).size!==(q.choices||[]).length)bad.push(`${q.id}: choix dupliqués`);
  if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.choices.length)bad.push(`${q.id}: correctIndex invalide`);
}
if(bad.length){console.error(bad.join('\n'));process.exit(1)}
console.log(`Curriculum QA OK: ${qs.length} questions générales contrôlées`);
