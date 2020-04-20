// const e = require("express");

var cachedItems = ["/", "index.js", "icons/icon-192x192.png", "icons/icon-512x512.png", "manifest.webmanifest", "styles.css"];

const CACHE_NAME = 'budget-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        cache.addAll(cachedItems);
      })
      .then(() => self.skipWaiting())
    );
  });

// activate event
self.addEventListener('activate', evt => {
    console.log('Service worker activated!');
    // remove unwanted caches
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// fetch event
self.addEventListener('fetch', evt => {
    console.log('Service Worker: Fetching');
    evt.respondWith(
        fetch(evt.request).catch(() => caches.match(evt.request))
    )
    // if(evt.request.url.includes('/api'))
});  

