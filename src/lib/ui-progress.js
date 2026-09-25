import {LEVELS} from './curriculum.js';
import {SKILL_LABELS} from './adaptive.js';
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function progress(state,c){
 const idx=Math.max(-1,LEVELS.findIndex(x=>x.id===c.cefr)),toeic=c.score.evaluated?Math.round(c.score.total/9.9):0;
 return `<div class="progress-layout">
 <section class="progress-hero"><div class="ring" style="--p:${c.stats.weekGoalPct}"><div><strong>${c.stats.weekMinutes}</strong><small>/ ${c.weekGoal} min</small></div></div><div><span class="header-kicker">CETTE SEMAINE</span><h2>${c.stats.weekGoalPct>=100?'Objectif atteint !':'Continue comme ça'}</h2><p>${c.stats.streak} jour${c.stats.streak>1?'s':''} de série · ${c.stats.xp} XP</p></div></section>
 <div class="dashboard-grid">
  <section class="content-section"><div class="section-heading"><h3>Niveau d’anglais</h3><span>${c.cefr?c.cefr.toUpperCase():'À évaluer'}</span></div><div class="cefr-track">${LEVELS.slice(0,6).map((l,i)=>`<div class="${i<=idx?'done':''} ${l.id===c.cefr?'current':''}"><span>${l.label}</span><i></i></div>`).join('')}</div></section>
  <section class="content-section"><div class="section-heading"><h3>Vers 990</h3><span>${c.score.evaluated?c.score.total+'/990':'Non évalué'}</span></div><div class="bar large"><span style="width:${toeic}%"></span></div><div class="split-stats"><div><strong>${c.score.listening??'—'}</strong><small>Listening</small></div><div><strong>${c.score.reading??'—'}</strong><small>Reading</small></div></div><button class="text-action" data-act="toeic-mini">Actualiser l’estimation</button></section>
  <section class="content-section wide"><div class="section-heading"><h3>Ce que tu as amélioré</h3></div>${c.gains.length?c.gains.map(g=>`<div class="gain-row"><div><strong>${esc(SKILL_LABELS[g.id]||g.id)}</strong><small>${g.attempts} essais</small></div><span>+${g.delta}%</span></div>`).join(''):'<div class="empty-state">Tes progrès apparaîtront après quelques séances.</div>'}</section>
  <section class="content-section"><div class="section-heading"><h3>Vocabulaire</h3></div><div class="big-stat">${c.stats.words}</div><p>mots et expressions rencontrés</p><button class="text-action" data-nav="vocab">Travailler par thème</button></section>
  <section class="content-section"><div class="section-heading"><h3>Régularité</h3></div><div class="split-stats"><div><strong>${c.stats.lessons}</strong><small>leçons</small></div><div><strong>${c.stats.sessions}</strong><small>séances</small></div></div></section>
 </div></div>`;
}
