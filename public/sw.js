const CACHE_NAME = 'masomo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/',
  '/assets/'
];

console.log('Service Worker: Script loaded');

// Handle skip waiting message
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Skipping waiting phase');
    self.skipWaiting();
  }
});

// Install service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  // Skip waiting to activate new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache).then(() => {
          console.log('Service Worker: All resources cached');
        });
      })
      .catch(error => {
        console.error('Service Worker: Cache error:', error);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Only handle HTTP requests
  if (!event.request.url.startsWith('http')) {
    console.log('Service Worker: Ignoring non-HTTP request:', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        console.log('Service Worker: Fetching resource:', event.request.url);
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();

        // Make network request and cache the response
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Service Worker: Invalid response for:', event.request.url);
              return response;
            }

            // Only cache HTTP(S) requests
            if (fetchRequest.url.startsWith('http')) {
              // Clone the response because it's a stream and can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('Service Worker: Caching new resource:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        ).catch(error => {
          // Return a custom offline page or fallback content
          console.error('Service Worker: Fetch failed:', error);
          return caches.match('/index.html');
        });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      // Force the service worker to take control of the page immediately
      return self.clients.claim();
    })
  );
});
