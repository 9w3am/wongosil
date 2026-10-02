// 앱은 app/으로 옮겼다. 맨 위에 남은 옛 서비스 워커를 지우고 열린 창을 새로 불러온다
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((cs) => cs.forEach((c) => c.navigate(c.url))),
  );
});
