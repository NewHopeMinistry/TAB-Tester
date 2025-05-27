const version = '1.5';
const CACHE_NAME = `ARK-cache-version: ${version}`;
var update = true;
var updateVar = true;

// `html/js/htmlvariables.js?version=${version}`,
const urlsToCache = [
    `index.html?version=${version}`,
    `manifest.json?version=${version}`,
    `css/index.css?version=${version}`,
    `css/lateload.css?version=${version}`,
    `js/variables.js?version=${version}`,
    `js/index.js?version=${version}`,
    `js/lateload.js?version=${version}`,
    `js/searcher.js?version=${version}`,
    `html/css/html.css?version=${version}`,
    `html/about.html?version=${version}`,
    `html/help.html?version=${version}`,
    `html/history.html?version=${version}`,
    `html/images/icons/homelogo-512.png?version=${version}`,
    `html/license.html?version=${version}`,
    `html/statement.html?version=${version}`,
    `html/twfabout.html?version=${version}`
];

self.addEventListener('install', event => {

    event.waitUntil(
        (async () => {

            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(urlsToCache);
            console.log(CACHE_NAME);
        })()
    );
});

self.addEventListener('activate', async (event) => {

    event.waitUntil(
        (async () => {

            const cacheAllowList = [CACHE_NAME];
            const keys = await caches.keys();
            await Promise.all(keys.map(async (key) => {
                if (!cacheAllowList.includes(key)) { await caches.delete(key); };
            }));
        })()
    );
});

async function deleteCachedFile(fileName) {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    for (const request of keys) {
        if (request.url.endsWith(fileName)) { await cache.delete(request); };
    };
    return Promise.resolve(true);
};

self.addEventListener('fetch', event => {

    event.respondWith(
        (async () => {

            const cache = await caches.open(CACHE_NAME);
            var url= new URL(event.request.url);
            var filename = url.pathname.split('/').pop();

            url.search = '';
            if (event.request.mode === 'navigate') {

                if (url.pathname === '/' || !filename || filename === '')
                    { url.search = `?version=${version}`; };

                if (filename === 'index.html') { url.search = `?version=${version}`; };
            };
            if (!filename.endsWith('.json') || filename === 'manifest.json')
                { if ( filename !== 'index.html') { url.search = `?version=${version}`; }; };

// This can be removed after editing TWF is finished
            if (filename === 'htmlvariables.js') {

                if (updateVar) {
                    const res = await fetchOnline(url, filename);
                    if (res.ok) {
                        url.search = '';
                        await cache.delete(url);
                        await cache.put(url, res.clone());
                        updateVar = false;
                    };
                };
            };

            if (filename === 'TWFVerses.json') {

                if (update) {
                    const res = await fetchOnline(url, filename);
                    if (res.ok) {
                        url.search = '';
                        await cache.delete(url);
                        await cache.put(url, res.clone());
                        update = false;
                    };
                };
            };
// End This can be removed after editing TWF is finished

            const cachedResponse = await cache.match(url);
            if (cachedResponse) { return cachedResponse };

            const response = await fetchOnline(url, filename);
            if (!response.ok) { return response; };
            await cache.put(url, response.clone());
            await cache.delete('/index.html');
            return response;

        })()
    );
});

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
