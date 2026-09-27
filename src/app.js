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
import {loadAuthState,registerAccount,loginAccount,saveAuthSession,updateCachedAuthUser,logoutAccount,forgotPassword,changePassword,adminListUsers,adminResetRequests,adminTemporaryPassword,adminSetUserStatus,adminDeleteUser} from './lib/auth.js';
import {authScreen} from './lib/ui-auth.js';
import {admin} from './lib/ui-admin.js';

const app=document.getElementById('app');
const state={route:'today',param:null,toeicQuestions:[],questions:[],profile:null,attempts:[],sessions:[],skills:[],errors:[],sync:{},activeSession:null,auth:{enabled:false,user:null},authView:'login',adminUsers:null,adminRequests:[],adminPendingCount:0,adminLoading:false,adminQuery:'',adminConfirmId:null,temporaryDisplay:null};
const actionLocks=new Set();
const BUSY_LABELS={
  'auth-login':'Connexion…','auth-register':'Création…','auth-forgot':'Envoi…','auth-change-password':'Enregistrement…','auth-logout':'Déconnexion…',
  'sync':'Synchronisation…','admin-refresh':'Actualisation…','admin-search':'Recherche…','admin-block':'Traitement…','admin-unblock':'Traitement…','admin-delete':'Suppression…','admin-temporary':'Génération…',
  'onboard-test':'Préparation…','onboard-zero':'Préparation…','start-lesson':'Ouverture…'
};
const PASSIVE_ACTIONS=new Set(['toggle-nav','set-theme','auth-refresh','auth-show-login','auth-show-register','auth-show-forgot','auth-change-cancel','temporary-close']);

init().catch(err=>{console.error(err);app.innerHTML=`<main class="fatal"><h1>From0to990</h1><p>Impossible de charger l’application.</p><pre>${String(err.stack||err)}</pre></main>`});

