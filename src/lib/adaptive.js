export const SKILL_LABELS={
  'p1-photo':'Part 1 · Photos','p2-response':'Part 2 · Question-réponse','p3-conversation':'Part 3 · Conversations','p4-talk':'Part 4 · Talks',
  'p5-grammar':'Part 5 · Grammaire','p6-text':'Part 6 · Texte à compléter','p7-reading':'Part 7 · Compréhension écrite',
  inference:'Inférences',paraphrase:'Paraphrases',detail:'Détails',purpose:'Intention / objectif',vocabulary:'Vocabulaire professionnel',grammar:'Grammaire',timing:'Gestion du temps',distractors:'Distracteurs',
  'general.survival':'Survie','general.identity':'Se présenter','general.numbers':'Nombres','general.hotel':'Hôtel','general.travel':'Voyage',
  'general.grammar':'Grammaire générale','general.politeness':'Politesse','general.collocations':'Collocations','general.paraphrase':'Paraphrases',
  'general.idioms':'Idiomes','general.nuance':'Nuance','general.food':'Restaurant & repas','general.colors':'Couleurs','general.shopping':'Achats',
  'general.smalltalk':'Small talk','general.work':'Anglais professionnel','general.pronunciation':'Compréhension orale naturelle','general.phrasal':'Phrasal verbs','general.falsefriends':'Faux amis'
};
function partKey(part){if(!Number.isInteger(part)||part<1||part>7)return null;return `p${part}-${part===1?'photo':part===2?'response':part===3?'conversation':part===4?'talk':part===5?'grammar':part===6?'text':'reading'}`}
function label(m,n){if(n<2)return 'À découvrir';if(m<.45)return 'Critique';if(m<.62)return 'À travailler';if(m<.76)return 'En progression';if(m<.9)return 'Solide';return 'Maîtrisé'}
export function recomputeSkills(questions,attempts){
  const qmap=new Map(questions.map(q=>[q.id,q])),map=new Map();
  for(const a of attempts){const q=qmap.get(a.questionId);if(!q)continue;const keys=[partKey(q.part),...(q.skills||[])].filter(Boolean);for(const key of keys){const s=map.get(key)||{id:key,attempts:0,correct:0,totalMs:0,mastery:.5};s.attempts++;s.correct+=a.correct?1:0;s.totalMs+=a.timeMs||0;const speed=Math.max(.2,Math.min(1.2,(q.timeTargetSec||30)*1000/Math.max(a.timeMs||1000,1000)));const recent=(a.correct?1:0)*.78+speed*.22;s.mastery=s.mastery*.8+recent*.2;map.set(key,s)}}
  for(const s of map.values()){s.accuracy=s.attempts?s.correct/s.attempts:0;s.avgMs=s.attempts?s.totalMs/s.attempts:0;s.level=label(s.mastery,s.attempts)}
  return [...map.values()]
}
function priorityScore(s){const weakness=1-(s.mastery??.5),evidence=Math.min(1,(s.attempts||0)/8);return weakness*(.65+.35*evidence)}
export function priorities(skills,limit=3,{general=false}={}){return [...skills].filter(s=>general?s.id.startsWith('general.'):!s.id.startsWith('general.')).sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,limit)}
export function pickAdaptive(questions,attempts,skills,count=12){
  const seen=new Map();for(const a of attempts)seen.set(a.questionId,(seen.get(a.questionId)||0)+1);const smap=new Map(skills.map(s=>[s.id,s]));
  return [...questions].map(q=>{let weakness=.5;const pk=partKey(q.part);if(pk)weakness=1-(smap.get(pk)?.mastery??.5);for(const sk of q.skills||[])weakness=Math.max(weakness,1-(smap.get(sk)?.mastery??.5));const freshness=1/(1+(seen.get(q.id)||0)*.6);return{q,score:weakness*.7+freshness*.25+Math.random()*.05}}).sort((a,b)=>b.score-a.score).slice(0,count).map(x=>x.q)
}
export function estimatedScores(questions,attempts){
  const qmap=new Map(questions.map(q=>[q.id,q]));const toeic=[...attempts].filter(a=>{const q=qmap.get(a.questionId);return q&&Number.isInteger(q.part)&&q.part>=1&&q.part<=7&&q.domain!=='general'}).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,200);
  const calc=parts=>{const arr=toeic.filter(a=>parts.includes(qmap.get(a.questionId)?.part));if(arr.length<8)return null;const acc=arr.filter(a=>a.correct).length/arr.length;return Math.max(5,Math.min(495,Math.round((5+acc*490)/5)*5))};
  const listening=calc([1,2,3,4]),reading=calc([5,6,7]);return{listening,reading,total:listening!=null&&reading!=null?listening+reading:null,evaluated:listening!=null&&reading!=null,attempts:toeic.length}
}
export function cefrEstimate(questions,attempts){
  const qmap=new Map(questions.map(q=>[q.id,q])),order=['pre-a1','a1','a2','b1','b2','c1'];let highest=null;
  for(const lv of order){const arr=attempts.filter(a=>{const q=qmap.get(a.questionId);return q?.level===lv&&q?.domain==='general'});if(arr.length<2)continue;const acc=arr.filter(a=>a.correct).length/arr.length;if(acc>=.67)highest=lv;else break}
  return highest
}
