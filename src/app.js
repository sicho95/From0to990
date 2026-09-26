import {STORES,getAll,getProfile,saveProfile,deviceId,setting,clearUserData} from './lib/db.js';
import {recomputeSkills,pickAdaptive,estimatedScores,cefrEstimate,priorities,SKILL_LABELS} from './lib/adaptive.js';
import {syncNow,syncStatus} from './lib/sync.js';
import {allGeneralQuestions,lessonQuestions,PLACEMENT_STAGES,nextLessonId,LESSONS} from './lib/curriculum.js';
import {shell,onboarding} from './lib/ui-shell.js';
import {today,practice,profile} from './lib/ui-today.js';
import {learn,theme,vocab,lessonIntro} from './lib/ui-learn.js';
import {progress} from './lib/ui-progress.js';
import {beginSession,restoreSession,renderSession} from './lib/session.js';
import {computeStats,computeGains} from './lib/analytics.js';
import {initAudioBank} from './lib/audio.js';
import {randomSample} from './lib/randomize.js';
import {applyTheme,initTheme,storedTheme} from './lib/theme.js';
import {loadAuthState,registerAccount,loginAccount,saveAuthSession,logoutAccount,forgotPassword,resetPassword,adminListUsers,adminSetUserStatus,adminDeleteUser} from './lib/auth.js';
import {authScreen,resetTokenFromRoute} from './lib/ui-auth.js';
import {admin} from './lib/ui-admin.js';

const app=document.getElementById('app');
const state={route:'today',param:null,toeicQuestions:[],questions:[],profile:null,attempts:[],sessions:[],skills:[],errors:[],sync:{},activeSession:null,auth:{enabled:false,user:null},authView:'login',adminUsers:null,adminLoading:false,adminQuery:'',adminConfirmId:null};

init().catch(err=>{console.error(err);app.innerHTML=`<main class="fatal"><h1>From0to990</h1><p>Impossible de charger l’application.</p><pre>${String(err.stack||err)}</pre></main>`});

async function init(){
  routeFromHash();
  const content=await fetch('./content/content.json').then(r=>r.json());state.toeicQuestions=content.questions.map(q=>({...q,domain:q.domain||'toeic'}));
  await initAudioBank();
  state.questions=[...allGeneralQuestions(),...state.toeicQuestions];
  await hydrate();initTheme(state.profile);
  state.auth=await loadAuthState();
  if(state.auth.enabled&&state.auth.user&&navigator.onLine){
    try{await syncNow();await hydrate();initTheme(state.profile)}catch(e){console.warn('Initial account sync deferred',e)}
  }
  await refreshSync();
  window.addEventListener('hashchange',()=>{routeFromHash();draw()});window.addEventListener('online',handleOnline);window.addEventListener('offline',draw);
  if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.register('./sw.js');navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());setInterval(()=>reg.update().catch(()=>{}),60000)}
  const restored=await restoreSession(state,{onFinish:sessionFinished,onExit:draw});if(restored)renderSession(app,state,{onFinish:sessionFinished,onExit:draw});else draw();
}
function routeFromHash(){const raw=(location.hash.replace('#/','')||'today').split('/');state.route=raw[0]||'today';state.param=raw[1]||null;if(state.route==='reset')state.authView='reset'}
async function hydrate(){
  const [p,a,s,sk,e]=await Promise.all([getProfile(),getAll(STORES.attempts),getAll(STORES.sessions),getAll(STORES.skills),getAll(STORES.errors)]);
  state.profile=p||{id:'me',displayName:'',targetScore:990,timePerDay:20,profileSetupComplete:false,placementComplete:false};if(state.profile.displayName==='Damien'&&!state.profile.profileSetupComplete){state.profile={...state.profile,displayName:''};await saveProfile(state.profile,{queue:false})}
  state.attempts=a.sort((x,y)=>String(x.createdAt).localeCompare(String(y.createdAt)));state.sessions=s.sort((x,y)=>String(y.startedAt).localeCompare(String(x.startedAt)));state.errors=e.sort((x,y)=>(y.count||0)-(x.count||0));
  state.skills=sk.length?sk:recomputeSkills(state.questions,state.attempts);
  if(!state.profile.cefrLevel){const c=cefrEstimate(state.questions,state.attempts);if(c)state.profile.cefrLevel=c}
  initTheme(state.profile);
}
async function refreshSync(){state.sync=await syncStatus()}

