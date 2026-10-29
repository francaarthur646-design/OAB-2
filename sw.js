// Rota OAB service worker: makes the app installable, keeps a small offline
// shell, and shows study reminders. Server-sent push arrives in a later milestone.
const CACHE = 'rota-oab-v1'
const SHELL = ['/', '/app', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  )
  self.clients.claim()
})

// Network first for page navigations, falling back to the cached shell offline.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.mode !== 'navigate') return
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((hit) => hit || caches.match('/app')),
    ),
  )
})

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Rota OAB', {
      body: data.body || 'Hora de estudar! Sua meta de hoje está esperando.',
      icon: '/.netlify/images?url=/img/icon.png&w=192&h=192&fm=png',
      data: { url: data.url || '/app' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || '/app'))
})
