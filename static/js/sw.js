// ===================================================================
// EyeSariwa Service Worker v34
// Strategy:
//   • Install  — precache the app shell (HTML, CSS, JS, assets, offline page)
//   • Activate — delete stale caches, claim all open clients
//   • Fetch    — cache-first for shell assets, network-only for /classify
// ===================================================================

var CACHE_NAME = 'eyesariwa-shell-v34';

// App shell files cached at install time.
// Missing asset files are tolerated (Promise.allSettled) so the SW
// installs successfully even before all artwork is supplied.
var PRECACHE = [
  '/',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/offline.html',
  // Branding
  '/static/assets/app_icon.png',
  '/static/assets/logo_transparent_wordmark_cropped.png',
  '/static/assets/home_hero_fresh_meat_market_cropped.png',
  '/static/assets/home_contactless_icon.png',
  '/static/assets/home_fast_icon.png',
  '/static/assets/home_easy_to_use_icon.png',
  // Meat type icons
  '/static/assets/icon_beef.png',
  '/static/assets/icon_pork.png',
  '/static/assets/icon_chicken.png',
  // Cut icons
  '/static/assets/icon_beef_shank.png',
  '/static/assets/icon_beef_sirloin.png',
  '/static/assets/icon_pork_belly.png',
  '/static/assets/icon_pork_chop.png',
  '/static/assets/icon_chicken_drumstick.png',
  '/static/assets/icon_chicken_breast.png',
  // Result status icons
  '/static/assets/icon_fresh.png',
  '/static/assets/icon_suspicious.png',
  '/static/assets/icon_stale.png',
  // Utility / tip icons
  '/static/assets/icon_lighting.png',
  '/static/assets/icon_focus.png',
  '/static/assets/icon_blur.png',
  '/static/assets/icon_confirm_cut.png',
  // Error state illustrations
  '/static/assets/asset_offline.png',
  '/static/assets/asset_server_unavailable.png'
];

// ===== INSTALL =====
self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Use Promise.allSettled so a single missing asset does not
      // abort the entire install.
      return Promise.allSettled(
        PRECACHE.map(function (url) { return cache.add(url); })
      );
    })
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key)   { return caches.delete(key); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

// ===== FETCH =====
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  // API endpoints — always network-only; never cache classify results.
  if (url.pathname === '/classify' || url.pathname === '/health') {
    return;
  }

  // Everything else: cache-first with stale-while-revalidate background refresh.
  event.respondWith(
    caches.match(event.request).then(function (cached) {

      if (cached) {
        refreshInBackground(event.request);
        return cached;
      }

      return fetch(event.request)
        .then(function (response) {
          if (response && response.status === 200 && event.request.method === 'GET') {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          // Both cache and network failed.
          // For page navigations, show the offline fallback.
          if (event.request.mode === 'navigate') {
            return caches.match('/static/offline.html');
          }
        });
    })
  );
});

// ===================================================================
// HELPERS
// ===================================================================
function refreshInBackground(request) {
  if (request.method !== 'GET') return;
  fetch(request)
    .then(function (response) {
      if (response && response.status === 200) {
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, response);
        });
      }
    })
    .catch(function () { /* background refresh failed — cached copy stays */ });
}
