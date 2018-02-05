if ("serviceWorker" in navigator){ // Check if browser supports serviceworkers
  navigator.serviceWorker.register("/polls/serviceworker.js") //register returns a promise
    .then(function(registration){ // if promise resolved
      console.log("Service Worker registered with scope:", registration.scope);
    }).catch(function(err){ // if promise rejected
      console.log("Service worker registration failed:", err);
    });
}
