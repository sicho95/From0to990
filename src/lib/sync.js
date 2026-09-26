import {STORES,getAll,del,put,setSetting,setting,saveProfile,saveSkill,addAttempt,addSession,saveError,deviceId} from './db.js';
export const DEFAULT_API_ENDPOINT='https://from0to990-api.sicho95.chatgpt.site';
export async function syncStatus(){return {endpoint:await setting('apiEndpoint',DEFAULT_API_ENDPOINT),lastSyncAt:await setting('lastSyncAt',null),pending:(await getAll(STORES.syncQueue)).length};}
export async function syncNow(){
  const endpoint=(await setting('apiEndpoint',DEFAULT_API_ENDPOINT)).replace(/\/$/,'');
  if(!endpoint)return {ok:false,reason:'no-endpoint'};
  if(!navigator.onLine)return {ok:false,reason:'offline'};
  const token=await setting('authSessionToken',null);
  if(!token)return {ok:false,reason:'unauthenticated'};
  const queue=await getAll(STORES.syncQueue);
  if(queue.length>500)throw new Error('Trop de changements en attente ; synchronise par lots');
  let cursor=await setting('syncCursor',null),pulled=0,first=true;
  for(let page=0;page<1000;page++){
    const batch=first?queue:[];
    const res=await fetch(`${endpoint}/api/v1/sync`,{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${token}`},body:JSON.stringify({deviceId:await deviceId(),cursor,events:batch}),cache:'no-store'});
    if(!res.ok)throw new Error(`Sync HTTP ${res.status}`);
    const data=await res.json();
    for(const evt of data.events||[])await applyRemote(evt);
    if(first){for(const item of queue)await del(STORES.syncQueue,item.id);first=false}
    pulled+=(data.events||[]).length;
    if(data.cursor!=null){cursor=data.cursor;await setSetting('syncCursor',cursor)}
    if(!data.hasMore){await setSetting('lastSyncAt',new Date().toISOString());return {ok:true,pushed:queue.length,pulled}}
    if(!(data.events||[]).length)throw new Error('Pagination de synchronisation bloquée');
  }
  throw new Error('Historique trop long pour une seule synchronisation');
}
async function applyRemote(e){const p=e.payload;if(!p)return;switch(e.type){case 'profile.upsert':await saveProfile(p,{queue:false});if(p.themePreference){localStorage.setItem('themePreference',p.themePreference)}break;case 'attempt.upsert':await addAttempt(p,{queue:false});break;case 'session.upsert':await addSession(p,{queue:false});break;case 'skill.upsert':await saveSkill(p,{queue:false});break;case 'error.upsert':await saveError(p,{queue:false});break;case 'setting.upsert':if(!['authSessionToken','authUserId','apiEndpoint','deviceId','syncCursor','lastSyncAt'].includes(p.key))await put(STORES.settings,p);break;}}
