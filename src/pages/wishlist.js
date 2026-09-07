/**
 * wishlist.js
 * Lógica de la página de wishlist (favoritos).
 * Hidrata los productIds del localStorage con datos de products-db.
 *
 * Ruta: src/pages/wishlist.js
 */

import '../services/cache-service.js';
import '../services/header-service.js';
import { getWishlist, removeFromWishlist } from '../services/wishlist-service.js';
import { addToCart } from '../services/cart-service.js';
import { getProductById } from '../../db/products-db.js';
import { showToast } from '../services/notification-service.js';
import { updateHeaderBadges } from '../services/header-service.js';

const ROOT = new URL('../../', import.meta.url).href;
const container = document.getElementById('wishlist-container');

function renderWishlist() {
    const ids = getWishlist();

    if (ids.length === 0) {
        renderEmpty();
        return;
    }

    // Hidratar IDs con datos reales
    const products = ids
        .map(id => getProductById(id))
        .filter(Boolean); // filtrar IDs huérfanos

    const cardsHtml = products.map(product => `
        <div class="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group" data-product-id="${product.id}">
            <!-- Portada -->
            <a href="${ROOT}pages/product-detail.html?id=${product.id}" class="block overflow-hidden aspect-[2/3] relative bg-gray-100">
                <img
                    src="${product.imageUrl}"
                    alt="Portada de ${product.title}"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                >
            </a>

            <!-- Info -->
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="font-bold text-gray-900 line-clamp-2 mb-1 text-sm sm:text-base" title="${product.title}">
                    ${product.title}
                </h3>
                <p class="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-1">${product.author}</p>
                <div class="mt-auto">
                    <span class="font-extrabold text-indigo-600 text-lg block mb-3">$${product.price.toFixed(2)}</span>

                    <div class="flex gap-2">
                        <!-- Añadir al carrito -->
                        <button
                            class="btn-add-cart flex-1 bg-indigo-600 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                            data-id="${product.id}"
                            aria-label="Añadir al carrito"
                        >
                            <img src="${ROOT}assets/icons/cart-add.svg" alt="" class="w-4 h-4 filter invert">
                            Añadir
                        </button>

                        <!-- Quitar de favoritos -->
                        <button
                            class="btn-remove-wishlist bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                            data-id="${product.id}"
                            aria-label="Quitar de favoritos"
                        >
                            <div class="w-4 h-4 bg-current" style="mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain; -webkit-mask: url('${ROOT}assets/icons/favorite.svg') no-repeat center / contain;"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6" id="wishlist-grid">
            ${cardsHtml}
        </div>
    `;

    attachWishlistEvents();
}

function renderEmpty() {
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-24 h-24 mb-6 opacity-20">
                <img src="${ROOT}assets/icons/favorite.svg" alt="" class="w-full h-full">
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Tu lista de favoritos está vacía</h3>
            <p class="text-gray-500 mb-8 max-w-sm">Explorá el catálogo y guardá los productos que más te gusten para encontrarlos fácilmente.</p>
            <a href="${ROOT}pages/product-list.html" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-indigo-700 transition-colors">
                Ver catálogo
            </a>
        </div>
    `;
}

function attachWishlistEvents() {
    // Añadir al carrito
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            addToCart(id);
            showToast('Añadido al carrito 🛒');
            updateHeaderBadges();
        });
    });

    // Quitar de favoritos
    container.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            removeFromWishlist(id);
            showToast('Quitado de favoritos', 'info');
            updateHeaderBadges();

            // Remover la card del DOM con animación
            const card = btn.closest('[data-product-id]');
            if (card) {
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.remove();
                    // Si no quedan más, mostrar estado vacío
                    if (getWishlist().length === 0) renderEmpty();
                }, 300);
            }
        });
    });
}

// Render inicial
renderWishlist();
