// Service worker de Papy Gourmand : permet l'installation de l'application
// et garde en mémoire les pages déjà consultées pour les relire hors connexion.
const CACHE = 'papy-gourmand-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord (toujours la version la plus récente), le cache si pas de connexion.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((rep) => {
        if (rep.ok && new URL(e.request.url).origin === location.origin) {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copie));
        }
        return rep;
      })
      .catch(() => caches.match(e.request))
  );
});
