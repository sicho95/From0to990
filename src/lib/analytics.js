export function computeStats(state={}){
  state={sessions:[],attempts:[],questions:[],profile:{},...state};
  const now=new Date(),monday=new Date(now);monday.setHours(0,0,0,0);monday.setDate(now.getDate()-((now.getDay()+6)%7));
  const weekSessions=state.sessions.filter(s=>new Date(s.startedAt)>=monday),weekMinutes=Math.round(weekSessions.reduce((n,s)=>n+(s.durationSec||0),0)/60);
  const lessons=new Set(state.sessions.filter(s=>s.type?.startsWith('lesson:')).map(s=>s.type)),xp=state.attempts.reduce((n,a)=>n+(a.correct?10:3),0)+state.sessions.length*5;
  const qmap=new Map(state.questions.map(q=>[q.id,q])),words=new Set();for(const a of state.attempts)for(const w of qmap.get(a.questionId)?.vocabulary||[])words.add(String(w).toLowerCase());
  const days=[...new Set(state.sessions.map(s=>new Date(s.startedAt).toISOString().slice(0,10)))].sort().reverse();let streak=0,cursor=new Date();cursor.setHours(0,0,0,0);if(days[0]&&days[0]!==cursor.toISOString().slice(0,10))cursor.setDate(cursor.getDate()-1);for(const d of days){if(d===cursor.toISOString().slice(0,10)){streak++;cursor.setDate(cursor.getDate()-1)}else if(d<cursor.toISOString().slice(0,10))break}
  const weekGoal=(state.profile.timePerDay||20)*5;return{weekMinutes,lessons:lessons.size,xp,words:words.size,streak,sessions:state.sessions.length,weekGoalPct:Math.round(weekMinutes/Math.max(1,weekGoal)*100)}
}
export function computeGains(state={}){
  state={attempts:[],questions:[],...state};
  const qmap=new Map(state.questions.map(q=>[q.id,q])),groups=new Map();for(const a of state.attempts){const q=qmap.get(a.questionId);for(const sk of q?.skills||[]){const arr=groups.get(sk)||[];arr.push(a.correct?1:0);groups.set(sk,arr)}}
  const gains=[];for(const [id,arr] of groups){if(arr.length<4)continue;const half=Math.min(5,Math.floor(arr.length/2)),recent=arr.slice(-half),before=arr.slice(-half*2,-half);if(!before.length)continue;const ra=recent.reduce((a,b)=>a+b,0)/recent.length,ba=before.reduce((a,b)=>a+b,0)/before.length,delta=Math.round((ra-ba)*100);if(delta>0)gains.push({id,delta,attempts:arr.length})}return gains.sort((a,b)=>b.delta-a.delta).slice(0,5)
}
