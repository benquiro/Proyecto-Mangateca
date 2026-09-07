/**
 * cart-service.js
 * Gestiona el carrito de compras mediante localStorage.
 *
 * Estructura en localStorage ("mangateca_cart"):
 *   [{ productId: number, quantity: number }, ...]
 *
 * Ruta: src/services/cart-service.js
 */

import { getProductById } from '../../db/products-db.js';

const CART_KEY = 'mangateca_cart';

/** @returns {{ productId: number, quantity: number }[]} */
export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
 * @param {number} productId
 */
export function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    saveCart(cart);
}

/**
 * Elimina un producto del carrito completamente.
 * @param {number} productId
 */
export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.productId !== productId);
    saveCart(cart);
}

/**
 * Actualiza la cantidad de un producto. Si quantity <= 0, lo elimina.
 * @param {number} productId
 * @param {number} quantity
 */
export function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
}

/** Vacía el carrito por completo. */
export function clearCart() {
    localStorage.removeItem(CART_KEY);
}

/** @returns {number} Cantidad total de items (suma de quantities) */
export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calcula el total del carrito hidratando precios desde products-db.
 * @returns {number}
 */
export function getCartTotal() {
    return getCart().reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
    }, 0);
}
