importScripts('js/sw-utils.js');

const CACHE_STATIC = 'static-v2';
const CACHE_DYNAMIC = 'dynamic-v2';
const CACHE_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    '/js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const staticCache = caches.open(CACHE_STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const inmutableCache = caches.open(CACHE_INMUTABLE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', e => {

    const borrarCache = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key != CACHE_STATIC && keys.includes('static-')) {
                return caches.delete(key);
            }
            if (key != CACHE_DYNAMIC && keys.includes('dynamic-')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(borrarCache);
});

self.addEventListener('fetch', e => {
    caches.match(e.request).then(res => {
        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newResp => {
                return actualizaCacheDinamico(CACHE_DYNAMIC, e.request, newResp);
            });
        }
    });
    e.respondWith(e.request.url);
});