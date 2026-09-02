const CACHE='ph-english-v8-20260902-groupactivity-audit';
const ASSETS=['./','./index.html','./styles.css?v=20260902-8','./app.js?v=20260902-8','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  event.respondWith(
    fetch(request)
      .then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      })
      .catch(async()=>{
        const cached=await caches.match(request,{ignoreSearch:false});
        if(cached)return cached;
        if(request.mode==='navigate')return (await caches.match('./index.html')) || (await caches.match('./'));
        return Response.error();
      })
  );
});
