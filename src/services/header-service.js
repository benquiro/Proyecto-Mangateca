/**
 * header-service.js
 * Actualiza los badges numéricos en el header (carrito y favoritos).
 * Se llama al cargar cada página y tras cada acción del usuario.
 *
 * Ruta: src/services/header-service.js
 */

import { getCartCount } from './cart-service.js';
import { getWishlistCount } from './wishlist-service.js';

/**
 * Actualiza los badges del carrito y de la wishlist en el header.
 * Busca los elementos por ID para máxima compatibilidad con todas las páginas.
 */
export function updateHeaderBadges() {
    updateBadge('cart-badge', getCartCount());
    updateBadge('wishlist-badge', getWishlistCount());
}

/**
 * @param {string} id  ID del elemento badge
 * @param {number} count
 */
function updateBadge(id, count) {
    const badge = document.getElementById(id);
    if (!badge) return;

    badge.textContent = count > 99 ? '99+' : count;

    if (count > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Inicializar badges al cargar el módulo (en cualquier página)
document.addEventListener('DOMContentLoaded', updateHeaderBadges);

// Actualizar badges al volver a la página (caché del navegador o bfcache)
window.addEventListener('pageshow', updateHeaderBadges);

// Sincronizar badges si se actualiza el almacenamiento en otra pestaña o script
window.addEventListener('storage', (event) => {
    if (event.key === 'mangateca_cart' || event.key === 'mangateca_wishlist') {
        updateHeaderBadges();
    }
});
