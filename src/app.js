import {STORES,getAll,getProfile,saveProfile} from './lib/db.js';
import {recomputeSkills,pickAdaptive,estimatedScores,cefrEstimate,priorities,SKILL_LABELS} from './lib/adaptive.js';
import {syncNow,syncStatus} from './lib/sync.js';
import {allGeneralQuestions,lessonQuestions,PLACEMENT_STAGES,nextLessonId,LESSONS} from './lib/curriculum.js';
import {shell,onboarding} from './lib/ui-shell.js';
import {today,practice,profile} from './lib/ui-today.js';
import {learn,theme,vocab} from './lib/ui-learn.js';
import {progress} from './lib/ui-progress.js';
import {beginSession,restoreSession,renderSession} from './lib/session.js';
import {computeStats,computeGains} from './lib/analytics.js';
import {initAudioBank} from './lib/audio.js';

const app=document.getElementById('app');
const state={route:'today',param:null,toeicQuestions:[],questions:[],profile:null,attempts:[],sessions:[],skills:[],errors:[],sync:{},activeSession:null};

init().catch(err=>{console.error(err);app.innerHTML=`<main class="fatal"><h1>From0to990</h1><p>Impossible de charger l’application.</p><pre>${String(err.stack||err)}</pre></main>`});

async function init(){
  routeFromHash();
  const content=await fetch('./content/content.json').then(r=>r.json());state.toeicQuestions=content.questions.map(q=>({...q,domain:q.domain||'toeic'}));
  await initAudioBank();
  state.questions=[...allGeneralQuestions(),...state.toeicQuestions];
  await hydrate();await refreshSync();
  window.addEventListener('hashchange',()=>{routeFromHash();draw()});window.addEventListener('online',()=>sync(true));window.addEventListener('offline',draw);
  if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.register('./sw.js');navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());setInterval(()=>reg.update().catch(()=>{}),60000)}
  const restored=await restoreSession(state,{onFinish:sessionFinished,onExit:draw});if(restored)renderSession(app,state,{onFinish:sessionFinished,onExit:draw});else draw();
}
function routeFromHash(){const raw=(location.hash.replace('#/','')||'today').split('/');state.route=raw[0]||'today';state.param=raw[1]||null}
async function hydrate(){
  const [p,a,s,sk,e]=await Promise.all([getProfile(),getAll(STORES.attempts),getAll(STORES.sessions),getAll(STORES.skills),getAll(STORES.errors)]);
  state.profile=p||{id:'me',displayName:'',targetScore:990,timePerDay:20,profileSetupComplete:false,placementComplete:false};if(state.profile.displayName==='Damien'&&!state.profile.profileSetupComplete){state.profile={...state.profile,displayName:''};await saveProfile(state.profile,{queue:false})}
  state.attempts=a.sort((x,y)=>String(x.createdAt).localeCompare(String(y.createdAt)));state.sessions=s.sort((x,y)=>String(y.startedAt).localeCompare(String(x.startedAt)));state.errors=e.sort((x,y)=>(y.count||0)-(x.count||0));
  state.skills=sk.length?sk:recomputeSkills(state.questions,state.attempts);
  if(!state.profile.cefrLevel){const c=cefrEstimate(state.questions,state.attempts);if(c)state.profile.cefrLevel=c}
}
async function refreshSync(){state.sync=await syncStatus()}

function ctx(){
  const score=estimatedScores(state.questions,state.attempts),cefr=state.profile.cefrLevel||cefrEstimate(state.questions,state.attempts),stats=computeStats(state),next=nextLessonId(state.profile,state.attempts,state.sessions),lq=lessonQuestions(next),done=new Set(state.attempts.filter(a=>a.correct).map(a=>a.questionId));
  return{score,cefr,stats,nextLesson:next,nextProgress:Math.round(lq.filter(q=>done.has(q.id)).length/Math.max(1,lq.length)*100),priorities:priorities(state.skills,3,{general:true}),gains:computeGains(state),weekGoal:(state.profile.timePerDay||20)*5}
}
function draw(){
  if(state.activeSession)return renderSession(app,state,{onFinish:sessionFinished,onExit:draw});
  if(!state.profile?.profileSetupComplete){app.innerHTML=onboarding(state.profile);bind();return}
  const c=ctx();let body,title;
  switch(state.route){
    case'learn':body=learn(state,c);title='Apprendre';break;
    case'theme':body=theme(state.param);title='Thème';break;
    case'practice':body=practice(state,c);title='Pratiquer';break;
    case'progress':body=progress(state,c);title='Progrès';break;
    case'vocab':body=vocab(state);title='Vocabulaire';break;
    case'profile':body=profile(state);title='Profil';break;
    default:state.route='today';body=today(state,c);title='Aujourd’hui';
  }
  app.innerHTML=shell(state,body,title,c.score);bind();
}

