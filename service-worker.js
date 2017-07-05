importScripts('/cache-polyfill.js');

self.addEventListener('install', e => {
    console.log('Service Worker: Installing....');

    e.waitUntil(
        caches.open('airhorner').then(cache => {
            console.log('Service Worker: Caching App Shell at the moment......');

            return cache.addAll([

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
                ])
                .then(() => self.skipWaiting());
        })
    )
});

self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(airhorner) {
            return Promise.all(airhorner.map(function(key) {
                if (key !== airhorner) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});
