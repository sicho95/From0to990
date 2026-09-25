import {STORES,getAll,getProfile,saveProfile} from './lib/db.js';
import {recomputeSkills,priorities,estimatedScores,cefrEstimate,pickAdaptive} from './lib/adaptive.js';
import {LEVELS,THEMES,LESSONS,lessonQuestions,allGeneralQuestions,nextLessonId} from './lib/curriculum.js';
import {syncNow,syncStatus} from './lib/sync.js';
import {shell,onboarding,today,learn,theme,practice,progress,vocab,profile} from './lib/ui.js';
import {startSession,startPlacement} from './lib/session.js';

const app=document.getElementById('app');
const state={route:'today',themeId:null,questions:[],profile:null,attempts:[],sessions:[],skills:[],errors:[],sync:{}};

init().catch(err=>{console.error(err);app.innerHTML=`<main class="page"><section class="section-block"><h2>Erreur au chargement</h2><pre>${String(err.stack||err)}</pre></section></main>`});

async function init(){
  state.route=(location.hash.replace('#/','')||'today').split('?')[0];
  const content=await fetch('./content/content.json').then(r=>r.json());
  state.questions=[...content.questions,...allGeneralQuestions()];
  await hydrate();
  state.sync=await syncStatus();
  window.addEventListener('hashchange',()=>{const raw=(location.hash.replace('#/','')||'today');const [r,q]=raw.split('?');state.route=r;state.themeId=new URLSearchParams(q||'').get('id');render()});
  window.addEventListener('online',()=>doSync(true));window.addEventListener('offline',render);
  if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.register('./sw.js');navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());setInterval(()=>reg.update().catch(()=>{}),60000)}
  render();
}
async function hydrate(){const [p,a,s,sk,e]=await Promise.all([getProfile(),getAll(STORES.attempts),getAll(STORES.sessions),getAll(STORES.skills),getAll(STORES.errors)]);state.profile=p||{displayName:'',targetScore:990,timePerDay:20,onboardingComplete:false};state.attempts=a;state.sessions=s.sort((x,y)=>String(y.startedAt).localeCompare(String(x.startedAt)));state.skills=sk.length?sk:recomputeSkills(state.questions,a);state.errors=e}
function routeTitle(){return({today:'Aujourd’hui',learn:'Apprendre',theme:'Thème',practice:'Pratiquer',progress:'Progrès',vocab:'Vocabulaire',profile:'Profil'})[state.route]||'From0to990'}
function context(){const score=estimatedScores(state.questions,state.attempts),cefr=state.profile.cefrLevel||cefrEstimate(state.questions,state.attempts),next=nextLessonId(state.profile,state.attempts),weekGoal=(state.profile.timePerDay||20)*7,stats=computeStats(),generalP=priorities(state.skills,4,{general:true});return{score,cefr,nextLesson:next,nextProgress:lessonProgress(next),stats,priorities:generalP,weekGoal,gains:computeGains()}}
function render(){if(!state.profile.onboardingComplete){app.innerHTML=onboarding(state.profile);bind();return}const ctx=context();let body='';switch(state.route){case'today':body=today(state,ctx);break;case'learn':body=learn(state,ctx);break;case'theme':body=theme(state.themeId);break;case'practice':body=practice();break;case'progress':body=progress(state,ctx);break;case'vocab':body=vocab();break;case'profile':body=profile(state);break;default:body=today(state,ctx)}app.innerHTML=shell(state,body,routeTitle(),ctx.score);bind()}
function bind(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{if(b.dataset.nav==='theme')location.hash=`#/theme?id=${b.dataset.theme}`;else location.hash=`#/${b.dataset.nav}`});document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>act(b))}
async function act(b){const a=b.dataset.act;if(a==='toggle-nav'){localStorage.setItem('navCollapsed',localStorage.getItem('navCollapsed')==='1'?'0':'1');render();return}if(a==='onboard-test'||a==='onboard-zero'){state.profile=await saveProfile({...state.profile,displayName:document.getElementById('on-name').value.trim()||'Moi',targetScore:+document.getElementById('on-target').value||990,timePerDay:+document.getElementById('on-time').value||20,onboardingComplete:a==='onboard-zero',cefrLevel:a==='onboard-zero'?'pre-a1':null});if(a==='onboard-test')return startPlacement(state,{onFinish:afterSession,onExit:render});render();return}if(a==='lesson'){const id=b.dataset.id;return startSession(state,{type:`lesson:${id}`,questions:lessonQuestions(id),onFinish:afterSession,onExit:render})}if(a==='quick-general'){const q=pickAdaptive(allGeneralQuestions(),state.attempts,state.skills,12);return startSession(state,{type:'general-adaptive',questions:q,onFinish:afterSession,onExit:render})}if(a==='timed-general'){const n=Math.max(6,Math.round((+b.dataset.min||20)/2)),q=pickAdaptive(allGeneralQuestions(),state.attempts,state.skills,n);return startSession(state,{type:'general-adaptive',questions:q,onFinish:afterSession,onExit:render})}if(a.startsWith('toeic-')){let q=state.questions.filter(x=>Number.isInteger(x.part));if(a==='toeic-mini')q=pickAdaptive(q,state.attempts,state.skills,20);if(a==='toeic-listening')q=q.filter(x=>x.part<=4);if(a==='toeic-reading')q=q.filter(x=>x.part>=5);return startSession(state,{type:a,questions:q,onFinish:afterSession,onExit:render})}if(a==='save-profile'){state.profile=await saveProfile({...state.profile,displayName:document.getElementById('set-name').value.trim(),targetScore:+document.getElementById('set-target').value||990,timePerDay:+document.getElementById('set-time').value||20});render();return}if(a==='sync')return doSync(false)}
async function afterSession(){await hydrate();await doSync(true);render()}
async function doSync(silent){try{await syncNow()}catch{}state.sync=await syncStatus();if(!silent)render()}
function lessonProgress(id){const qs=lessonQuestions(id),done=new Set(state.attempts.filter(a=>a.correct).map(a=>a.questionId));return qs.length?Math.round(qs.filter(q=>done.has(q.id)).length/qs.length*100):0}
function computeStats(){const now=Date.now(),week=state.sessions.filter(s=>now-new Date(s.startedAt).getTime()<7*864e5),weekMinutes=Math.round(week.reduce((n,s)=>n+(s.durationSec||0),0)/60),lessons=state.sessions.filter(s=>String(s.type).startsWith('lesson:')).length,xp=state.attempts.filter(a=>a.correct).length*10+lessons*25,words=new Set(state.attempts.flatMap(a=>state.questions.find(q=>q.id===a.questionId)?.vocabulary||[])).size,days=new Set(state.sessions.map(s=>new Date(s.startedAt).toISOString().slice(0,10))).size,weekGoal=(state.profile.timePerDay||20)*7;return{weekMinutes,lessons,xp,words,sessions:state.sessions.length,streak:days,weekGoalPct:Math.min(100,Math.round(weekMinutes/Math.max(1,weekGoal)*100))}}
function computeGains(){return [...state.skills].filter(s=>s.id.startsWith('general.')&&(s.attempts||0)>=2).sort((a,b)=>(b.mastery||0)-(a.mastery||0)).slice(0,5).map(s=>({...s,delta:Math.max(1,Math.round(((s.mastery||.5)-.5)*100))}))}
