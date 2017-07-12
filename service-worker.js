// importScripts('/cache-polyfill.js');

// self.addEventListener('install', e => {
//     console.log('Service Worker: Installing....');

//     e.waitUntil( 
//         caches.open('airhorner').then(cache => {
//             console.log('Service Worker: Caching App Shell at the moment......');

//             return cache.addAll([

//                     '/index.html',
//                     '/scripts/app.js',
//                     '/scripts/script.js',
//                     '/styles/inline.css',
//                     '/images/clear.png',
//                     '/images/cloudy-scattered-showers.png',
//                     '/images/cloudy.png',
//                     '/images/fog.png',
//                     '/images/ic_add_white_24px.svg',
//                     '/images/ic_refresh_white_24px.svg',
//                     '/images/partly-cloudy.png',
//                     '/images/rain.png',
//                     '/images/scattered-showers.png',
//                     '/images/sleet.png',
//                     '/images/snow.png',
//                     '/images/thunderstorm.png',
//                     '/images/wind.png',
//                     '/css/style.css',
//                     '/css/sprites.css',
//                     '/css/sprites-webp.css',
//                     '/svg/search.svg',
//                     '/svg/search-active.svg',
//                     '/svg/ic_arrow_back_36px.svg',
//                     '/images/sjds-logo.svg',
//                     '/scripts/mui.min.js',
//                     '/scripts/jquery.min.js'
//                 ])
//                 .then(() => self.skipWaiting());
//         })
//     )
// });

// self.addEventListener('activate', function(event) {

//     console.log('Service Worker: Activating....');

//     event.waitUntil(
//         caches.keys().then(function(airhorner) {
//             return Promise.all(airhorner.map(function(key) {
//                 if (key !== airhorner) {
//                     console.log('Service Worker: Removing Old Cache', key);
//                     return caches.delete(key);
//                 }
//             }));
//         })
//     );
//     return self.clients.claim();
// });

// self.addEventListener('fetch', event => {
//     // console.log('Service Worker: Fetch', event.request.url);

//     // console.log("Url", event.request.url);
//     event.respondWith(
//         caches.match(event.request, { ignoreSearch: true }).then(response => {
//             return response || fetch(event.request);
//         })
//     );
// });

(function() {
  'use strict';


  var CACHE_NAME = 'static-cache';
  var urlsToCache = [
    '.',
     '/index.html',
                    '/scripts/app.js',
                    '/scripts/script.js',
                    '/styles/inline.css',
                    '/images/clear.png',
                    '/images/cloudy-scattered-showers.png',
                    '/images/cloudy.png',
                    '/images/fog.png',
                    '/images/ic_add_white_24px.svg',
                    '/images/ic_refresh_white_24px.svg',
                    '/images/partly-cloudy.png',
                    '/images/rain.png',
                    '/images/scattered-showers.png',
                    '/images/sleet.png',
                    '/images/snow.png',
                    '/images/thunderstorm.png',
                    '/images/wind.png',
                    '/css/style.css',
                    '/css/sprites.css',
                    '/css/sprites-webp.css',
                    '/svg/search.svg',
                    '/svg/search-active.svg',
                    '/svg/ic_arrow_back_36px.svg',
                    '/images/sjds-logo.svg',
                    '/scripts/mui.min.js',
                    '/scripts/jquery.min.js'
  ];

  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        return response || fetchAndCache(event.request);
      })
    );
  });

  function fetchAndCache(url) {
    return fetch(url)
    .then(function(response) {
      // Check if we received a valid response
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.put(url, response.clone());
        return response;
      });
    })
    .catch(function(error) {
      console.log('Request failed:', error);
      // You could return a custom offline 404 page here
    });
  }
  

self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        e.waitUntil(
            clients.matchAll().then(function(clis) {
                var client = clis.find(function(c) {
                    return c.visibilityState === 'visible';
                });
                if (client !== undefined) {
                    client.navigate('http://senorcoders.com/');
                    client.focus();
                } else {
                    // there are no visible windows. Open one.
                    clients.openWindow('http://senorcoders.com/');
                    notification.close();
                }
            })
        );
    }

    self.registration.getNotifications().then(function(notifications) {
        notifications.forEach(function(notification) {
            notification.close();
        });
    });
});

self.addEventListener('push', function(e) {
    var body;

    if (e.data) {
        body = e.data.text();
    } else {
        body = 'Visit senorcoders Website!!';
    }

    var options = {
        body: body,
        icon: 'img/icon-196.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [{
            action: 'explore',
            title: 'SJDS Directory',
            icon: 'img/icon-196.png'
        }, {
            action: 'close',
            title: 'Close the notification',
            icon: 'img/icon-196.png'
        }, ]
    };
    e.waitUntil(
        clients.matchAll().then(function(c) {
            console.log(c);
            if (c.length === 0) {
                // Show notification
                self.registration.showNotification('Push Notification', options);
            } else {
                // Send a message to the page to update the UI
                console.log('Application is already open!');
            }
        })
    );
});

})();

