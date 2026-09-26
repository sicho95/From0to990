const DB_NAME='from0to990';
const DB_VERSION=1;
export const STORES={meta:'meta',profile:'profile',attempts:'attempts',sessions:'sessions',skills:'skills',vocab:'vocab',syncQueue:'syncQueue',settings:'settings',errors:'errors'};
let dbPromise;
function open(){
  if(dbPromise) return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORES.meta)) db.createObjectStore(STORES.meta,{keyPath:'key'});
      if(!db.objectStoreNames.contains(STORES.profile)) db.createObjectStore(STORES.profile,{keyPath:'id'});
      if(!db.objectStoreNames.contains(STORES.attempts)){const s=db.createObjectStore(STORES.attempts,{keyPath:'id'});s.createIndex('questionId','questionId');s.createIndex('createdAt','createdAt');}
      if(!db.objectStoreNames.contains(STORES.sessions)){const s=db.createObjectStore(STORES.sessions,{keyPath:'id'});s.createIndex('startedAt','startedAt');}
      if(!db.objectStoreNames.contains(STORES.skills)) db.createObjectStore(STORES.skills,{keyPath:'id'});
      if(!db.objectStoreNames.contains(STORES.vocab)) db.createObjectStore(STORES.vocab,{keyPath:'id'});
      if(!db.objectStoreNames.contains(STORES.syncQueue)){const s=db.createObjectStore(STORES.syncQueue,{keyPath:'id'});s.createIndex('createdAt','createdAt');}
      if(!db.objectStoreNames.contains(STORES.settings)) db.createObjectStore(STORES.settings,{keyPath:'key'});
      if(!db.objectStoreNames.contains(STORES.errors)){const s=db.createObjectStore(STORES.errors,{keyPath:'id'});s.createIndex('questionId','questionId');}
    };
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
  return dbPromise;
}
function reqp(req){return new Promise((res,rej)=>{req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error);});}
async function store(name,mode='readonly'){return (await open()).transaction(name,mode).objectStore(name)}
export async function get(name,key){return reqp((await store(name)).get(key));}
export async function getAll(name){return reqp((await store(name)).getAll());}
export async function put(name,value){return reqp((await store(name,'readwrite')).put(value));}
export async function del(name,key){return reqp((await store(name,'readwrite')).delete(key));}
export async function clear(name){return reqp((await store(name,'readwrite')).clear());}
export async function setting(key, fallback=null){const v=await get(STORES.settings,key);return v?.value ?? fallback;}
export async function setSetting(key,value){await put(STORES.settings,{key,value,updatedAt:new Date().toISOString()});}
export async function getProfile(){return (await get(STORES.profile,'me'))||null;}
export async function deviceId(){let id=await setting('deviceId');if(!id){id=crypto.randomUUID();await setSetting('deviceId',id);}return id;}
export async function enqueue(type,payload){const item={id:crypto.randomUUID(),type,payload,createdAt:new Date().toISOString(),deviceId:await deviceId()};await put(STORES.syncQueue,item);return item;}
export async function saveProfile(profile,{queue=true}={}){const p={...profile,id:'me',updatedAt:new Date().toISOString()};await put(STORES.profile,p);if(queue) await enqueue('profile.upsert',p);return p;}
export async function addAttempt(attempt,{queue=true}={}){await put(STORES.attempts,attempt);if(queue) await enqueue('attempt.upsert',attempt);}
export async function addSession(session,{queue=true}={}){await put(STORES.sessions,session);if(queue) await enqueue('session.upsert',session);}
export async function saveSkill(skill,{queue=true}={}){await put(STORES.skills,skill);if(queue) await enqueue('skill.upsert',skill);}
export async function saveError(error,{queue=true}={}){await put(STORES.errors,error);if(queue) await enqueue('error.upsert',error);}
export async function exportLocalBackup(){const data={format:'from0to990-backup',exportVersion:1,schemaVersion:DB_VERSION,exportedAt:new Date().toISOString(),stores:{}};for(const name of Object.values(STORES)) data.stores[name]=await getAll(name);return data;}
export async function importLocalBackup(data,{replace=false}={}){if(data?.format!=='from0to990-backup') throw new Error('Format de sauvegarde invalide');if(replace) for(const n of Object.values(STORES)) await clear(n);for(const [name,rows] of Object.entries(data.stores||{})){if(!Object.values(STORES).includes(name)) continue;for(const row of rows||[]) await put(name,row);}}
export async function snapshot(){const out={};for(const name of Object.values(STORES)) out[name]=await getAll(name);return out;}

export async function clearUserData(){
  for(const name of [STORES.profile,STORES.attempts,STORES.sessions,STORES.skills,STORES.vocab,STORES.syncQueue,STORES.errors])await clear(name);
  for(const key of ['syncCursor','lastSyncAt','activeSession'])await del(STORES.settings,key);
}
export async function enqueueCurrentSnapshot(){
  const p=await getProfile();if(p)await enqueue('profile.upsert',p);
  for(const x of await getAll(STORES.attempts))await enqueue('attempt.upsert',x);
  for(const x of await getAll(STORES.sessions))await enqueue('session.upsert',x);
  for(const x of await getAll(STORES.skills))await enqueue('skill.upsert',x);
  for(const x of await getAll(STORES.errors))await enqueue('error.upsert',x);
}