function ctx(){
  const score=estimatedScores(state.questions,state.attempts),cefr=state.profile.cefrLevel||cefrEstimate(state.questions,state.attempts),stats=computeStats(state),next=nextLessonId(state.profile,state.attempts,state.sessions),lq=lessonQuestions(next),done=new Set(state.attempts.filter(a=>a.correct).map(a=>a.questionId));
  return{score,cefr,stats,nextLesson:next,nextProgress:Math.round(lq.filter(q=>done.has(q.id)).length/Math.max(1,lq.length)*100),priorities:priorities(state.skills,3,{general:true}),gains:computeGains(state),weekGoal:(state.profile.timePerDay||20)*5}
}
function draw(){
  if(state.auth.enabled&&!state.auth.user){
    if(state.route==='reset')state.authView='reset';
    app.innerHTML=authScreen(state);bind();return;
  }
  if(state.activeSession)return renderSession(app,state,{onFinish:sessionFinished,onExit:draw});
  if(!state.profile?.profileSetupComplete){app.innerHTML=onboarding(state.profile);bind();return}
  const c=ctx();let body,title;
  switch(state.route){
    case'learn':body=learn(state,c);title='Apprendre';break;
    case'theme':body=theme(state.param);title='Thème';break;
    case'lesson':body=lessonIntro(state.param);title=LESSONS[state.param]?.title||'Leçon';break;
    case'practice':body=practice(state,c);title='Pratiquer';break;
    case'progress':body=progress(state,c);title='Progrès';break;
    case'vocab':body=vocab(state);title='Vocabulaire';break;
    case'profile':body=profile(state);title='Profil';break;
    case'admin':
      if(state.auth?.user?.role!=='admin'){state.route='today';body=today(state,c);title='Aujourd’hui';break}
      body=admin(state);title='Administration';
      if(state.adminUsers===null&&!state.adminLoading)loadAdminUsers(state.adminQuery);
      break;
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
  if(a==='set-theme'){const pref=applyTheme(el.dataset.theme);state.profile=await saveProfile({...state.profile,themePreference:pref});draw();return}
  if(a==='auth-refresh'){
    const next=await loadAuthState();state.auth=next;
    if(next.enabled&&!next.user){state.authView='login';draw();return}
    if(next.enabled&&next.user){try{await syncNow();await hydrate();await refreshSync()}catch{}}
    toast(next.enabled?'Comptes activés':'Service de comptes pas encore activé');draw();return
  }
  if(a==='auth-show-login'){state.authView='login';draw();return}
  if(a==='auth-show-register'){state.authView='register';draw();return}
  if(a==='auth-show-forgot'){state.authView='forgot';draw();return}
  if(a==='auth-register'){
    const username=document.getElementById('auth-username').value.trim(),email=document.getElementById('auth-email').value.trim(),password=document.getElementById('auth-password').value;
    if(username.length<3)throw new Error('Le pseudo doit contenir au moins 3 caractères');
    if(password.length<12)throw new Error('Le mot de passe doit contenir au moins 12 caractères');
    const data=await registerAccount({username,email,password,deviceId:await deviceId()});
    const themePreference=storedTheme();
    await clearUserData();
    await saveAuthSession(data);state.auth={...state.auth,enabled:true,user:data.user};
    state.profile=await saveProfile({id:'me',displayName:data.user.username||'',targetScore:990,timePerDay:20,profileSetupComplete:false,placementComplete:false,themePreference},{queue:true});
    try{await syncNow()}catch(e){console.warn('First account sync deferred',e)}
    await hydrate();await refreshSync();state.authView='login';location.hash='#/today';draw();return
  }
  if(a==='auth-login'){
    const identifier=document.getElementById('auth-identifier').value.trim(),password=document.getElementById('auth-password').value;
    const data=await loginAccount({identifier,password,deviceId:await deviceId()});
    await clearUserData();
    await saveAuthSession(data);state.auth={...state.auth,enabled:true,user:data.user};
    try{await syncNow()}catch(e){console.warn('Account sync deferred',e)}
    await hydrate();await refreshSync();state.authView='login';location.hash='#/today';draw();return
  }
  if(a==='auth-forgot'){const email=document.getElementById('auth-email').value.trim();if(!email)throw new Error('Entre ton adresse e-mail');await forgotPassword(email);state.authView='forgot-sent';draw();return}
  if(a==='auth-reset'){
    const p=document.getElementById('auth-password').value,p2=document.getElementById('auth-password2').value,token=resetTokenFromRoute(state);
    if(p.length<12)throw new Error('Le mot de passe doit contenir au moins 12 caractères');
    if(p!==p2)throw new Error('Les deux mots de passe ne correspondent pas');
    if(!token)throw new Error('Lien de réinitialisation invalide');
    await resetPassword(token,p);state.authView='login';location.hash='#/today';toast('Mot de passe réinitialisé');draw();return
  }
  if(a==='auth-logout'){
    await refreshSync();
    if(!navigator.onLine&&(state.sync?.pending||0)>0)throw new Error('Reconnecte-toi avant de te déconnecter afin de ne pas perdre une progression non synchronisée');
    if(navigator.onLine)try{await syncNow()}catch{}
    await logoutAccount();await clearUserData();state.auth={...state.auth,user:null};state.adminUsers=null;state.authView='login';await hydrate();draw();return
  }
  if(a==='admin-refresh'||a==='admin-search'){state.adminQuery=document.getElementById('admin-query')?.value.trim()||'';await loadAdminUsers(state.adminQuery);return}
  if(a==='admin-block'||a==='admin-unblock'){await adminSetUserStatus(el.dataset.userId,a==='admin-block'?'blocked':'active');await loadAdminUsers(state.adminQuery);return}
  if(a==='admin-delete'){const id=el.dataset.userId;if(state.adminConfirmId!==id){state.adminConfirmId=id;draw();return}await adminDeleteUser(id);state.adminConfirmId=null;await loadAdminUsers(state.adminQuery);return}
  if(a==='onboard-test'||a==='onboard-zero'){if(!await saveOnboarding())return;if(a==='onboard-zero'){state.profile=await saveProfile({...state.profile,cefrLevel:'pre-a1',placementComplete:true});location.hash='#/today';return}return startPlacement(0)}
  if(a==='lesson'){location.hash=`#/lesson/${el.dataset.id}`;return}
  if(a==='start-lesson')return start(lessonQuestions(el.dataset.id),`lesson:${el.dataset.id}`,LESSONS[el.dataset.id]?.title||'Leçon');
  if(a==='quick-general')return start(pickAdaptive(allGeneralQuestions().filter(q=>!q.id.includes('place-')),state.attempts,state.skills,12),'adaptive-general','Entraînement');
  if(a==='timed-general'){const n=Math.max(6,Math.round(Number(el.dataset.min||20)/2));return start(pickAdaptive(allGeneralQuestions().filter(q=>!q.id.includes('place-')),state.attempts,state.skills,n),'adaptive-general',`${el.dataset.min} minutes`)}
  if(a==='toeic-mini')return start(toeicDiagnosticPool(2),'toeic-mini','Mini-test TOEIC');
  if(a==='toeic-listening')return start(state.toeicQuestions.filter(q=>q.part<=4),'mock-listening','Listening complet');
  if(a==='toeic-reading')return start(state.toeicQuestions.filter(q=>q.part>=5),'mock-reading','Reading complet');
  if(a==='toeic-full')return start(state.toeicQuestions,'mock-full','TOEIC blanc');
  if(a==='save-profile'){state.profile=await saveProfile({...state.profile,displayName:document.getElementById('set-name').value.trim(),targetScore:990,timePerDay:Number(document.getElementById('set-time').value||20),themePreference:state.profile.themePreference||storedTheme()});toast('Profil enregistré');draw();return}
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
function toeicDiagnosticPool(perPart=4){
  const out=[],recentIds=new Set(state.attempts.slice(-120).map(a=>a.questionId));
  for(let p=1;p<=7;p++){
    const pool=state.toeicQuestions.filter(q=>q.part===p);
    const fresh=pool.filter(q=>!recentIds.has(q.id));
    const old=pool.filter(q=>recentIds.has(q.id));
    const chosen=[...randomSample(fresh,Math.min(perPart,fresh.length))];
    if(chosen.length<perPart){
      const used=new Set(chosen.map(q=>q.id));
      chosen.push(...randomSample(old.filter(q=>!used.has(q.id)),perPart-chosen.length));
    }
    out.push(...chosen);
  }
  return out
}

async function handleOnline(){
  try{
    state.auth=await loadAuthState();
    if(state.auth.enabled&&state.auth.user){await syncNow();await hydrate();await refreshSync()}
    else await refreshSync();
  }catch(e){console.warn('Online auth refresh deferred',e)}
  draw();
}
async function loadAdminUsers(query=''){
  if(state.auth?.user?.role!=='admin')return;
  state.adminLoading=true;draw();
  try{const data=await adminListUsers(query);state.adminUsers=data.users||[]}
  catch(e){toast(e.message||'Impossible de charger les utilisateurs')}
  finally{state.adminLoading=false;draw()}
}
async function sync(silent=false){
  if(state.auth.enabled&&!state.auth.user)return;
  try{await syncNow();await refreshSync();if(!silent)toast('Progression synchronisée')}
  catch(e){if(!silent)toast('Synchronisation différée')}
  draw()
}
function toast(message){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=message;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)}
