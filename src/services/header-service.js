/**
 * header-service.js
 * Actualiza los badges numéricos y el menú de usuario en el header.
 * Se llama al cargar cada página y tras cada acción del usuario.
 *
 * Ruta: src/services/header-service.js
 */

import { getCartCount } from './cart-service.js';
import { getWishlistCount } from './wishlist-service.js';
import { getSession, logout } from './auth-service.js';

const ROOT = new URL('../../', import.meta.url).href;

// ─── Badges ───────────────────────────────────────────────────────────────────

/**
 * Actualiza los badges del carrito y de la wishlist en el header.
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

// ─── Menú de usuario ─────────────────────────────────────────────────────────

/**
 * Renderiza el área de usuario en el header:
 * - Sin sesión: ícono de usuario → link a login.html
 * - Con sesión: nombre del usuario + dropdown (admin panel / cerrar sesión)
 */
export function updateUserMenu() {
    const container = document.getElementById('user-menu-container');
    if (!container) return;

    const session = getSession();

    if (!session) {
        container.innerHTML = `
            <a href="${ROOT}pages/login.html" aria-label="Ingresar">
                <img src="${ROOT}assets/icons/user.svg" class="w-5 h-5" alt="Icono de inicio de sesión">
            </a>
        `;
        return;
    }

    const adminLink = session.role === 'admin'
        ? `<a href="${ROOT}pages/admin.html" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
               <img src="${ROOT}assets/icons/shield.svg" class="w-4 h-4 opacity-70" alt="">
               Panel Admin
           </a>`
        : '';

    container.innerHTML = `
        <div class="relative" id="user-dropdown-wrapper">
            <button
                id="user-menu-btn"
                class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                aria-haspopup="true"
                aria-expanded="false"
            >
                <img src="${ROOT}assets/icons/user.svg" class="w-5 h-5" alt="">
                <span>${session.username}</span>
                <svg class="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>

            <div
                id="user-dropdown"
                class="hidden absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden"
                role="menu"
            >
                ${adminLink}
                <button
                    id="btn-logout"
                    class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    role="menuitem"
                >
                    <img src="${ROOT}assets/icons/logout.svg" class="w-4 h-4 opacity-70" alt="">
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;

    // Ocultar carrito y favoritos para el admin
    if (session.role === 'admin') {
        const wishlistBadge = document.getElementById('wishlist-badge');
        const cartBadge = document.getElementById('cart-badge');
        if (wishlistBadge) wishlistBadge.closest('li').style.display = 'none';
        if (cartBadge) cartBadge.closest('li').style.display = 'none';
    }

    // Toggle dropdown
    const btn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden', isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', () => {
        dropdown?.classList.add('hidden');
        btn?.setAttribute('aria-expanded', 'false');
    }, { once: false, capture: false });

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        logout();
        window.location.href = `${ROOT}index.html`;
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function initHeader() {
    updateHeaderBadges();
    updateUserMenu();
}

// Inicializar al cargar el módulo (en cualquier página)
document.addEventListener('DOMContentLoaded', initHeader);

// Actualizar badges al volver a la página (caché del navegador o bfcache)
window.addEventListener('pageshow', initHeader);

// Sincronizar badges si se actualiza el almacenamiento en otra pestaña o script
window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('mangateca_cart') || event.key?.startsWith('mangateca_wishlist')) {
        updateHeaderBadges();
    }
});
