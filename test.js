self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
  const cache = await caches.open('my-cache');
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const eTag = cachedResponse.headers.get('ETag');
    const lastModified = cachedResponse.headers.get('Last-Modified');

    const fetchResponse = await fetch(request.url, {
      headers: {
        ...(eTag && { 'If-None-Match': eTag }),
        ...(lastModified && { 'If-Modified-Since': lastModified })
      }
    });

    if (fetchResponse.status === 304) {
      console.log('File has not changed, serving cached version.');
      return cachedResponse;
    } else {
      console.log('File changed, updating cache.');
      await cache.put(request, fetchResponse.clone());
      return fetchResponse;
    }
  } else {
    console.log('No cache found, fetching fresh file.');
    const fetchResponse = await fetch(request);
    await cache.put(request, fetchResponse.clone());
    return fetchResponse;
  }
}


self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
  const cache = await caches.open('my-cache');
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const eTag = cachedResponse.headers.get('ETag');
    const lastModified = cachedResponse.headers.get('Last-Modified');

    // Manually construct headers object
    let headers = {};
    if (eTag) {
      headers['If-None-Match'] = eTag;
    }
    if (lastModified) {
      headers['If-Modified-Since'] = lastModified;
    }

    const fetchResponse = await fetch(request.url, { headers });

    if (fetchResponse.status === 304) {
      console.log('File has not changed, serving cached version.');
      return cachedResponse;
    } else {
      console.log('File changed, updating cache.');
      await cache.put(request, fetchResponse.clone());
      return fetchResponse;
    }
  } else {
    console.log('No cache found, fetching fresh file.');
    const fetchResponse = await fetch(request);
    await cache.put(request, fetchResponse.clone());
    return fetchResponse;
  }
};



const MAIN_CACHE = `ARK-cache-version: ${version}`;
self.addEventListener('install', event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(MAIN_CACHE);
            const keys = await cache.keys();

            await Promise.all(keys.map(async request => {
                const headResponse = await fetch(request.url, { method: 'HEAD' });
                const newETag = headResponse.headers.get('ETag');

                let cachedResponse = await cache.match(request);
                if (!cachedResponse) {
                    // File is missing from cache, download and cache it
                    const newResponse = await fetch(request.url);
                    await cache.put(request, newResponse);
                    return;
                }

                const oldETag = cachedResponse.headers.get('ETag');
                if (newETag && oldETag && newETag !== oldETag) {
                    const newResponse = await fetch(request.url);
                    await cache.put(request, newResponse);
                }
            }));
        })()
    );
});