var CACHE_NAME = "polls-cache-v3";
var CACHED_URLS = [
  "/polls/offline/",
  "/static/polls/style.css",
  "/static/polls/images/background.png",
  "/static/polls/app.js"
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
  var requestURL = new URL(event.request.url);
  // request for a html file
  if (event.request.headers.get("accept").includes("text/html")){
    event.respondWith( // answer the request with ...
      caches.open(CACHE_NAME).then(function(cache){ //open cache
        return fetch(event.request) // try to fetch from server
          .then(function(networkResponse){ //if suceeds
            if (networkResponse.ok){ //if it is not some errorpage
              //put a copy of the response in the cache
              cache.put(event.request, networkResponse.clone());
            };
            return networkResponse; // and return the response
          }).catch(function(){ // if fetching from server fails
            // return copy from cache or offline page from cache
            return cache.match(event.request).then(function(response){
              return response || cache.match("/polls/offline/");
            });
          });
      })
    );
  //request is one of the resources cached during registration
  } else if(
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ){
    event.respondWith( // answer the request with ...
      caches.open(CACHE_NAME).then(function(cache){ // open cache
        return cache.match(event.request).then(function(response){
          // return matched result from cache or try to fetch from network
          return response || fetch(event.request);
        });
      })
    );
  };
});
