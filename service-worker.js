importScripts('node_modules/sw-toolbox/sw-toolbox.js');
"use strict";

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

console.log("Hello from service Worker");
toolbox.options.debug = true;
toolbox.precache([
'index.html',
'/css/bulma.min.css',
'/css/sweetalert.min.css',
'/js/sweetalert.min.js',
'/scripts/app.js',
'/images/android-chrome-192x192.png',
'/images/android-chrome-512x512.png',
'/images/apple-touch-icon.png',
'/images/favicon-16x16.png',
'/images/favicon-32x32.png',
'/images/mstile-150x150.png',
'/images/safari-pinned-tab.svg',
'/favicon.ico']);
toolbox.router.get('/',toolbox.cacheFirst);
toolbox.router.get('/(.*)', toolbox.cacheFirst, {origin: 'https://maxcdn.bootstrapcdn.com/'});
