import {LESSONS} from './curriculum.js';
import {SKILL_LABELS} from './adaptive.js';
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const pct=n=>Math.max(0,Math.min(100,Math.round(n||0)));
const stat=(icon,value,label)=>`<div class="stat-tile"><span>${icon}</span><strong>${value}</strong><small>${label}</small></div>`;
export function today(state,c){
 const L=LESSONS[c.nextLesson],score=c.score;
 return `<div class="today-layout">
 <section class="today-primary">
  <div class="hello"><div><span class="subtle">Bonjour${state.profile?.displayName?' '+esc(state.profile.displayName):''}</span><h2>${c.cefr?`Niveau ${c.cefr.toUpperCase()}`:'On commence ?'}</h2></div><div class="streak"><span>🔥</span><strong>${c.stats.streak}</strong><small>jours</small></div></div>
  <article class="continue-card">
   <div class="continue-top"><span class="level-chip">${L.level.toUpperCase()}</span><span>${L.minutes} min</span></div>
   <h3>${esc(L.title)}</h3><p>${esc(L.goal)}</p>
   <div class="bar"><span style="width:${c.nextProgress}%"></span></div>
   <button class="primary-action" data-act="lesson" data-id="${c.nextLesson}">Continuer</button>
  </article>
  <section class="content-section"><div class="section-heading"><h3>Cette semaine</h3><button data-nav="progress">Voir les progrès</button></div>
   <div class="stat-grid">${stat('⏱',c.stats.weekMinutes,'minutes')}${stat('✓',c.stats.lessons,'leçons')}${stat('★',c.stats.xp,'XP')}${stat('Aa',c.stats.words,'mots vus')}</div>
  </section>
 </section>
 <aside class="today-secondary">
  <section class="content-section"><div class="section-heading"><h3>À renforcer</h3></div>
   ${c.priorities.length?c.priorities.slice(0,3).map((p,i)=>`<div class="priority-row"><span class="priority-rank">${i+1}</span><div><strong>${esc(SKILL_LABELS[p.id]||p.id)}</strong><small>${p.attempts||0} essais · ${pct((p.accuracy||0)*100)}%</small></div></div>`).join(''):'<div class="empty-state">Le test de niveau déterminera tes priorités.</div>'}
  </section>
  <section class="content-section toeic-summary"><div><span class="subtle">Objectif TOEIC</span><h3>${score.evaluated?score.total+'/990':'À évaluer'}</h3></div><button class="text-action" data-act="toeic-mini">Mini-test</button></section>
 </aside></div>`;
}
export function practice(state,c){
 return `<div class="practice-layout">
 <section class="content-section practice-feature"><span class="header-kicker">ADAPTATIF</span><h2>La bonne séance, maintenant.</h2><p>Révision, anglais pratique et compétences faibles sont mélangés automatiquement.</p><button class="primary-action" data-act="quick-general">Démarrer 12 questions</button></section>
 <section class="content-section"><div class="section-heading"><h3>Durée</h3></div><div class="duration-row">${[10,20,30,45,60].map(n=>`<button data-act="timed-general" data-min="${n}"><strong>${n}</strong><small>min</small></button>`).join('')}</div></section>
 <section class="content-section"><div class="section-heading"><h3>TOEIC</h3></div><div class="practice-options">
  <button data-act="toeic-mini"><strong>Mini-test</strong><small>Rapide, mixte</small></button>
  <button data-act="toeic-listening"><strong>Listening</strong><small>Parts 1–4</small></button>
  <button data-act="toeic-reading"><strong>Reading</strong><small>Parts 5–7</small></button>
  <button data-act="toeic-full"><strong>Blanc complet</strong><small>200 questions</small></button>
 </div></section></div>`;
}
export function profile(state){
 return `<div class="profile-layout">
 <section class="profile-card"><div class="profile-avatar">${esc((state.profile.displayName||'?').slice(0,1).toUpperCase())}</div><div><h2>${esc(state.profile.displayName||'Mon profil')}</h2><p>${state.profile.cefrLevel?state.profile.cefrLevel.toUpperCase():'Niveau non évalué'} · objectif ${state.profile.targetScore||990}</p></div></section>
 <section class="settings-list">
  <label><span>Prénom ou pseudo</span><input id="set-name" value="${esc(state.profile.displayName||'')}"></label>
  <label><span>Objectif TOEIC</span><input id="set-target" type="number" min="10" max="990" value="${state.profile.targetScore||990}"></label>
  <label><span>Temps par jour</span><select id="set-time">${[10,15,20,30,45,60].map(n=>`<option ${n===(state.profile.timePerDay||20)?'selected':''}>${n}</option>`).join('')}</select></label>
  <button class="primary-action" data-act="save-profile">Enregistrer</button>
 </section>
 <section class="settings-list"><div><span>Synchronisation</span><small>${navigator.onLine?'En ligne':'Hors ligne'} · ${state.sync?.pending||0} en attente</small></div><button class="secondary-action" data-act="sync">Synchroniser maintenant</button></section>
 </div>`;
}
