// VitaPod Service Worker — intentionally minimal
// Standalone mode on iOS has strict eval() restrictions that conflict with
// Babel's runtime JSX transpilation. We keep the SW registered (so the
// PWA manifest is valid) but let ALL requests pass through to the network.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
// No fetch handler — everything goes straight to network
