/**
 * CacheService.js
 * Registra el Service Worker que cachea las portadas de productos.
 *
 * El SW (sw.js) está en la raíz del proyecto. Su URL se resuelve
 * con import.meta.url para que sea correcta sin importar desde
 * qué página HTML se cargue este módulo.
 *
 * Ruta del módulo: src/services/CacheService.js
 * Ruta del SW:     ../../sw.js  →  raíz del proyecto
 */
if ('serviceWorker' in navigator) {
    const swUrl = new URL('../../sw.js', import.meta.url);
    navigator.serviceWorker.register(swUrl).catch(console.error);
}
