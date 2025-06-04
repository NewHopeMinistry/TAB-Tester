const version = 22;
var oldVersion = version - 1;
// Change scope in index.html

const MAIN_CACHE = `ARK-cache-version: ${version}`;
const OLD_MAIN_CACHE = `ARK-cache-version: ${oldVersion}`;
const VERSION_CACHE = 'ARK-bibles';
var update = true;
var updateVar = true;

const urlsToCache = [
    'index.html',
    'manifest.json',
    'css/index.css',
    'css/lateload.css',
    'images/icons/favicon-16.png',
    'js/variables.js',
    'js/index.js',
    'js/lateload.js',
    'js/searcher.js',
    'html/css/html.css',
    'html/js/htmlvariables.js',
    'html/about.html',
    'html/help.html',
    'html/history.html',
    'html/images/icons/homelogo-512.png',
    'html/license.html',
    'html/statement.html',
    'html/twfabout.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(MAIN_CACHE);
            const oldCache = await caches.open(OLD_MAIN_CACHE);

            for (let url of urlsToCache) {
                const headResponse = await fetch(url, { method: 'HEAD' });
                const newETag = headResponse.headers.get('ETag');
                let cachedResponse = await oldCache.match(url);
                if (cachedResponse) {
                    const oldETag = cachedResponse.headers.get('ETag');
                    if (newETag && oldETag && newETag === oldETag) {
                         await cache.put(url, cachedResponse);
                    } else {
                        const newResponse = await fetch(url, { cache: 'reload' });
                        if (newResponse) { await cache.put(url, newResponse); };
                    };
                } else {
                    const newResponse = await fetch(url, { cache: 'reload' });
                    if (newResponse) { await cache.put(url, newResponse); };
                };
            };
        })()
    );
});

self.addEventListener('activate', async (event) => {

    event.waitUntil(
        (async () => {
            await deleteCaches();
        })()
    );
});

async function deleteCaches() {

    const cacheAllowList = [MAIN_CACHE, VERSION_CACHE];
    const keys = await caches.keys();
    await Promise.all(keys.map(async (key) => {
        if (!cacheAllowList.includes(key)) { await caches.delete(key); };
    }));
};

async function deleteCachedFile(fileName) {
    const cache = await caches.open(MAIN_CACHE);
    const keys = await cache.keys();

    for (const request of keys) {
        if (request.url.endsWith(fileName)) { await cache.delete(request); };
    };
    return Promise.resolve(true);
};

self.addEventListener('fetch', event => {

    event.respondWith(
        (async () => {

            const cache = await caches.open(MAIN_CACHE);
            const versionCache = await caches.open(VERSION_CACHE);
            var url= new URL(event.request.url);
            var filename = url.pathname.split('/').pop();
            url.search = '';

// This can be removed after editing TWF is finished
        if (navigator.onLine) {

            if (filename === 'htmlvariables.js') {
                if (updateVar) {
                    const headResponse = await fetch(url, { method: 'HEAD' });
                    const newETag = headResponse.headers.get('ETag');
                    let cachedResponse = await cache.match(url);
                    if (cachedResponse) {
                        const oldETag = cachedResponse.headers.get('ETag');
                        if (newETag && oldETag && newETag !== oldETag) {
                            const newResponse = await fetchOnlineUpdate(url, filename);
                            if (newResponse.ok) { await cache.put(url, newResponse); };
                        };
                        updateVar = false;
                    };
                };
            };

            if (filename === 'TWFVerses.json') {
                if (update) {
                    const headResponse = await fetch(url, { method: 'HEAD' });
                    const newETag = headResponse.headers.get('ETag');
                    let cachedResponse = await versionCache.match(url);
                    if (cachedResponse) {
                        const oldETag = cachedResponse.headers.get('ETag');
                        if (newETag && oldETag && newETag !== oldETag) {
                            const newResponse = await fetchOnlineUpdate(url, filename);
                            if (newResponse.ok) { await versionCache.put(url, newResponse); };
                        };
                        update = false;
                    };
                };
            };


        };
// End This can be removed after editing TWF is finished

        if (filename.endsWith('.json') && filename !== 'manifest.json') {

            const cachedResponse = await versionCache.match(url);
            if (cachedResponse) { return cachedResponse };

            const response = await fetchOnline(url, filename);
            if (!response.ok) { return response; };
            await versionCache.put(url, response.clone());
            return response;
        } else {

            const cachedResponse = await cache.match(url);
            if (cachedResponse) { return cachedResponse };

            const response = await fetchOnline(url, filename);
            if (!response.ok) { return response; };
            await cache.put(url, response.clone());
            return response;
        };


        })()
    );
});

async function fetchOnlineUpdate(url, filename) {

    if (navigator.onLine) {
        try {
            const response = await fetch(url, { cache: 'reload' });
            if (!response.ok) { return new Response(`${filename}Network fetch error: 500`, { status: 500 }); };
            return response;
        } catch (error) {
            return new Response(`${filename}Network fetch error: 500-1`, { status: 500 });
        };
     } else { return new Response(`${filename}: No internet connection error: 503-1`, { status: 503 }); };
};

async function fetchOnline(url, filename) {

    if (navigator.onLine) {
        try {
            const response = await fetch(url);
            if (!response.ok) { return new Response(`${filename}Network fetch error: 500`, { status: 500 }); };
            return response;
        } catch (error) {
            return new Response(`${filename}Network fetch error: 500-1`, { status: 500 });
        };
     } else { return new Response(`${filename}: No internet connection error: 503-1`, { status: 503 }); };
};
