var CACHE_NAME = "polls-cache-v2";
var CACHED_URLS = [
  "/polls/offline/",
  "/static/polls/style.css",
  "/static/polls/images/background.png"
]

self.addEventListener("install", function(event){
  event.waitUntil(// dont' let install event finish until this succeeds
    caches.open(CACHE_NAME)// open new or existing cache, returns a promise
      .then(function(cache){// if cache-opening promise resolves
        return cache.addAll(CACHED_URLS)// add CACHED_URLS
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil( // don't finish activation until this succeeds
    caches.keys() // a promise containing an array of all cache names
      .then(function(cacheNames){
        return Promise.all( // return a promise that only succeeds if all of the promises in the array succeed
          cacheNames.map(function(cacheName){ // to create an array of promises, map the array of cachenames
            // for each of them:
            if (CACHE_NAME !== cacheName ){ // if name is not the same as current caches name
              return caches.delete(cacheName); // delete it and succeeds after that
            };
          })
        );
      })
  );
});

self.addEventListener("fetch", function(event){
  event.respondWith(// answer the request with ...
    fetch(event.request) // try to fetch from server
      .catch(function(){ // if this is rejected
        return caches.match(event.request) // try to return from cache
          .then(function(response){ // caches.match allways resolves
            if (response) { // check if something was found in cache
              return response;
            } else if (event.request.headers.get("accept").includes("text/html")){
              // requesting a html file and not finding a match in cache
              return caches.match("/polls/offline/")
            }
          });
      })
  );
});
