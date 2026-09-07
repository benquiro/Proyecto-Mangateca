/**
 * auth-service.js
 * Gestiona la sesión activa del usuario via localStorage.
 *
 * Estructura en localStorage ("mangateca_session"):
 *   { userId: number, username: string, role: 'client' | 'admin' }
 *
 * Ruta: src/services/auth-service.js
 */

import { getUserByUsername } from '../../db/users-db.js';

const SESSION_KEY = 'mangateca_session';

// ─── Sesión ───────────────────────────────────────────────────────────────────

/**
 * @returns {{ userId: number, username: string, role: string } | null}
 */
export function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}

/** @returns {boolean} */
export function isLoggedIn() {
    return getSession() !== null;
}

/** @returns {boolean} */
export function isAdmin() {
    return getSession()?.role === 'admin';
}

// ─── Login / Logout ───────────────────────────────────────────────────────────

/**
 * Valida credenciales y guarda la sesión.
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function login(username, password) {
    const user = getUserByUsername(username);

    if (!user) {
        return { success: false, error: 'Usuario no encontrado.' };
    }

    if (user.password !== password) {
        return { success: false, error: 'Contraseña incorrecta.' };
    }

    const session = { userId: user.id, username: user.username, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true, user: session };
}

/**
 * Cierra la sesión actual.
 */
export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

// ─── Guards de navegación ─────────────────────────────────────────────────────

/**
 * Redirige a la URL indicada si no hay sesión activa.
 * @param {string} [redirectUrl]
 */
export function requireAuth(redirectUrl = '../pages/login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
    }
}

/**
 * Redirige si el usuario no es administrador.
 * @param {string} [redirectUrl]
 */
export function requireAdmin(redirectUrl = '../pages/login.html') {
    if (!isAdmin()) {
        window.location.href = redirectUrl;
    }
}
