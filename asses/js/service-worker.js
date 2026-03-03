self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("cleaning-app").then(cache => {
      return cache.addAll([
        "../../index.html",
        "../css/style.css",
        "./script.js"
      ]);
    })
  );
});