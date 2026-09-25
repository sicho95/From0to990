const APP_VERSION='__BUILD_VERSION__';
const CONTENT_VERSION='__CONTENT_VERSION__';
const CACHE=`from0to990-${APP_VERSION}-${CONTENT_VERSION}`;
const CORE=['./','./index.html','./styles.css','./app.js','./lib/db.js','./lib/adaptive.js','./lib/audio.js','./lib/sync.js','./lib/ui.js','./lib/session.js','./lib/curriculum.js','./manifest.webmanifest','./content/content.json','./assets/icon.svg'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys()) if(k.startsWith('from0to990-')&&k!==CACHE) await caches.delete(k); await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith((async()=>{try{const net=await fetch(req);const c=await caches.open(CACHE);c.put('./index.html',net.clone());return net;}catch{return await caches.match('./index.html')||await caches.match('./');}})());
    return;
  }
  if(url.origin!==location.origin && !/ets\./i.test(url.hostname))return;
  event.respondWith((async()=>{const cached=await caches.match(req);try{const net=await fetch(req);if(net.ok){const c=await caches.open(CACHE);c.put(req,net.clone());}return net;}catch{return cached||new Response('Offline',{status:503});}})());
});