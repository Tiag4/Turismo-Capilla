const CACHE_NAME = 'turismo-capilla-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/cropped-logo-capilla-del-monte-2024.png',
  '/emergencias',
  '/atractivos',
  '/como-llegar'
];

// Instalación: Pre-cachear recursos críticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Advertencia en precache de SW:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Fetch: Stale-While-Revalidate con Fallback de Red y Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo peticiones GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignorar extensiones de navegador y esquemas no http/https
  if (!url.protocol.startsWith('http')) return;

  // Peticiones de navegación (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const rootFallback = await caches.match('/');
          if (rootFallback) return rootFallback;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Recursos estáticos (JS, CSS, imágenes, fuentes)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
