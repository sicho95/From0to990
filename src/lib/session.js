import {addAttempt,addSession,saveError,saveSkill,setSetting,setting} from './db.js';
import {recomputeSkills} from './adaptive.js';
import {playQuestionAudio,stopAudio} from './audio.js';
import {svg} from './icons.js';

const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function beginSession(state,{questions,type,title,onFinish,onExit}){
  stopAudio();
  state.activeSession={id:crypto.randomUUID(),type,title:title||label(type),questions,index:0,answers:[],startedAt:new Date().toISOString(),startedAtMs:Date.now(),questionStartedAtMs:Date.now(),onFinish,onExit};
  await persist(state.activeSession);
}

export async function restoreSession(state,handlers={}){
  const saved=await setting('activeSession',null);if(!saved?.questionIds?.length)return false;
  const qmap=new Map(state.questions.map(q=>[q.id,q]));const questions=saved.questionIds.map(id=>qmap.get(id)).filter(Boolean);if(!questions.length){await setSetting('activeSession',null);return false}
  state.activeSession={...saved,questions,startedAtMs:Date.now()-Math.max(0,saved.elapsedMs||0),questionStartedAtMs:Date.now(),onFinish:handlers.onFinish,onExit:handlers.onExit};
  return true;
}

async function persist(s){
  if(!s)return setSetting('activeSession',null);
  await setSetting('activeSession',{id:s.id,type:s.type,title:s.title,questionIds:s.questions.map(q=>q.id),index:s.index,answers:s.answers,startedAt:s.startedAt,elapsedMs:Date.now()-s.startedAtMs});
}

export function renderSession(root,state,{onFinish,onExit}){
  const s=state.activeSession;if(!s)return; s.onFinish=onFinish||s.onFinish;s.onExit=onExit||s.onExit;
  const q=s.questions[s.index],progress=Math.round((s.index/s.questions.length)*100),listening=Boolean(q.audioScript?.length||q.audio?.url||q.audioUrl);
  root.innerHTML=`<div class="session-shell"><header class="session-topbar"><button class="round-control" id="session-close" aria-label="Quitter">×</button><div class="session-heading"><small>${E(s.title||label(s.type))}</small><strong>${s.index+1} / ${s.questions.length}</strong></div><div class="session-progress"><span style="width:${progress}%"></span></div></header>
  <main class="session-main"><article class="question-panel">
    <div class="question-meta"><span class="level-chip">${q.domain==='general'?(q.level||'English').toUpperCase():`PART ${q.part}`}</span><span>${E(q.title||'Exercice')}</span></div>
    ${listening?`<button class="listen-control" id="listen">${svg('play')}<span>Écouter</span></button>`:''}
    ${q.passage?`<div class="reading-passage">${E(q.passage)}</div>`:''}
    <h2 class="question-prompt">${E(q.prompt)}</h2>
    <div class="choice-list">${q.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><span>${String.fromCharCode(65+i)}</span><strong>${E(c)}</strong></button>`).join('')}</div>
  </article></main></div>`;
  document.getElementById('session-close').onclick=()=>exit(state);
  const listen=document.getElementById('listen');if(listen)listen.onclick=()=>playQuestionAudio(q).catch(()=>{});
  root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(root,state,Number(b.dataset.choice)));
  if(listening&&s.index===0)setTimeout(()=>playQuestionAudio(q).catch(()=>{}),250);
}

async function answer(root,state,selected){
  const s=state.activeSession,q=s.questions[s.index],correct=selected===q.correctIndex,timeMs=Date.now()-s.questionStartedAtMs;
  const attempt={id:crypto.randomUUID(),questionId:q.id,sessionId:s.id,part:q.part??null,correct,selected,timeMs,createdAt:new Date().toISOString(),payload_json:{domain:q.domain||'toeic',level:q.level||null}};
  state.attempts.push(attempt);await addAttempt(attempt);s.answers.push({questionId:q.id,selected,correct,timeMs});
  if(!correct){const old=state.errors.find(x=>x.questionId===q.id),err={id:old?.id||crypto.randomUUID(),questionId:q.id,count:(old?.count||0)+1,updatedAt:new Date().toISOString(),payload_json:{domain:q.domain||'toeic'}};if(old)Object.assign(old,err);else state.errors.push(err);await saveError(err)}
  await persist(s);renderCorrection(root,state,q,selected,correct,timeMs);
}

function renderCorrection(root,state,q,selected,correct,timeMs){
  const s=state.activeSession;
  root.innerHTML=`<div class="session-shell"><header class="session-topbar"><div class="feedback-title ${correct?'good':'bad'}">${correct?'✓ Bonne réponse':'À retenir'}</div><strong>${s.index+1} / ${s.questions.length}</strong></header>
  <main class="session-main"><article class="question-panel correction-panel"><h2 class="question-prompt">${E(q.prompt)}</h2><div class="choice-list review">${q.choices.map((c,i)=>`<div class="choice ${i===q.correctIndex?'correct':''} ${i===selected&&i!==q.correctIndex?'wrong':''}"><span>${String.fromCharCode(65+i)}</span><strong>${E(c)}</strong></div>`).join('')}</div>
  <div class="explanation"><span class="eyebrow">POURQUOI</span><p>${E(q.explanation||'Revois cette notion puis retrouve-la dans un autre contexte.')}</p>${q.transcript?`<div class="transcript"><small>À l’oral</small><p>${E(q.transcript)}</p></div>`:''}<small>${Math.round(timeMs/1000)} s · ${(q.skills||[]).join(' · ')}</small></div>
  <button class="primary-action full" id="next-question">${s.index<s.questions.length-1?'Continuer':'Terminer'}</button></article></main></div>`;
  document.getElementById('next-question').onclick=async()=>{if(s.index<s.questions.length-1){s.index++;s.questionStartedAtMs=Date.now();await persist(s);renderSession(root,state,{onFinish:s.onFinish,onExit:s.onExit})}else await finish(root,state)};
}

async function finish(root,state){
  const s=state.activeSession,correct=s.answers.filter(a=>a.correct).length;
  const record={id:s.id,type:s.type,startedAt:s.startedAt,endedAt:new Date().toISOString(),total:s.questions.length,correct,durationSec:Math.round((Date.now()-s.startedAtMs)/1000),payload_json:{title:s.title||label(s.type)}};
  state.sessions.unshift(record);await addSession(record);
  state.skills=recomputeSkills(state.questions,state.attempts);for(const skill of state.skills)await saveSkill({...skill,updatedAt:new Date().toISOString(),payload_json:{}},{queue:true});
  state.activeSession=null;await setSetting('activeSession',null);
  const summary={...record,accuracy:correct/Math.max(1,record.total)};
  root.innerHTML=`<div class="session-shell result-screen"><main class="result-card"><div class="result-badge">${correct===record.total?'★':'✓'}</div><span class="eyebrow">SÉANCE TERMINÉE</span><h1>${correct} / ${record.total}</h1><p>${Math.round(summary.accuracy*100)} % de réussite · ${Math.max(1,Math.round(record.durationSec/60))} min</p><button class="primary-action" id="session-done">Continuer</button></main></div>`;
  document.getElementById('session-done').onclick=()=>s.onFinish?.(summary);
}

async function exit(state){const s=state.activeSession;stopAudio();state.activeSession=null;await setSetting('activeSession',null);s?.onExit?.()}
function label(type){if(type?.startsWith('lesson:'))return'Leçon';if(type?.startsWith('placement'))return'Test de niveau';if(type?.startsWith('mock'))return'TOEIC blanc';if(type==='adaptive-general')return'Entraînement';return'Exercice'}
