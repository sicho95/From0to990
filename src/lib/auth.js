import {setting,setSetting} from './db.js';

export const API_ENDPOINT='https://from0to990-api.sicho95.chatgpt.site';

async function endpoint(){return String(await setting('apiEndpoint',API_ENDPOINT)).replace(/\/$/,'')}
async function parse(res){
  let data=null;try{data=await res.json()}catch{}
  if(!res.ok){const message=data?.error==='Temporary password expired'?'Mot de passe provisoire expiré. Fais une nouvelle demande ou contacte l’administration.':data?.error==='Account unavailable'?'Ce compte est indisponible. Contacte l’administration.':data?.error||data?.message||`HTTP ${res.status}`;const e=new Error(message);e.status=res.status;e.code=data?.code;throw e}
  return data||{};
}
async function request(path,{method='GET',body,auth=true}={}){
  const headers={'accept':'application/json'};
  if(body!==undefined)headers['content-type']='application/json';
  if(auth){const token=await authToken();if(token)headers.authorization=`Bearer ${token}`}
  const res=await fetch(`${await endpoint()}${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
  return parse(res);
}
export async function authToken(){return await setting('authSessionToken',null)}
export async function authCapabilities(){
  try{
    const res=await fetch(`${await endpoint()}/api/v1/health`,{headers:{accept:'application/json'},cache:'no-store'});
    const data=await res.json().catch(()=>({}));
    const activated=Number(data.auth_version||0)>=2;
    if(activated)await setSetting('authV2Seen',true);
    const enabled=activated||!!(await setting('authV2Seen',false));
    return {enabled,authVersion:Number(data.auth_version||0),schemaVersion:Number(data.schema_version||0)};
  }catch{return {enabled:!!(await setting('authV2Seen',false)),authVersion:0,schemaVersion:0,offline:true}}
}
export async function loadAuthState(){
  const caps=await authCapabilities();
  if(!caps.enabled)return {...caps,user:null};
  const token=await authToken();
  if(!token)return {...caps,user:null};
  if(caps.offline)return {...caps,user:await setting('authUserInfo',null)};
  try{const data=await request('/api/v1/auth/me');if(data.user)await setSetting('authUserInfo',data.user);return {...caps,user:data.user||null}}
  catch(e){if(e.status===401||e.status===403){await clearAuthSession();return {...caps,user:null,expired:true}}return {...caps,user:await setting('authUserInfo',null),offline:true}}
}
export async function registerAccount({email,username,password,deviceId}){
  return request('/api/v1/auth/register',{method:'POST',auth:false,body:{email,username,password,deviceId}});
}
export async function loginAccount({identifier,password,deviceId}){
  return request('/api/v1/auth/login',{method:'POST',auth:false,body:{identifier,password,deviceId}});
}
export async function saveAuthSession(data){
  if(!data?.sessionToken||!data?.user?.id)throw new Error('Réponse de connexion invalide');
  await setSetting('authSessionToken',data.sessionToken);
  await setSetting('authUserId',data.user.id);
  await setSetting('authUserInfo',data.user);
  await setSetting('syncCursor',null);
  await setSetting('lastSyncAt',null);
  return data.user;
}
export async function updateCachedAuthUser(user){await setSetting('authUserInfo',user)}
export async function clearAuthSession(){
  await setSetting('authSessionToken',null);
  await setSetting('authUserId',null);
  await setSetting('authUserInfo',null);
  await setSetting('syncCursor',null);
  await setSetting('lastSyncAt',null);
}
export async function logoutAccount(){
  try{await request('/api/v1/auth/logout',{method:'POST'})}catch(e){if(e.status!==401)throw e}
  await clearAuthSession();
}
export async function forgotPassword(email){
  return request('/api/v1/auth/password/forgot',{method:'POST',auth:false,body:{email}});
}
export async function changePassword(newPassword,currentPassword){
  return request('/api/v1/auth/password/change',{method:'POST',body:{newPassword,...(currentPassword?{currentPassword}:{})}});
}
export async function adminResetRequests(){return request('/api/v1/admin/reset-requests')}
export async function adminTemporaryPassword(userId){return request(`/api/v1/admin/users/${encodeURIComponent(userId)}/password/temporary`,{method:'POST'})}
export async function adminListUsers(query=''){
  const q=query?`?q=${encodeURIComponent(query)}`:'';
  return request(`/api/v1/admin/users${q}`);
}
export async function adminSetUserStatus(userId,status){
  return request(`/api/v1/admin/users/${encodeURIComponent(userId)}`,{method:'PATCH',body:{status}});
}
export async function adminDeleteUser(userId){
  return request(`/api/v1/admin/users/${encodeURIComponent(userId)}`,{method:'DELETE'});
}
