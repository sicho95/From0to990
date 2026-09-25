import {addAttempt,addSession,saveError,saveSkill,setSetting,setting} from './db.js';
import {recomputeSkills} from './adaptive.js';
import {playQuestionAudio,stopAudio} from './audio.js';
let hooks={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function persist(state){await setSetting('activeSession',state.activeSession?{...state.activeSession,questions:state.activeSession.questions.map(q=>q.id)}:null)}
export async function beginSession(state,{questions,type,title,onFinish,onExit}){stopAudio();hooks={onFinish,onExit};state.activeSession={id:crypto.randomUUID(),type,title,questions,index:0,answers:[],startedAt:new Date().toISOString(),startedMs:Date.now(),questionMs:Date.now()};await persist(state)}
export async function restoreSession(state,newHooks){hooks=newHooks||{};const x=await setting('activeSession',null);if(!x?.questions?.length)return false;const map=new Map(state.questions.map(q=>[q.id,q]));const qs=x.questions.map(id=>map.get(id)).filter(Boolean);if(!qs.length){await setSetting('activeSession',null);return false}state.activeSession={...x,questions:qs,startedMs:Date.now()-1000,questionMs:Date.now()};return true}
export function renderSession(root,state,newHooks){if(newHooks)hooks=newHooks;const s=state.activeSession,q=s?.questions?.[s.index];if(!q)return;
 const progress=Math.round(s.index/Math.max(1,s.questions.length)*100);
 root.innerHTML=`<div class="session-shell"><header class="session-top"><button id="exit">‹</button><div class="session-progress"><span style="width:${progress}%"></span></div><span>${s.index+1}/${s.questions.length}</span></header><main class="session-content">
 <div class="session-meta"><span class="level-chip">${esc((q.level||('Part '+q.part)).toUpperCase())}</span><span>${esc(s.title||'Entraînement')}</span></div>
 ${q.part<=4||q.domain==='general'?q.audioScript?.length?`<button class="listen-button" id="listen"><span>▶</span> Écouter</button>`:'' :''}
 ${q.passage?`<article class="passage">${esc(q.passage)}</article>`:''}
 <h1 class="question-prompt">${esc(q.prompt)}</h1>
 <div class="answer-list">${q.choices.map((c,i)=>`<button data-answer="${i}"><span>${String.fromCharCode(65+i)}</span><b>${esc(c)}</b></button>`).join('')}</div>
 </main></div>`;
 root.querySelector('#exit').onclick=async()=>{state.activeSession=null;await persist(state);hooks.onExit?.()};
 root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(root,state,Number(b.dataset.answer)));
 const listen=root.querySelector('#listen');if(listen)listen.onclick=()=>playQuestionAudio(q).catch(()=>{});
}
async function answer(root,state,selected){
 const s=state.activeSession,q=s.questions[s.index],correct=selected===q.correctIndex,timeMs=Date.now()-s.questionMs;
 const a={id:crypto.randomUUID(),questionId:q.id,sessionId:s.id,part:q.part??null,correct,selected,timeMs,createdAt:new Date().toISOString(),payload_json:{}};
 state.attempts.push(a);await addAttempt(a);s.answers.push(a);
 if(!correct){let e=state.errors.find(x=>x.questionId===q.id);if(!e){e={id:crypto.randomUUID(),questionId:q.id,count:0,updatedAt:new Date().toISOString(),payload_json:{}};state.errors.push(e)}e.count++;e.updatedAt=new Date().toISOString();await saveError(e)}
 await persist(state);
 root.innerHTML=`<div class="session-shell"><main class="session-content correction"><span class="result-badge ${correct?'good':'bad'}">${correct?'Correct':'À revoir'}</span><h1>${esc(q.prompt)}</h1><div class="answer-list review">${q.choices.map((c,i)=>`<div class="${i===q.correctIndex?'correct':''} ${i===selected&&i!==q.correctIndex?'wrong':''}"><span>${String.fromCharCode(65+i)}</span><b>${esc(c)}</b></div>`).join('')}</div><section class="explanation"><h3>À retenir</h3><p>${esc(q.explanation||'Observe la bonne réponse et le contexte.')}</p>${q.transcript?`<p class="transcript">${esc(q.transcript)}</p>`:''}</section><button class="primary-action full" id="next">${s.index<s.questions.length-1?'Continuer':'Voir le résultat'}</button></main></div>`;
 root.querySelector('#next').onclick=async()=>{if(s.index<s.questions.length-1){s.index++;s.questionMs=Date.now();await persist(state);renderSession(root,state)}else await finish(root,state)};
}
async function finish(root,state){
 const s=state.activeSession,correct=s.answers.filter(a=>a.correct).length,total=s.questions.length;
 const rec={id:s.id,type:s.type,startedAt:s.startedAt,endedAt:new Date().toISOString(),total,correct,durationSec:Math.round((Date.now()-s.startedMs)/1000),payload_json:{title:s.title}};
 state.sessions.unshift(rec);await addSession(rec);
 state.skills=recomputeSkills(state.questions,state.attempts);for(const sk of state.skills)await saveSkill({...sk,updatedAt:new Date().toISOString(),payload_json:{}});
 state.activeSession=null;await setSetting('activeSession',null);
 const accuracy=total?correct/total:0;
 root.innerHTML=`<div class="session-shell"><main class="session-content result-screen"><div class="result-orb">${Math.round(accuracy*100)}%</div><span class="header-kicker">SÉANCE TERMINÉE</span><h1>${esc(s.title||'Bravo')}</h1><p>${correct} bonnes réponses sur ${total}.</p><button class="primary-action full" id="done">Continuer</button></main></div>`;
 root.querySelector('#done').onclick=()=>hooks.onFinish?.({type:s.type,accuracy,correct,total});
}
