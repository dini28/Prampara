/* Parampara Path service worker — app shell + previously viewed places */
const SHELL_CACHE = "pp-shell-v1";
const PAGE_CACHE = "pp-pages-v1";
const TILE_CACHE = "pp-tiles-v1";

const SHELL = [
  "/",
  "/explore",
  "/map",
  "/bookmarks",
  "/me",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/india-states.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![SHELL_CACHE, PAGE_CACHE, TILE_CACHE].includes(k))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

function isTile(url) {
  return url.hostname.includes("tile.openstreetmap.org");
}

function isNavigate(request) {
  return request.mode === "navigate";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache staff / admin APIs
  if (url.pathname.startsWith("/api/staff") || url.pathname.startsWith("/staff")) {
    return;
  }

  if (isTile(url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          return hit || Response.error();
        }
      }),
    );
    return;
  }

  if (isNavigate(request)) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          const cache = await caches.open(PAGE_CACHE);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          const cache = await caches.open(PAGE_CACHE);
          const cached = await cache.match(request);
          if (cached) return cached;
          const shell = await caches.match("/offline");
          return shell || caches.match("/");
        }
      })(),
    );
    return;
  }

  // Same-origin assets: cache-first shell, network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(async (hit) => {
        if (hit) return hit;
        try {
          const res = await fetch(request);
          if (res.ok && (url.pathname.startsWith("/items/") || url.pathname.startsWith("/regions/"))) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(request, res.clone());
          }
          return res;
        } catch {
          return caches.match("/offline");
        }
      }),
    );
  }
});
