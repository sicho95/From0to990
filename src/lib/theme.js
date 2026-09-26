export const THEME_VALUES=['system','light','dark'];

function valid(value){return THEME_VALUES.includes(value)?value:'dark'}
export function storedTheme(){return valid(localStorage.getItem('themePreference')||'dark')}
export function resolvedTheme(pref=storedTheme()){
  const p=valid(pref);
  if(p==='system')return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  return p;
}
export function applyTheme(pref,{persist=true}={}){
  const p=valid(pref);
  if(persist)localStorage.setItem('themePreference',p);
  const root=document.documentElement;
  if(p==='system')delete root.dataset.theme;else root.dataset.theme=p;
  const resolved=resolvedTheme(p);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#090b0f':'#f2f2f7');
  return p;
}
export function initTheme(profile){
  const pref=valid(profile?.themePreference||storedTheme());
  applyTheme(pref);
  const mq=matchMedia('(prefers-color-scheme: dark)');
  if(!globalThis.__from0to990ThemeListener){
    globalThis.__from0to990ThemeListener=()=>{if(storedTheme()==='system')applyTheme('system',{persist:false})};
    mq.addEventListener?.('change',globalThis.__from0to990ThemeListener);
  }
  return pref;
}
