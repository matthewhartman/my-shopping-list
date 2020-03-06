// Service Worker

var CACHE_NAME = 'v-1'

// Initial Assets to Cache
var urlsToCache = [
  '/my-shopping-list/dist/',
  '/my-shopping-list/dist/index.html',
  '/my-shopping-list/android-chrome-144x144.png',
  '/my-shopping-list/android-chrome-192x192.png',
  '/my-shopping-list/android-chrome-512x512.png',
  '/my-shopping-list/apple-touch-icon.png',
  '/my-shopping-list/browserconfig.xml',
  '/my-shopping-list/favicon.ico',
  '/my-shopping-list/favicon-16x16.png',
  '/my-shopping-list/favicon-32x32.png',
  '/my-shopping-list/mstile-150x150.png',
  '/my-shopping-list/site.webmanifest'
]

// Install the service worker and skip waiting
// Skip waiting is essential to work correctly with iOS devices
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache', CACHE_NAME)
      return cache.addAll(urlsToCache)
    })
  )
})

// For every new asset that is fetched, add it to the cache list
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache')
        return response
      }
      return fetch(event.request).then(function(response) {
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        var responseToCache = response.clone()
        caches.open(CACHE_NAME)
        .then(function(cache) {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    })
  )
})

// If a new cache name is present, delete the old cache and create a new one
self.addEventListener('activate', (event) => {
  var cacheKeeplist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key)
        }
      }))
    })
  )
})