async function init(){
  routeFromHash();
  const content=await fetch('./content/content.json').then(r=>r.json());state.toeicQuestions=content.questions.map(q=>({...q,domain:q.domain||'toeic'}));
  await initAudioBank();
  state.questions=[...allGeneralQuestions(),...state.toeicQuestions];
  await hydrate();initTheme(state.profile);
  state.auth=await loadAuthState();
  if(state.auth.user?.role==='admin'&&!state.auth.offline)await refreshAdminNotifications().catch(()=>{});
  if(state.auth.enabled&&state.auth.user&&!state.auth.user.mustChangePassword&&navigator.onLine){
    try{await syncNow();await hydrate();initTheme(state.profile)}catch(e){console.warn('Initial account sync deferred',e)}
  }
  await refreshSync();
  window.addEventListener('hashchange',()=>{routeFromHash();draw()});window.addEventListener('online',handleOnline);window.addEventListener('offline',draw);
  setInterval(()=>{if(state.auth.user?.role==='admin'&&navigator.onLine)refreshAdminNotifications().then(draw).catch(()=>{})},60000);
  if('serviceWorker'in navigator){const reg=await navigator.serviceWorker.register('./sw.js');navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());setInterval(()=>reg.update().catch(()=>{}),60000)}
  const restored=(!state.auth.enabled||state.auth.user&&!state.auth.user.mustChangePassword)&&await restoreSession(state,{onFinish:sessionFinished,onExit:draw});if(restored)renderSession(app,state,{onFinish:sessionFinished,onExit:draw});else draw();
}
function routeFromHash(){const raw=(location.hash.replace('#/','')||'today').split('/');state.route=raw[0]||'today';state.param=raw[1]||null}
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
    app.innerHTML=authScreen(state);bind();return;
  }
  if(state.auth.user?.mustChangePassword){state.authView='change-required';app.innerHTML=authScreen(state);bind();return}
  if(state.authView==='change-voluntary'){app.innerHTML=authScreen(state);bind();return}
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
  if(app.dataset.interactionsBound==='1')return;
  app.dataset.interactionsBound='1';
  app.addEventListener('click',event=>{
    const el=event.target.closest?.('[data-nav],[data-act]');
    if(!el||!app.contains(el))return;
    event.preventDefault();
    if(el.dataset.nav){navigate(el);return}
    void runAction(el);
  });
  app.addEventListener('keydown',event=>{
    if(event.key!=='Enter'||event.isComposing||!event.target.closest?.('input'))return;
    const act=authSubmitAction();
    if(!act)return;
    const el=app.querySelector(`[data-act="${act}"]`);
    if(!el)return;
    event.preventDefault();
    void runAction(el);
  });
}
function navigate(el){
  const r=el.dataset.nav;
  if(r==='theme')location.hash=`#/theme/${el.dataset.theme}`;
  else location.hash=`#/${r}`;
}
function authSubmitAction(){
  if(state.authView==='register')return'auth-register';
  if(state.authView==='forgot')return'auth-forgot';
  if(state.authView==='change-required'||state.authView==='change-voluntary')return'auth-change-password';
  if(state.auth.enabled&&!state.auth.user)return'auth-login';
  return null;
}
function actionKey(el){return[el.dataset.act,el.dataset.userId,el.dataset.id,el.dataset.min,el.dataset.theme].filter(Boolean).join(':')}
function setActionBusy(el,busy,act){
  if(busy){
    el.dataset.busy='1';el.disabled=true;el.setAttribute('aria-busy','true');
    if(BUSY_LABELS[act]){el.dataset.busyHtml=el.innerHTML;el.textContent=BUSY_LABELS[act]}
  }else{
    el.dataset.busy='0';el.disabled=false;el.removeAttribute('aria-busy');
    if(el.dataset.busyHtml!==undefined){el.innerHTML=el.dataset.busyHtml;delete el.dataset.busyHtml}
  }
}
async function runAction(el){
  const act=el.dataset.act;
  if(!act||el.disabled)return;
  const key=actionKey(el);
  if(actionLocks.has(key))return;
  actionLocks.add(key);
  const busy=!PASSIVE_ACTIONS.has(act);
  if(busy)setActionBusy(el,true,act);
  try{await action(el)}
  catch(e){console.error(e);toast(e.message||String(e))}
  finally{
    actionLocks.delete(key);
    if(busy&&el.isConnected)setActionBusy(el,false,act);
  }
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
    if(data.user.role==='admin')await refreshAdminNotifications();
    state.profile=await saveProfile({id:'me',displayName:data.user.username||'',targetScore:990,timePerDay:20,profileSetupComplete:false,placementComplete:false,themePreference},{queue:true});
    try{await syncNow()}catch(e){console.warn('First account sync deferred',e)}
    await hydrate();await refreshSync();state.authView='login';location.hash='#/today';draw();return
  }
  if(a==='auth-login'){
    const identifier=document.getElementById('auth-identifier').value.trim(),password=document.getElementById('auth-password').value;
    const data=await loginAccount({identifier,password,deviceId:await deviceId()});
    await clearUserData();
    await saveAuthSession(data);state.auth={...state.auth,enabled:true,user:data.user};
    if(data.user.role==='admin')await refreshAdminNotifications();
    if(!data.user.mustChangePassword)try{await syncNow()}catch(e){console.warn('Account sync deferred',e)}
    await hydrate();await refreshSync();state.authView='login';location.hash='#/today';draw();return
  }
  if(a==='auth-forgot'){const email=document.getElementById('auth-email').value.trim();if(!email)throw new Error('Entre ton adresse e-mail');await forgotPassword(email);state.authView='forgot-sent';draw();return}
  if(a==='auth-show-change'){state.authView='change-voluntary';draw();return}
  if(a==='auth-change-cancel'){state.authView='login';draw();return}
  if(a==='auth-change-password'){
    const p=document.getElementById('auth-password').value,p2=document.getElementById('auth-password2').value,currentPassword=document.getElementById('auth-current-password')?.value;
    if(p.length<12)throw new Error('Le mot de passe doit contenir au moins 12 caractères');
    if(p!==p2)throw new Error('Les deux mots de passe ne correspondent pas');
    const result=await changePassword(p,currentPassword);state.auth.user=result.user;await updateCachedAuthUser(result.user);state.authView='login';
    if(navigator.onLine){await syncNow();await hydrate();await refreshSync()}
    location.hash='#/today';toast('Mot de passe changé');draw();return
  }
  if(a==='auth-logout'){
    await refreshSync();
    if(!navigator.onLine&&(state.sync?.pending||0)>0)throw new Error('Reconnecte-toi avant de te déconnecter afin de ne pas perdre une progression non synchronisée');
    if(navigator.onLine)try{await syncNow()}catch{}
    await logoutAccount();await clearUserData();state.auth={...state.auth,user:null};state.adminUsers=null;state.authView='login';await hydrate();draw();return
  }
  if(a==='admin-refresh'||a==='admin-search'){state.adminQuery=document.getElementById('admin-query')?.value.trim()||'';await loadAdminUsers(state.adminQuery);return}
  if(a==='admin-focus-user'){const u=state.adminUsers?.find(x=>x.id===el.dataset.userId);if(!u){state.adminQuery=state.adminRequests?.find(x=>x.userId===el.dataset.userId)?.email||'';await loadAdminUsers(state.adminQuery)}document.getElementById(`user-${el.dataset.userId}`)?.scrollIntoView({behavior:'smooth'});return}
  if(a==='admin-block'||a==='admin-unblock'){await adminSetUserStatus(el.dataset.userId,a==='admin-block'?'blocked':'active');await loadAdminUsers(state.adminQuery);return}
  if(a==='admin-delete'){const id=el.dataset.userId;if(state.adminConfirmId!==id){state.adminConfirmId=id;draw();return}await adminDeleteUser(id);state.adminConfirmId=null;await loadAdminUsers(state.adminQuery);return}
  if(a==='admin-temporary'){const id=el.dataset.userId,u=state.adminUsers?.find(x=>x.id===id);if(!u)return;const result=await adminTemporaryPassword(id);state.temporaryDisplay={password:result.temporaryPassword,email:u.email,username:u.username};await loadAdminUsers(state.adminQuery);return}
  if(a==='temporary-copy'){await navigator.clipboard.writeText(state.temporaryDisplay?.password||'');toast('Mot de passe provisoire copié');return}
  if(a==='temporary-email'){const t=state.temporaryDisplay;if(!t)return;const subject='From0to990 — Réinitialisation de votre mot de passe',body=`Bonjour,\n\nUne réinitialisation du mot de passe de votre compte From0to990 a été effectuée.\n\nPseudo : ${t.username}\n\nMot de passe provisoire :\n${t.password}\n\nCe mot de passe est valable pendant 24 heures. Lors de votre prochaine connexion, vous devrez choisir immédiatement un nouveau mot de passe personnel, sans date d’expiration.\n\nSi vous n’êtes pas à l’origine de cette demande, contactez l’administrateur.\n\nFrom0to990`;location.href=`mailto:${encodeURIComponent(t.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;return}
  if(a==='temporary-close'){state.temporaryDisplay=null;draw();return}
  if(a==='onboard-test'){
    if(!await saveOnboarding())return;
    return startPlacement(0)
  }
  if(a==='onboard-zero'){
    const name=document.getElementById('on-name')?.value.trim()||state.auth?.user?.username||state.profile?.displayName||'';
    if(!name){toast('Saisis un prénom ou un pseudo');return}
    const timePerDay=Number(document.getElementById('on-time')?.value||state.profile?.timePerDay||20);
    state.profile=await saveProfile({
      ...state.profile,
      displayName:name,
      targetScore:990,
      timePerDay,
      cefrLevel:'pre-a1',
      placementComplete:true,
      profileSetupComplete:true
    });
    state.route='today';state.param=null;
    history.replaceState(null,'',location.pathname+location.search+'#/today');
    draw();
    sync(true);
    return
  }
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
  try{const [data,requests]=await Promise.all([adminListUsers(query),adminResetRequests()]);state.adminUsers=data.users||[];state.adminRequests=requests.requests||[];state.adminPendingCount=requests.pendingCount||0}
  catch(e){toast(e.message||'Impossible de charger les utilisateurs')}
  finally{state.adminLoading=false;draw()}
}
async function refreshAdminNotifications(){const data=await adminResetRequests();state.adminRequests=data.requests||[];state.adminPendingCount=data.pendingCount||0}
async function sync(silent=false){
  if(state.auth.enabled&&!state.auth.user)return;
  try{await syncNow();await refreshSync();if(!silent)toast('Progression synchronisée')}
  catch(e){if(!silent)toast('Synchronisation différée')}
  draw()
}
function toast(message){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}t.textContent=message;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)}
