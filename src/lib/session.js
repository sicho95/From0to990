import {addAttempt,addSession,saveError,saveSkill,setSetting,setting} from './db.js';
import {recomputeSkills} from './adaptive.js';
import {playQuestionAudio,stopAudio} from './audio.js';
import {svg} from './icons.js';
import {LESSONS,lessonTeaching} from './curriculum.js';

const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function beginSession(state,{questions,type,title,onFinish,onExit}){
  stopAudio();
  state.activeSession={id:crypto.randomUUID(),type,title:title||label(type),questions,index:0,answers:[],introPending:Boolean(type?.startsWith('lesson:')),startedAt:new Date().toISOString(),startedAtMs:Date.now(),questionStartedAtMs:Date.now(),onFinish,onExit};
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
  await setSetting('activeSession',{id:s.id,type:s.type,title:s.title,questionIds:s.questions.map(q=>q.id),index:s.index,answers:s.answers,introPending:Boolean(s.introPending),startedAt:s.startedAt,elapsedMs:Date.now()-s.startedAtMs});
}

function renderLessonIntro(root,state){
  const sess=state.activeSession,id=sess.type.slice('lesson:'.length),L=LESSONS[id],teach=lessonTeaching(id);
  if(!L||!teach){sess.introPending=false;return renderSession(root,state,{onFinish:sess.onFinish,onExit:sess.onExit})}
  root.innerHTML=`<div class="session-shell lesson-intro-shell"><header class="session-topbar"><button class="round-control" id="session-close" aria-label="Quitter">×</button><div class="session-heading"><small>${E(L.level.toUpperCase())}</small><strong>${E(L.title)}</strong></div></header>
  <main class="session-main"><article class="lesson-teaching-card">
    <span class="eyebrow">AVANT DE PRATIQUER</span>
    <h1>${E(L.title)}</h1>
    <p class="lesson-goal">${E(L.goal)}</p>
    <section class="teach-block"><h3>Le principe</h3><p>${E(teach.intro)}</p></section>
    <section class="teach-block rule"><h3>Règle / construction</h3><p>${E(teach.rule)}</p></section>
    <div class="teaching-examples">${(L.examples||[]).slice(0,3).map(x=>`<div><strong>${E(x)}</strong></div>`).join('')}</div>
    <section class="teach-block tip"><h3>Astuce</h3><p>${E(teach.tip)}</p></section>
    <section class="teach-block pronunciation"><h3>À l’oral</h3><p>${E(teach.pronunciation)}</p></section>
    <div class="vocab-chips">${(L.words||[]).slice(0,8).map(w=>`<span>${E(w)}</span>`).join('')}</div>
    <button class="primary-action full" id="start-lesson-practice">Passer à la pratique</button>
  </article></main></div>`;
  document.getElementById('session-close').onclick=()=>exit(state);
  document.getElementById('start-lesson-practice').onclick=async()=>{sess.introPending=false;sess.questionStartedAtMs=Date.now();await persist(sess);renderSession(root,state,{onFinish:sess.onFinish,onExit:sess.onExit})};
}

