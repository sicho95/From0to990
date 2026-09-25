function dayKey(d){return new Date(d).toISOString().slice(0,10)}
export function computeStats(state){
 const now=Date.now(),weekAgo=now-7*86400000;
 const week=state.sessions.filter(s=>new Date(s.startedAt).getTime()>=weekAgo);
 const weekMinutes=Math.round(week.reduce((n,s)=>n+(s.durationSec||0),0)/60);
 const sessions=state.sessions.length,lessons=state.sessions.filter(s=>String(s.type).startsWith('lesson:')).length;
 const xp=state.attempts.reduce((n,a)=>n+(a.correct?12:4),0)+lessons*20;
 const vocab=new Set();
 for(const a of state.attempts){const q=state.questions.find(x=>x.id===a.questionId);for(const w of q?.vocabulary||[])vocab.add(String(w).toLowerCase())}
 const days=[...new Set(state.sessions.map(s=>dayKey(s.startedAt)))].sort().reverse();
 let streak=0,cursor=new Date();cursor.setHours(0,0,0,0);
 for(let i=0;i<365;i++){const key=dayKey(cursor);if(days.includes(key)){streak++;cursor.setDate(cursor.getDate()-1)}else if(i===0){cursor.setDate(cursor.getDate()-1)}else break}
 const goal=(state.profile?.timePerDay||20)*5;
 return {weekMinutes,sessions,lessons,xp,words:vocab.size,streak,weekGoalPct:Math.min(100,Math.round(weekMinutes/Math.max(1,goal)*100))};
}
export function computeGains(state){
 const by=new Map();
 for(const a of [...state.attempts].reverse()){const q=state.questions.find(x=>x.id===a.questionId);for(const id of q?.skills||[]){const x=by.get(id)||{id,first:[],last:[],attempts:0};x.attempts++;if(x.first.length<5)x.first.push(a.correct?1:0);x.last.push(a.correct?1:0);if(x.last.length>5)x.last.shift();by.set(id,x)}}
 return [...by.values()].map(x=>{const av=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:0;return {...x,delta:Math.max(0,Math.round((av(x.last)-av(x.first))*100))}}).filter(x=>x.attempts>=3&&x.delta>0).sort((a,b)=>b.delta-a.delta).slice(0,6);
}
