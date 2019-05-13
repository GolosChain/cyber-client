self.addEventListener('install', event => {
  console.log('[SW] install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  const initialize = () => {
    self.clients.claim();
    self.IDBManager = new idbmanager.default('CyberGolos');
  };
  event.waitUntil(initialize());
  console.log('[SW] activate');
});

self.addEventListener('message', swhandler.default);
