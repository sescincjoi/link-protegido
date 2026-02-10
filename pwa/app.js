if ('serviceWorker' in navigator) {
  const base = window.URL_CONFIG ? window.URL_CONFIG.BASE : '';
  navigator.serviceWorker.register(`${base}/sw.js`, {
    scope: `${base}/`
  }).then(function (registration) {
    console.log('✅ Service Worker registrado')
  })
    .catch(err => console.log('❌ Falha ao registrar SW', err));
}
