/**
 * sw.js — Service Worker de Mangateca
 * Cachea automáticamente las portadas de libros, mangas y cómics
 * la primera vez que se cargan. En visitas siguientes se sirven
 * desde el caché del navegador de forma instantánea.
 */

const CACHE_NAME = 'mangateca-covers-v1';

// Dominios externos cuyas imágenes queremos cachear
const IMAGE_HOSTS = [
    'covers.openlibrary.org',
    'cdn.myanimelist.net',
];

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Solo interceptar peticiones de imagen de los dominios conocidos
    if (!IMAGE_HOSTS.includes(url.hostname)) return;

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
            cache.match(event.request).then((cached) => {
                // Si ya está en caché, devolverla directamente
                if (cached) return cached;

                // Si no, buscarla en red, guardarla y devolverla
                return fetch(event.request).then((response) => {
                    if (response.ok) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            })
        )
    );
});
