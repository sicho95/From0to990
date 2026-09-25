const TABS=[
 ['today','Aujourd’hui','⌂'],
 ['learn','Apprendre','▤'],
 ['practice','Pratiquer','▶'],
 ['progress','Progrès','◫'],
 ['profile','Profil','○']
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function items(route){
 return TABS.map(([id,label,icon])=>`<button data-nav="${id}" class="${route===id?'active':''}" aria-label="${label}"><span class="nav-icon">${icon}</span><span class="nav-label">${label}</span></button>`).join('');
}
export function shell(state,body,title,score){
 const collapsed=localStorage.getItem('navCollapsed')==='1';
 const scoreText=score?.evaluated?`${score.total}/990`:'À évaluer';
 return `<div class="adaptive-shell ${collapsed?'nav-collapsed':''}">
 <aside class="side-nav glass-nav">
   <div class="brand-row"><div class="app-mark">990</div><div class="brand-copy"><strong>From0to990</strong><small>English · TOEIC</small></div><button class="collapse-btn" data-act="toggle-nav" aria-label="Replier le menu">‹</button></div>
   <nav>${items(state.route)}</nav>
   <div class="side-extra"><button data-nav="vocab"><span class="nav-icon">Aa</span><span class="nav-label">Vocabulaire</span></button></div>
   <div class="side-footer"><span class="status-dot ${navigator.onLine?'':'offline'}"></span><span>${navigator.onLine?'Synchronisé':'Hors ligne'}</span></div>
 </aside>
 <main class="app-main">
   <header class="app-header"><div><span class="header-kicker">${state.profile?.cefrLevel?state.profile.cefrLevel.toUpperCase():'PARCOURS PERSONNALISÉ'}</span><h1>${esc(title)}</h1></div><button class="score-pill" data-nav="progress">${scoreText}</button></header>
   <nav class="tablet-tabs glass-nav">${items(state.route)}</nav>
   <div class="page">${body}</div>
 </main>
 <nav class="bottom-tabs glass-nav">${items(state.route)}</nav>
 </div>`;
}
export function onboarding(profile={}){
 return `<div class="onboarding-wrap"><section class="onboarding-card">
 <div class="app-mark large">990</div>
 <span class="header-kicker">FROM ZERO TO FLUENT</span>
 <h1>Ton anglais, du premier mot au 990.</h1>
 <p>Crée ton profil d’apprentissage. Le test initial adapte immédiatement le parcours à ton niveau réel.</p>
 <div class="form-list">
   <label><span>Prénom ou pseudo</span><input id="on-name" value="${esc(profile.displayName||'')}" placeholder="Damien"></label>
   <label><span>Objectif TOEIC</span><input id="on-target" type="number" min="10" max="990" step="5" value="${profile.targetScore||990}"></label>
   <label><span>Temps par jour</span><select id="on-time">${[10,15,20,30,45,60].map(n=>`<option ${n===(profile.timePerDay||20)?'selected':''} value="${n}">${n} min</option>`).join('')}</select></label>
 </div>
 <button class="primary-action full" data-act="onboard-test">Évaluer mon niveau</button>
 <button class="secondary-action full" data-act="onboard-zero">Je pars de zéro</button>
 <p class="privacy">La version actuelle est mono-utilisateur. Ton profil et ta progression sont conservés localement puis synchronisés avec ton backend.</p>
 </section></div>`;
}
