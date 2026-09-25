import {allGeneralQuestions,LESSONS,lessonTeaching} from '../src/lib/curriculum.js';

const qs=allGeneralQuestions();
const vague=/\b(cette situation|dans la situation|selon la situation)\b/i;
const bad=[];
for(const q of qs){
  if(!q.prompt?.trim())bad.push(`${q.id}: prompt vide`);
  if(vague.test(q.prompt||''))bad.push(`${q.id}: contexte vague -> ${q.prompt}`);
  if(!Array.isArray(q.choices)||q.choices.length<2)bad.push(`${q.id}: choix insuffisants`);
  if(new Set(q.choices||[]).size!==(q.choices||[]).length)bad.push(`${q.id}: choix dupliqués`);
  if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.choices.length)bad.push(`${q.id}: correctIndex invalide`);
  if(q.id.startsWith('GEN-')&&!q.id.includes('place-')&&(!q.explanation?.trim()||!q.tip?.trim()||!Array.isArray(q.choiceExplanations)||q.choiceExplanations.length!==q.choices.length))bad.push(`${q.id}: feedback pédagogique manquant ou incomplet`);
}
for(const [id,L] of Object.entries(LESSONS)){
  const g=lessonTeaching(id);
  if(!g?.intro||!g?.rule||!g?.tip)bad.push(`${id}: guide pédagogique incomplet`);
  if(!(L.examples||[]).length)bad.push(`${id}: aucun exemple`);
}
if(bad.length){console.error(bad.join('\n'));process.exit(1)}
console.log(`Curriculum QA OK: ${qs.length} questions générales contrôlées`);
