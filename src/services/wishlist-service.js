/**
 * wishlist-service.js
 * Gestiona la wishlist (favoritos) mediante localStorage.
 *
 * Estructura en localStorage ("mangateca_wishlist"):
 *   [productId, productId, ...]  (array de IDs únicos)
 *
 * Ruta: src/services/wishlist-service.js
 */

const WISHLIST_KEY = 'mangateca_wishlist';

/** @returns {number[]} */
export function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY)) ?? [];
    } catch {
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

/**
 * Añade o quita un producto de la wishlist.
 * @param {number} productId
 * @returns {boolean} true si fue añadido, false si fue quitado
 */
export function toggleWishlist(productId) {
    const list = getWishlist();
    const index = list.indexOf(productId);

    if (index === -1) {
        list.push(productId);
        saveWishlist(list);
        return true;
    } else {
        list.splice(index, 1);
        saveWishlist(list);
        return false;
    }
}

/**
 * @param {number} productId
 * @returns {boolean}
 */
export function isInWishlist(productId) {
    return getWishlist().includes(productId);
}

/**
 * Quita un producto de la wishlist.
 * @param {number} productId
 */
export function removeFromWishlist(productId) {
    const list = getWishlist().filter(id => id !== productId);
    saveWishlist(list);
}

/** @returns {number} Cantidad de productos en wishlist */
export function getWishlistCount() {
    return getWishlist().length;
}
