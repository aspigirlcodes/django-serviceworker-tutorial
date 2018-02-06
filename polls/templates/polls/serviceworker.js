self.addEventListener("install", function(event){
  event.waitUntil(// dont' let install event finish until this succeeds
    caches.open("polls-cache")// open new or existing cache, returns a promise
      .then(function(cache){// if cache-opening promise resolves
        return cache.add("/polls/offline/")// add offline page
    })
  );
});

self.addEventListener("fetch", function(event){
  event.respondWith(// answer the request with ...
    fetch(event.request) // try to fetch from server
      .catch(function(){ // if this is rejected
        return caches.match("/polls/offline/") // return offline page from cache
      })
  );
});
