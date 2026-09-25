import {LEVELS,THEMES,LESSONS} from './curriculum.js';
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const icons={survival:'✦',identity:'☺',numbers:'123',colors:'◐',food:'☕',hotel:'⌂',travel:'✈',shopping:'▢',smalltalk:'◌',work:'▣',idioms:'“”',phrasal:'↔',collocations:'⛓',pronunciation:'≋',falsefriends:'!'};
export function learn(state,c){
 const levels=LEVELS.slice(0,6);
 return `<div class="learn-head"><div><h2>Parcours d’anglais</h2><p>Suis la progression recommandée ou ouvre directement une situation utile.</p></div><span class="level-badge">${c.cefr?c.cefr.toUpperCase():'À évaluer'}</span></div>
 <div class="path-list">${levels.map(level=>`<section class="path-level ${c.cefr===level.id?'current':''}">
  <div class="level-rail"><span>${level.label}</span><i></i></div>
  <div class="level-content"><div class="level-title"><div><h3>${esc(level.title)}</h3><p>${esc(level.description)}</p></div><span>${esc(level.range)}</span></div>
   <div class="theme-grid">${THEMES.filter(t=>t.level===level.id).map(t=>`<button class="theme-card" data-nav="theme" data-theme="${t.id}"><div class="theme-icon">${icons[t.id]||'•'}</div><div><strong>${esc(t.title)}</strong><small>${esc(t.summary)}</small></div><span class="chev">›</span></button>`).join('')||'<div class="coming">Modules avancés à venir.</div>'}</div>
  </div></section>`).join('')}</div>`;
}
export function theme(id){
 const t=THEMES.find(x=>x.id===id);if(!t)return'<div class="empty-state">Thème introuvable.</div>';
 return `<div class="theme-page"><button class="back-link" data-nav="learn">‹ Apprendre</button><div class="theme-hero"><div class="theme-icon big">${icons[t.id]||'•'}</div><div><span class="level-chip">${t.level.toUpperCase()}</span><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p></div></div>
 <div class="lesson-list">${t.lessons.map((id,i)=>{const l=LESSONS[id];return`<button class="lesson-row" data-act="lesson" data-id="${id}"><span class="lesson-num">${i+1}</span><div><strong>${esc(l.title)}</strong><small>${esc(l.goal)} · ${l.minutes} min</small></div><span class="chev">›</span></button>`}).join('')}</div></div>`;
}
export function vocab(){
 const set=THEMES.filter(t=>['idioms','phrasal','collocations','falsefriends','work','travel','food','hotel'].includes(t.id));
 return `<div class="learn-head"><div><h2>Vocabulaire & expressions</h2><p>Apprends par situation, puis revois les mots dans de nouveaux contextes.</p></div></div><div class="theme-grid vocab-grid">${set.map(t=>`<button class="theme-card" data-nav="theme" data-theme="${t.id}"><div class="theme-icon">${icons[t.id]||'•'}</div><div><strong>${esc(t.title)}</strong><small>${esc(t.summary)}</small></div><span class="chev">›</span></button>`).join('')}</div>`;
}
