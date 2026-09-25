import {LEVELS,THEMES,LESSONS,LESSON_GUIDES} from './curriculum.js';
import {esc,svg,themeGlyph} from './icons.js';
const themeCard=t=>`<button class="theme-card" data-nav="theme" data-theme="${t.id}"><div class="theme-icon">${themeGlyph(t.id)}</div><div><strong>${esc(t.title)}</strong><small>${esc(t.summary)}</small></div>${svg('chevron')}</button>`;
export function learn(state,ctx){const byLevel=LEVELS.slice(0,6).map(l=>({...l,themes:THEMES.filter(t=>t.level===l.id)}));return `<div class="learn-head"><div><h2>Parcours d’anglais</h2><p>Progression recommandée ou travail ciblé par thème.</p></div><div class="level-badge">${ctx.cefr?ctx.cefr.toUpperCase():'À évaluer'}</div></div><div class="path-list">${byLevel.map(level=>`<section class="path-level ${ctx.cefr===level.id?'current':''}"><div class="level-rail"><span>${level.label}</span><i></i></div><div class="level-content"><div class="level-title"><div><h3>${esc(level.title)}</h3><p>${esc(level.description)}</p></div><span>${esc(level.range)}</span></div><div class="theme-grid">${level.themes.map(themeCard).join('')||'<div class="coming">Modules avancés en cours d’ajout.</div>'}</div></div></section>`).join('')}</div>`}
export function theme(id){const t=THEMES.find(x=>x.id===id);if(!t)return'<div class="empty-state">Thème introuvable.</div>';return `<div class="theme-page"><button class="back-link" data-nav="learn">${svg('back')} Apprendre</button><div class="theme-hero"><div class="theme-icon big">${themeGlyph(t.id)}</div><div><span class="level-chip">${t.level.toUpperCase()}</span><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p></div></div><div class="lesson-list">${t.lessons.map((id,i)=>{const L=LESSONS[id];return `<button class="lesson-row" data-act="lesson" data-id="${id}"><span class="lesson-num">${i+1}</span><div><strong>${esc(L.title)}</strong><small>${esc(L.goal)} · ${L.minutes} min</small></div>${svg('chevron')}</button>`}).join('')}</div></div>`}
export function vocab(){const featured=THEMES.filter(t=>['idioms','phrasal','collocations','falsefriends','work','travel','food','hotel'].includes(t.id));return `<div class="learn-head"><div><h2>Vocabulaire & expressions</h2><p>Travaille par situation ou par famille d’expressions.</p></div></div><div class="theme-grid vocab-grid">${featured.map(themeCard).join('')}</div>`}

export function lessonIntro(id){
  const L=LESSONS[id],g=LESSON_GUIDES[id];if(!L)return'<div class="empty-state">Leçon introuvable.</div>';
  const examples=(g?.examples||L.examples||[]).slice(0,3);
  return `<div class="lesson-intro-page"><button class="back-link" data-nav="learn">${svg('back')} Parcours</button>
    <section class="lesson-intro-hero"><span class="level-chip">${L.level.toUpperCase()}</span><h2>${esc(L.title)}</h2><p>${esc(L.goal)}</p><small>${L.minutes} min · explication + pratique</small></section>
    <section class="lesson-teach-card"><span class="eyebrow">CE QUE TU VAS APPRENDRE</span><p class="lesson-intro-text">${esc(g?.intro||L.goal)}</p></section>
    <div class="lesson-teach-grid">
      <section class="lesson-teach-card"><h3>Règle simple</h3><p>${esc(g?.rule||'Observe la structure et les exemples avant de pratiquer.')}</p></section>
      <section class="lesson-teach-card tip-card"><h3>Tip pratique</h3><p>${esc(g?.tip||'Mémorise des phrases complètes plutôt que des mots isolés.')}</p></section>
    </div>
    <section class="lesson-teach-card"><h3>Phrases clés</h3><div class="key-phrase-list">${examples.map(x=>`<div><strong>${esc(x)}</strong></div>`).join('')}</div></section>
    <section class="lesson-teach-card"><h3>Vocabulaire</h3><div class="word-chips">${(L.words||[]).map(w=>`<span>${esc(w)}</span>`).join('')}</div></section>
    <button class="primary-action full lesson-start" data-act="start-lesson" data-id="${id}">Commencer les exercices</button>
  </div>`;
}
