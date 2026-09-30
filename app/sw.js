// 원고실 웹판 오프라인 캐시(ADR-020). 원고는 여기가 아니라 기기 안 SQLite(OPFS)에 있다.
// 같은 출처의 앱 파일만 캐시하고(먼저 캐시, 뒤에서 새로 받기), 다른 주소(사전 조회 등)는 건드리지 않는다.
const CACHE = "wongo-app-v2"; // v2: 앱이 사이트의 app/ 아래로 옮김

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icon.svg"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(e.request, { ignoreSearch: url.pathname.endsWith("/") });
      const fresh = fetch(e.request)
        .then((res) => {
          if (res.ok) void cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit ?? fresh;
    }),
  );
});
