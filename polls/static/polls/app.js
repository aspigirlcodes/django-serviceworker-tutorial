if ("serviceWorker" in navigator){ // Check if browser supports serviceworkers
  navigator.serviceWorker.register("/polls/serviceworker.js") //register returns a promise
    .then(function(registration){ // if promise resolved
      console.log("Service Worker registered with scope:", registration.scope);
    }).catch(function(err){ // if promise rejected
      console.log("Service worker registration failed:", err);
    });
}

if ("serviceWorker" in navigator && navigator.serviceWorker.controller){
  // serviceWorker in navigator doesn't mean service worker installed.
  // we need controller to be available
  navigator.serviceWorker.addEventListener("message", function(event){
    // when receiving a message
    if (event.data === "offline"){ // if the data is "offline"
      // add an alert to the top of the page
      var newDiv = document.createElement('div')
      var newContent = document.createTextNode("You are currently offline. " +
      "The content of this page may be out of date.");
      newDiv.appendChild(newContent);
      newDiv.classList.add('alert')
      document.body.insertBefore(newDiv, document.body.firstChild);
      // if there is a submit button on the page, dissable button
      var b = document.querySelector("input[type='submit']");
      if (b){
        b.setAttribute("disabled", "");
      };
    };
  });
  // send a message to the service worker
  navigator.serviceWorker.controller.postMessage("offline?")
}
