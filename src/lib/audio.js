let audioBank={};
let activeAudio=null;

function allVoices(){return speechSynthesis.getVoices?.()||[];}
function keyFor(item){return `${item.locale||'en-GB'}|${item.gender||'female'}|${String(item.text||'').trim()}`;}
function pickVoice(locale='en-US',gender){
  let vs=allVoices().filter(v=>v.lang?.toLowerCase().startsWith(locale.toLowerCase().slice(0,2)));
  const exact=vs.filter(v=>v.lang?.toLowerCase()===locale.toLowerCase());if(exact.length)vs=exact;
  const female=/(samantha|victoria|karen|zira|ava|female|susan|emma)/i;
  const male=/(daniel|alex|fred|aaron|male|tom|george)/i;
  if(gender==='female'){const x=vs.find(v=>female.test(v.name));if(x)return x;}
  if(gender==='male'){const x=vs.find(v=>male.test(v.name));if(x)return x;}
  return vs[0]||allVoices()[0]||null;
}

export async function initAudioBank(url='./audio/audio-manifest.json'){
  try{
    const r=await fetch(url,{cache:'no-cache'});
    if(!r.ok)throw new Error(`Audio manifest HTTP ${r.status}`);
    const data=await r.json();
    audioBank=data.files||{};
    return {loaded:true,count:Object.keys(audioBank).length,engine:data.engine||null};
  }catch{
    audioBank={};
    return {loaded:false,count:0};
  }
}

export function stopAudio(){
  if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0}catch{} activeAudio=null;}
  if('speechSynthesis' in window)speechSynthesis.cancel();
}

export async function speak(text,{locale='en-US',rate=.95,gender='female'}={}){
  if(!('speechSynthesis' in window))throw new Error('Synthèse vocale indisponible');
  stopAudio();
  return new Promise((resolve,reject)=>{
    const u=new SpeechSynthesisUtterance(text);u.lang=locale;u.rate=rate;u.voice=pickVoice(locale,gender);
    u.onend=resolve;u.onerror=e=>reject(e.error||e);speechSynthesis.speak(u);
  });
}

function playFile(url){
  return new Promise(async(resolve,reject)=>{
    const a=new Audio(url);activeAudio=a;
    a.onended=()=>{if(activeAudio===a)activeAudio=null;resolve()};
    a.onerror=()=>{if(activeAudio===a)activeAudio=null;reject(new Error('Audio indisponible'))};
    try{await a.play()}catch(e){if(activeAudio===a)activeAudio=null;reject(e)}
  });
}

async function playSegment(item){
  const bank=audioBank[keyFor(item)];
  if(bank?.url){
    try{await playFile(new URL(bank.url,document.baseURI).href);return}catch{}
  }
  await speak(item.text,{locale:item.locale||'en-GB',rate:item.rate||.95,gender:item.gender||'female'});
}

export async function playQuestionAudio(q){
  if(q.audio?.mode==='remote'&&q.audio.url){await playFile(q.audio.url);return;}
  if(q.audioUrl){await playFile(q.audioUrl);return;}
  const script=Array.isArray(q.audioScript)?q.audioScript:[];
  for(const item of script)await playSegment(item);
}

export function audioCapabilities(){
  return {naturalBankCount:Object.keys(audioBank).length,speechSynthesis:'speechSynthesis' in window,voiceCount:allVoices().length,voices:allVoices().slice(0,8).map(v=>({name:v.name,lang:v.lang,local:v.localService}))};
}
