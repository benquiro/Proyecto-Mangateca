/**
 * cart.js
 * Lógica de la página del carrito de compras.
 * Hidrata los productIds del localStorage con datos de products-db.
 *
 * Ruta: src/pages/cart.js
 */

import '../services/cache-service.js';
import '../services/header-service.js';
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '../services/cart-service.js';
import { addToCart } from '../services/cart-service.js';
import { getProductById } from '../../db/products-db.js';
import { showToast } from '../services/notification-service.js';
import { updateHeaderBadges } from '../services/header-service.js';

const ROOT = new URL('../../', import.meta.url).href;
const container = document.getElementById('cart-container');

function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
        renderEmpty();
        return;
    }

    // Hidratar items con datos del producto
    const hydratedItems = cart
        .map(item => ({ ...item, product: getProductById(item.productId) }))
        .filter(item => item.product); // filtrar ids huerfanos

    const itemsHtml = hydratedItems.map(({ product, quantity }) => `
        <article class="flex items-start gap-5 bg-white rounded-xl shadow-sm border border-gray-100 p-5" data-product-id="${product.id}">
            <!-- Portada -->
            <a href="${ROOT}pages/product-detail.html?id=${product.id}" class="shrink-0">
                <img
                    src="${product.imageUrl}"
                    alt="Portada de ${product.title}"
                    class="w-20 h-28 object-cover rounded-lg shadow-sm"
                    loading="lazy"
                >
            </a>

            <!-- Info -->
            <div class="flex-1 min-w-0">
                <a href="${ROOT}pages/product-detail.html?id=${product.id}" class="hover:text-indigo-600 transition-colors">
                    <h3 class="font-bold text-gray-900 text-base leading-tight mb-1 truncate">${product.title}</h3>
                </a>
                <p class="text-sm text-gray-500 mb-4 truncate">${product.author}</p>

                <!-- Cantidad -->
                <div class="flex items-center gap-3">
                    <button
                        class="btn-qty-decrease w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                        data-id="${product.id}"
                        aria-label="Disminuir cantidad"
                    >−</button>
                    <span class="qty-display font-semibold text-gray-900 min-w-[20px] text-center">${quantity}</span>
                    <button
                        class="btn-qty-increase w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                        data-id="${product.id}"
                        aria-label="Aumentar cantidad"
                    >+</button>
                </div>
            </div>

            <!-- Precio y eliminar -->
            <div class="flex flex-col items-end justify-between h-28 shrink-0">
                <button
                    class="btn-remove text-gray-400 hover:text-red-500 transition-colors text-xl leading-none"
                    data-id="${product.id}"
                    aria-label="Eliminar del carrito"
                >✕</button>
                <span class="font-extrabold text-indigo-600 text-lg">$${(product.price * quantity).toFixed(2)}</span>
            </div>
        </article>
    `).join('');

    const total = getCartTotal();
    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Lista de items -->
            <section class="lg:col-span-2 flex flex-col gap-4" id="cart-items-list">
                ${itemsHtml}
            </section>

            <!-- Resumen -->
            <aside class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h3>

                    <div class="flex justify-between text-gray-600 mb-3">
                        <span>Productos (${itemCount})</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-gray-600 mb-6 pb-6 border-b border-gray-100">
                        <span>Envío</span>
                        <span class="text-green-600 font-medium">Gratis</span>
                    </div>
                    <div class="flex justify-between text-gray-900 font-extrabold text-xl mb-8">
                        <span>Total</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>

                    <button
                        id="btn-checkout"
                        class="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Proceder al pago
                    </button>

                    <button
                        id="btn-clear-cart"
                        class="w-full mt-3 text-gray-400 hover:text-red-500 text-sm font-medium py-2 transition-colors"
                    >
                        Vaciar carrito
                    </button>
                </div>
            </aside>
        </div>
    `;

    attachCartEvents();
}

function renderEmpty() {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-24 h-24 mb-6 opacity-20">
                <img src="${ROOT}assets/icons/shopping-cart.svg" alt="" class="w-full h-full">
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h3>
            <p class="text-gray-500 mb-8 max-w-sm">Explora el catálogo y añade productos a tu carrito para realizar tu compra.</p>
            <a href="${ROOT}pages/product-list.html" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-indigo-700 transition-colors">
                Ver catálogo
            </a>
        </div>
    `;
}

function attachCartEvents() {
    // Disminuir cantidad
    container.querySelectorAll('.btn-qty-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const cart = getCart();
            const item = cart.find(i => i.productId === id);
            updateQuantity(id, (item?.quantity ?? 1) - 1);
            updateHeaderBadges();
            renderCart();
        });
    });

    // Aumentar cantidad
    container.querySelectorAll('.btn-qty-increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            addToCart(id);
            updateHeaderBadges();
            renderCart();
        });
    });

    // Eliminar item
    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            removeFromCart(id);
            showToast('Producto eliminado del carrito', 'info');
            updateHeaderBadges();
            renderCart();
        });
    });

    // Vaciar carrito
    const btnClear = document.getElementById('btn-clear-cart');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            clearCart();
            showToast('Carrito vaciado', 'info');
            updateHeaderBadges();
            renderCart();
        });
    }

    // Checkout (placeholder)
    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            showToast('Función de pago próximamente', 'info');
        });
    }
}

// Render inicial
renderCart();
