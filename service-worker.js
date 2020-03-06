// Service Worker
(function(serviceWorker) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/my-shopping-list/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err)
      })
    })
  }
})(window.serviceWorker = window.serviceWorker || {})