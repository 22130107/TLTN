const CACHE_NAME = "hyun-pwa-v1"

const PRECACHE_ASSETS = [
  "/",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== "hyun-map-tiles")
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Skip cross-origin or non-GET requests (except Leaflet tiles)
  if (request.method !== "GET") return

  // Strategy 1: Map tiles (OpenStreetMap / Carto) -> Cache-First
  if (
    url.hostname.includes("tile.openstreetmap.org") ||
    (url.pathname.endsWith(".png") && url.pathname.includes("/tile/"))
  ) {
    event.respondWith(caches.open("hyun-map-tiles").then((cache) =>
        cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(() => cachedResponse)
        }),
      ))
    return
  }

  // Strategy 2: Navigation (HTML pages) -> Network-First with Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse
          const rootCached = await caches.match("/")
          if (rootCached) return rootCached
          return new Response(
            "<!DOCTYPE html><html lang='vi'><head><meta charset='utf-8'><title>Offline | HYUN</title></head><body style='font-family:sans-serif;padding:2rem;text-align:center;'><h1>Bạn đang ở chế độ ngoại tuyến</h1><p>Vui lòng kết nối mạng để tải dữ liệu mới nhất từ HYUN.</p></body></html>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } },
          )
        }),
    )
    return
  }

  // Strategy 3: Static Assets (JS, CSS, fonts, local images) -> Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/assets/") ||
      url.pathname.startsWith("/fonts/") ||
      url.pathname.startsWith("/icons/"))
  ) {
    event.respondWith(caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone()
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone))
            }
            return networkResponse
          })
          .catch(() => cachedResponse)

        return cachedResponse || fetchPromise
      }))
    return
  }
})