function bind(){
  app.querySelectorAll('[data-nav]').forEach(el=>el.onclick=()=>{const r=el.dataset.nav;if(r==='theme')location.hash=`#/theme/${el.dataset.theme}`;else location.hash=`#/${r}`});
  app.querySelectorAll('[data-act]').forEach(el=>el.onclick=()=>action(el).catch(e=>{console.error(e);toast(e.message||String(e))}));
}
async function action(el){
  const a=el.dataset.act;
  if(a==='toggle-nav'){localStorage.setItem('navCollapsed',localStorage.getItem('navCollapsed')==='1'?'0':'1');draw();return}
  if(a==='onboard-test'||a==='onboard-zero'){if(!await saveOnboarding())return;if(a==='onboard-zero'){state.profile=await saveProfile({...state.profile,cefrLevel:'pre-a1',placementComplete:true});location.hash='#/today';return}return startPlacement(0)}
  if(a==='lesson')return start(lessonQuestions(el.dataset.id),`lesson:${el.dataset.id}`,LESSONS[el.dataset.id]?.title||'Leçon');
  if(a==='quick-general')return start(pickAdaptive(allGeneralQuestions().filter(q=>!q.id.includes('place-')),state.attempts,state.skills,12),'adaptive-general','Entraînement');
  if(a==='timed-general'){const n=Math.max(6,Math.round(Number(el.dataset.min||20)/2));return start(pickAdaptive(allGeneralQuestions().filter(q=>!q.id.includes('place-')),state.attempts,state.skills,n),'adaptive-general',`${el.dataset.min} minutes`)}
  if(a==='toeic-mini')return start(toeicDiagnosticPool(2),'toeic-mini','Mini-test TOEIC');
  if(a==='toeic-listening')return start(state.toeicQuestions.filter(q=>q.part<=4),'mock-listening','Listening complet');
  if(a==='toeic-reading')return start(state.toeicQuestions.filter(q=>q.part>=5),'mock-reading','Reading complet');
  if(a==='toeic-full')return start(state.toeicQuestions,'mock-full','TOEIC blanc');
  if(a==='save-profile'){state.profile=await saveProfile({...state.profile,displayName:document.getElementById('set-name').value.trim(),targetScore:990,timePerDay:Number(document.getElementById('set-time').value||20)});toast('Profil enregistré');draw();return}
  if(a==='sync')return sync(false);
}
async function saveOnboarding(){const name=document.getElementById('on-name').value.trim();if(!name){toast('Saisis un prénom ou un pseudo');return false}state.profile=await saveProfile({...state.profile,displayName:name,targetScore:990,timePerDay:Number(document.getElementById('on-time').value||20),profileSetupComplete:true});return true}

async function startPlacement(index){const stage=PLACEMENT_STAGES[index];if(!stage)return;await start(stage.questions,`placement:${index}`,`Test de niveau · ${stage.level.toUpperCase()}`)}
async function start(questions,type,title){await beginSession(state,{questions,type,title,onFinish:sessionFinished,onExit:draw});renderSession(app,state,{onFinish:sessionFinished,onExit:draw})}
async function sessionFinished(summary){
  await hydrate();
  if(summary.type?.startsWith('placement:')){const idx=Number(summary.type.split(':')[1]),passed=summary.accuracy>=.67;if(passed&&idx<PLACEMENT_STAGES.length-1)return startPlacement(idx+1);const level=passed?PLACEMENT_STAGES[idx].level:(idx===0?'pre-a1':PLACEMENT_STAGES[idx-1].level);state.profile=await saveProfile({...state.profile,cefrLevel:level,placementComplete:true});if(['a2','b1','b2','c1'].includes(level))return start(toeicDiagnosticPool(4),'placement-toeic','Étalonnage TOEIC');location.hash='#/today';return}
  if(summary.type==='placement-toeic'){state.profile=await saveProfile({...state.profile,toeicPlacementComplete:true});location.hash='#/progress';return}
  draw();sync(true);
}
function toeicDiagnosticPool(perPart=4){const out=[];for(let p=1;p<=7;p++)out.push(...state.toeicQuestions.filter(q=>q.part===p).slice(0,perPart));return out}

async function sync(silent=false){try{await syncNow();await refreshSync();if(!silent)toast('Progression synchronisée')}catch(e){if(!silent)toast('Synchronisation différée')}draw()}
function toast(message){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=message;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)}
