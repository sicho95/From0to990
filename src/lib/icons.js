export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pct=n=>Math.max(0,Math.min(100,Math.round(n||0)));
export const svg=name=>{const p={
home:'<path d="M3 10.7 12 3l9 7.7V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23zM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z"/>',
play:'<path d="m8 5 11 7-11 7z"/>',chart:'<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',person:'<circle cx="12" cy="7" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',
flame:'<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-3 5-2 8 1 4 3 7 7 7Z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',words:'<path d="M4 5h16M4 10h10M4 15h16M4 20h8"/>',
chevron:'<path d="m9 5 7 7-7 7"/>',back:'<path d="m15 5-7 7 7 7"/>',sync:'<path d="M20 7h-5V2M4 17h5v5M19 12a7 7 0 0 0-12-5L4 10M5 12a7 7 0 0 0 12 5l3-3"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'};return `<svg class="sf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p[name]||p.star}</svg>`}
export const themeGlyph=id=>({survival:'✦',identity:'☺',numbers:'123',colors:'◐',food:'☕',hotel:'⌂',travel:'✈',shopping:'▢',smalltalk:'◌',work:'▣',idioms:'“”',phrasal:'↔',collocations:'⛓',pronunciation:'≋',falsefriends:'!'}[id]||'•');
