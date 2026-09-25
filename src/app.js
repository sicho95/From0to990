import {STORES,getAll,getProfile,saveProfile} from './lib/db.js';
import {recomputeSkills,pickAdaptive,estimatedScores,cefrEstimate,priorities} from './lib/adaptive.js';
import {syncNow,syncStatus} from './lib/sync.js';
import {allGeneralQuestions,lessonQuestions,PLACEMENT_STAGES,nextLessonId,LESSONS} from './lib/curriculum.js';
import {shell,onboarding} from './lib/ui-shell.js';
import {today,practice,profile} from './lib/ui-today.js';
import {learn,theme,vocab} from './lib/ui-learn.js';
import {progress} from './lib/ui-progress.js';
import {beginSession,restoreSession,renderSession} from './lib/session.js';
import {computeStats,computeGains} from './lib/analytics.js';

const root=document.getElementById('app');
const state={route:'today',param:null,toeicQuestions:[],questions:[],profile:null,attempts:[],sessions:[],skills:[],errors:[],sync:{},activeSession:null};

init().catch(err=>{console.error(err);root.innerHTML=`<main class="fatal"><h1>From0to990</h1><p>Impossible de charger l’application.</p><pre>${String(err.stack||err)}</pre></main>`});

async function init(){
 routeFromHash();
 const content=await fetch('./content/content.json').then(r=>r.json());
 state.toeicQuestions=content.questions.map(q=>({...q,domain:q.domain||'toeic'}));
 state.questions=[...allGeneralQuestions(),...state.toeicQuestions];
 await hydrate();await refreshSync();
 window.addEventListener('hashchange',()=>{routeFromHash();draw()});
 window.addEventListener('online',()=>sync(true));window.addEventListener('offline',draw);
 if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.register('./sw.js');navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());setInterval(()=>reg.update().catch(()=>{}),60000)}
 const restored=await restoreSession(state,{onFinish:sessionFinished,onExit:draw});
 if(restored)renderSession(root,state,{onFinish:sessionFinished,onExit:draw});else draw();
}
function routeFromHash(){const parts=(location.hash.replace('#/','')||'today').split('/');state.route=parts[0]||'today';state.param=parts[1]||null}
async function hydrate(){
 const [p,a,s,sk,e]=await Promise.all([getProfile(),getAll(STORES.attempts),getAll(STORES.sessions),getAll(STORES.skills),getAll(STORES.errors)]);
 state.profile=p||{id:'me',displayName:'',targetScore:990,timePerDay:20,profileSetupComplete:false,placementComplete:false};
 state.attempts=a.sort((x,y)=>String(x.createdAt).localeCompare(String(y.createdAt)));
 state.sessions=s.sort((x,y)=>String(y.startedAt).localeCompare(String(x.startedAt)));
 state.errors=e.sort((x,y)=>(y.count||0)-(x.count||0));
 state.skills=sk.length?sk:recomputeSkills(state.questions,state.attempts);
 if(!state.profile.cefrLevel){const c=cefrEstimate(state.questions,state.attempts);if(c)state.profile.cefrLevel=c}
}
async function refreshSync(){state.sync=await syncStatus()}
function context(){
 const score=estimatedScores(state.questions,state.attempts),cefr=state.profile.cefrLevel||cefrEstimate(state.questions,state.attempts),stats=computeStats(state);
 const nextLesson=nextLessonId(state.profile,state.attempts),weekGoal=(state.profile.timePerDay||20)*5;
 return{score,cefr,stats,nextLesson,nextProgress:lessonProgress(nextLesson),priorities:priorities(state.skills,3,{general:true}),gains:computeGains(state),weekGoal};
}
function lessonProgress(id){const qs=lessonQuestions(id),done=new Set(state.attempts.filter(a=>a.correct).map(a=>a.questionId));return Math.round(qs.filter(q=>done.has(q.id)).length/Math.max(1,qs.length)*100)}
function draw(){
 if(state.activeSession)return renderSession(root,state,{onFinish:sessionFinished,onExit:draw});
 if(!state.profile?.profileSetupComplete){root.innerHTML=onboarding(state.profile);bind();return}
 const c=context();let body,title;
 switch(state.route){
  case'learn':body=learn(state,c);title='Apprendre';break;
  case'theme':body=theme(state.param);title='Thème';break;
  case'practice':body=practice(state,c);title='Pratiquer';break;
  case'progress':body=progress(state,c);title='Progrès';break;
  case'vocab':body=vocab(state);title='Vocabulaire';break;
  case'profile':body=profile(state);title='Profil';break;
  default:state.route='today';body=today(state,c);title='Aujourd’hui';
 }
 root.innerHTML=shell(state,body,title,c.score);bind();
}
function bind(){
 root.querySelectorAll('[data-nav]').forEach(el=>el.onclick=()=>{if(el.dataset.nav==='theme')location.hash=`#/theme/${el.dataset.theme}`;else location.hash=`#/${el.dataset.nav}`});
 root.querySelectorAll('[data-act]').forEach(el=>el.onclick=()=>action(el).catch(err=>{console.error(err);toast(err.message||String(err))}));
}
async function action(el){
 const a=el.dataset.act;
 if(a==='toggle-nav'){localStorage.setItem('navCollapsed',localStorage.getItem('navCollapsed')==='1'?'0':'1');draw();return}
 if(a==='onboard-test'||a==='onboard-zero'){await saveOnboarding();if(a==='onboard-zero'){state.profile=await saveProfile({...state.profile,cefrLevel:'pre-a1',placementComplete:true});location.hash='#/today';return}return startPlacement(0)}
 if(a==='lesson')return start(lessonQuestions(el.dataset.id),`lesson:${el.dataset.id}`,LESSONS[el.dataset.id]?.title||'Leçon');
 if(a==='quick-general')return start(generalPool(12),'adaptive-general','Entraînement');
 if(a==='timed-general')return start(generalPool(Math.max(6,Math.round(Number(el.dataset.min||20)/2))),'adaptive-general',`${el.dataset.min} minutes`);
 if(a==='toeic-mini'||a==='toeic-check')return start(toeicPool(3),'toeic-mini','Mini-test TOEIC');
 if(a==='toeic-listening')return start(state.toeicQuestions.filter(q=>q.part<=4),'mock-listening','Listening complet');
 if(a==='toeic-reading')return start(state.toeicQuestions.filter(q=>q.part>=5),'mock-reading','Reading complet');
 if(a==='toeic-full')return start(state.toeicQuestions,'mock-full','TOEIC blanc');
 if(a==='save-profile'){state.profile=await saveProfile({...state.profile,displayName:document.getElementById('set-name').value.trim(),targetScore:Number(document.getElementById('set-target').value||990),timePerDay:Number(document.getElementById('set-time').value||20)});toast('Profil enregistré');draw();return}
 if(a==='sync')return sync(false);
}
async function saveOnboarding(){
 state.profile=await saveProfile({...state.profile,displayName:document.getElementById('on-name').value.trim()||'Damien',targetScore:Number(document.getElementById('on-target').value||990),timePerDay:Number(document.getElementById('on-time').value||20),profileSetupComplete:true});
}
function generalPool(n){return pickAdaptive(allGeneralQuestions().filter(q=>!q.id.includes('place-')),state.attempts,state.skills,n)}
function toeicPool(perPart){const out=[];for(let p=1;p<=7;p++)out.push(...state.toeicQuestions.filter(q=>q.part===p).slice(0,perPart));return out}
async function startPlacement(i){const stage=PLACEMENT_STAGES[i];if(stage)return start(stage.questions,`placement:${i}`,`Test de niveau · ${stage.level.toUpperCase()}`)}
async function start(qs,type,title){await beginSession(state,{questions:qs,type,title,onFinish:sessionFinished,onExit:draw});renderSession(root,state,{onFinish:sessionFinished,onExit:draw})}
async function sessionFinished(summary){
 await hydrate();
 if(summary.type?.startsWith('placement:')){
  const i=Number(summary.type.split(':')[1]),passed=summary.accuracy>=.67;
  if(passed&&i<PLACEMENT_STAGES.length-1)return startPlacement(i+1);
  const level=passed?PLACEMENT_STAGES[i].level:(i===0?'pre-a1':PLACEMENT_STAGES[i-1].level);
  state.profile=await saveProfile({...state.profile,cefrLevel:level,placementComplete:true});
  if(['a2','b1','b2','c1'].includes(level))return start(toeicPool(4),'placement-toeic','Étalonnage TOEIC');
  location.hash='#/today';return;
 }
 if(summary.type==='placement-toeic'){state.profile=await saveProfile({...state.profile,toeicPlacementComplete:true});location.hash='#/progress';return}
 await sync(true);draw();
}
async function sync(silent=false){try{await syncNow();await refreshSync();if(!silent)toast('Progression synchronisée')}catch{if(!silent)toast('Synchronisation différée')}draw()}
function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2300)}