export function renderSession(root,state,{onFinish,onExit}){
  const s=state.activeSession;if(!s)return; s.onFinish=onFinish||s.onFinish;s.onExit=onExit||s.onExit;if(s.introPending)return renderLessonIntro(root,state);
  const q=s.questions[s.index],progress=Math.round((s.index/s.questions.length)*100),hasAudio=Boolean(q.audioScript?.length||q.audio?.url||q.audioUrl),audioMode=q.audioMode||(q.domain==='general'?'feedback':'prompt'),listening=hasAudio&&audioMode==='prompt';
  root.innerHTML=`<div class="session-shell"><header class="session-topbar"><button class="round-control" id="session-close" aria-label="Quitter">×</button><div class="session-heading"><small>${E(s.title||label(s.type))}</small><strong>${s.index+1} / ${s.questions.length}</strong></div><div class="session-progress"><span style="width:${progress}%"></span></div></header>
  <main class="session-main"><article class="question-panel">
    <div class="question-meta"><span class="level-chip">${q.domain==='general'?(q.level||'English').toUpperCase():`PART ${q.part}`}</span><span>${E(q.title||'Exercice')}</span></div>
    ${listening?`<button class="listen-control" id="listen">${svg('play')}<span>Réécouter</span></button>`:''}
    ${q.passage?`<div class="reading-passage">${E(q.passage)}</div>`:''}
    <h2 class="question-prompt">${E(q.prompt)}</h2>
    <div class="choice-list">${q.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><span>${String.fromCharCode(65+i)}</span><strong>${E(c)}</strong></button>`).join('')}</div>
  </article></main></div>`;
  document.getElementById('session-close').onclick=()=>exit(state);
  const listen=document.getElementById('listen');if(listen)listen.onclick=()=>playQuestionAudio(q).catch(()=>{});
  root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(root,state,Number(b.dataset.choice)));
  if(listening)setTimeout(()=>playQuestionAudio(q).catch(()=>{}),300);
}

function answer(root,state,selected){
  const s=state.activeSession,q=s.questions[s.index],correct=selected===q.correctIndex,timeMs=Date.now()-s.questionStartedAtMs;
  const attempt={id:crypto.randomUUID(),questionId:q.id,sessionId:s.id,part:q.part??null,correct,selected,timeMs,createdAt:new Date().toISOString(),payload_json:{domain:q.domain||'toeic',level:q.level||null}};
  state.attempts.push(attempt);
  s.answers.push({questionId:q.id,selected,correct,timeMs});

  let errorRecord=null;
  if(!correct){
    const old=state.errors.find(x=>x.questionId===q.id);
    errorRecord={id:old?.id||crypto.randomUUID(),questionId:q.id,count:(old?.count||0)+1,updatedAt:new Date().toISOString(),payload_json:{domain:q.domain||'toeic'}};
    if(old)Object.assign(old,errorRecord);else state.errors.push(errorRecord);
  }

  // Important for iOS Safari: render and start feedback audio synchronously
  // inside the user's tap gesture, before the first await.
  const persistence=(async()=>{
    await addAttempt(attempt);
    if(errorRecord)await saveError(errorRecord);
    await persist(s);
  })();

  renderCorrection(root,state,q,selected,correct,timeMs,persistence);
}

function renderCorrection(root,state,q,selected,correct,timeMs,persistence=Promise.resolve()){
  const sess=state.activeSession;
  const hasAudio=Boolean(q.audioScript?.length||q.audio?.url||q.audioUrl);
  const audioMode=q.audioMode||(q.domain==='general'?'feedback':'prompt');
  const feedbackAudio=hasAudio&&audioMode==='feedback';
  const selectedWhy=q.choiceExplanations?.[selected]||'Cette réponse ne correspond pas au sens, à la structure ou au contexte attendu.';
  const correctWhy=q.explanation||`La bonne réponse est « ${q.choices[q.correctIndex]} ».`;
  const tip=q.tip||'Observe la structure de la bonne réponse et réutilise-la dans une autre phrase.';

  root.innerHTML=`<div class="session-shell"><header class="session-topbar"><div class="feedback-title ${correct?'good':'bad'}">${correct?'✓ Bien vu':'✦ À comprendre'}</div><strong>${sess.index+1} / ${sess.questions.length}</strong></header>
  <main class="session-main"><article class="question-panel correction-panel">
    <h2 class="question-prompt">${E(q.prompt)}</h2>
    <div class="choice-list review">${q.choices.map((c,i)=>`<div class="choice ${i===q.correctIndex?'correct':''} ${i===selected&&i!==q.correctIndex?'wrong':''}"><span>${String.fromCharCode(65+i)}</span><strong>${E(c)}</strong></div>`).join('')}</div>
    <div class="explanation teaching-feedback">
      ${!correct?`<div class="feedback-section wrong-why"><span class="eyebrow">POURQUOI TON CHOIX NE VA PAS</span><p>${E(selectedWhy)}</p></div>`:''}
      <div class="feedback-section"><span class="eyebrow">POURQUOI CETTE RÉPONSE</span><p>${E(correctWhy)}</p></div>
      <div class="feedback-section tip-box"><span class="eyebrow">ASTUCE</span><p>${E(tip)}</p></div>
      ${q.transcript?`<div class="transcript"><small>À entendre / prononcer</small><p>${E(q.transcript)}</p></div>`:''}
    </div>
    <div class="feedback-actions">${hasAudio?`<button class="listen-control compact" id="replay-feedback">${svg('play')}<span>Réécouter</span></button>`:''}<button class="feedback-next" id="feedback-next">Suivant</button><small>L’app continue automatiquement si tu ne touches rien.</small></div>
  </article></main></div>`;

  clearTimeout(sess.advanceTimer);
  let advancing=false;
  const advanceNow=async()=>{
    if(advancing||state.activeSession!==sess)return;
    advancing=true;clearTimeout(sess.advanceTimer);stopAudio();
    await persistence.catch(()=>{});
    if(sess.index<sess.questions.length-1){
      sess.index++;sess.questionStartedAtMs=Date.now();await persist(sess);
      renderSession(root,state,{onFinish:sess.onFinish,onExit:sess.onExit});
    }else await finish(root,state);
  };
  document.getElementById('feedback-next').onclick=advanceNow;

  const replay=document.getElementById('replay-feedback');
  const scheduleAdvance=()=>{
    clearTimeout(sess.advanceTimer);
    const words=(correctWhy+' '+tip+(correct?'':' '+selectedWhy)).trim().split(/\s+/).length;
    const wait=Math.max(correct?4200:7000,Math.min(correct?8000:12000,words*170));
    sess.advanceTimer=setTimeout(advanceNow,wait);
  };

  if(replay)replay.onclick=async()=>{
    clearTimeout(sess.advanceTimer);replay.disabled=true;replay.setAttribute('aria-busy','true');
    try{await playQuestionAudio(q)}catch{}finally{replay.disabled=false;replay.removeAttribute('aria-busy')}
    if(state.activeSession===sess)scheduleAdvance();
  };

  const audioPromise=feedbackAudio?playQuestionAudio(q).catch(()=>null):Promise.resolve();
  Promise.allSettled([audioPromise,persistence]).then(()=>{if(state.activeSession===sess)scheduleAdvance()});
}

async function finish(root,state){
  const s=state.activeSession,correct=s.answers.filter(a=>a.correct).length;
  const record={id:s.id,type:s.type,startedAt:s.startedAt,endedAt:new Date().toISOString(),total:s.questions.length,correct,durationSec:Math.round((Date.now()-s.startedAtMs)/1000),payload_json:{title:s.title||label(s.type)}};
  state.sessions.unshift(record);await addSession(record);
  state.skills=recomputeSkills(state.questions,state.attempts);for(const skill of state.skills)await saveSkill({...skill,updatedAt:new Date().toISOString(),payload_json:{}},{queue:true});
  state.activeSession=null;await setSetting('activeSession',null);
  const summary={...record,accuracy:correct/Math.max(1,record.total)};

  // Placement is one continuous diagnostic: no "Continue" between CEFR stages.
  if(s.type?.startsWith('placement')){
    root.innerHTML=`<div class="session-shell result-screen"><main class="result-card diagnostic-transition"><div class="result-badge">✓</div><span class="eyebrow">TEST DE NIVEAU</span><h1>${Math.round(summary.accuracy*100)} %</h1><p>Analyse de tes réponses…</p></main></div>`;
    setTimeout(()=>s.onFinish?.(summary),850);
    return;
  }

  root.innerHTML=`<div class="session-shell result-screen"><main class="result-card"><div class="result-badge">${correct===record.total?'★':'✓'}</div><span class="eyebrow">SÉANCE TERMINÉE</span><h1>${correct} / ${record.total}</h1><p>${Math.round(summary.accuracy*100)} % de réussite · ${Math.max(1,Math.round(record.durationSec/60))} min</p><button class="primary-action" id="session-done">Continuer</button></main></div>`;
  const doneBtn=document.getElementById('session-done');
  doneBtn.onclick=async()=>{
    if(doneBtn.dataset.busy==='1')return;
    doneBtn.dataset.busy='1';
    doneBtn.disabled=true;
    doneBtn.setAttribute('aria-busy','true');
    doneBtn.textContent='Chargement…';
    try{await s.onFinish?.(summary)}catch(e){
      console.error(e);
      doneBtn.dataset.busy='0';
      doneBtn.disabled=false;
      doneBtn.removeAttribute('aria-busy');
      doneBtn.textContent='Continuer';
    }
  };
}

async function exit(state){const s=state.activeSession;if(s?.advanceTimer)clearTimeout(s.advanceTimer);stopAudio();state.activeSession=null;await setSetting('activeSession',null);s?.onExit?.()}
function label(type){if(type?.startsWith('lesson:'))return'Leçon';if(type?.startsWith('placement'))return'Test de niveau';if(type?.startsWith('mock'))return'TOEIC blanc';if(type==='adaptive-general')return'Entraînement';return'Exercice'}
