/**
 * users-db.js
 * Base de datos provisoria de usuarios gestionada con localStorage.
 *
 * Estructura en localStorage ("mangateca_users"):
 *   [{ id, username, email, password, role, createdAt }, ...]
 *
 * Roles disponibles: 'client' | 'admin'
 *
 * Ruta: db/users-db.js
 */

const USERS_KEY = 'mangateca_users';

// ─── Usuarios semilla ────────────────────────────────────────────────────────

const DEFAULT_USERS = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@mangateca.com',
        password: 'Admin_Manga2026!',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 2,
        username: 'cliente',
        email: 'cliente@mangateca.com',
        password: 'Cliente_Manga2026!',
        role: 'client',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
];

/**
 * Inicializa la BD con los usuarios semilla si no existen todavía.
 * Se llama automáticamente al importar el módulo.
 */
export function initDefaultUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

// ─── Lectura ─────────────────────────────────────────────────────────────────

/** @returns {object[]} */
export function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
    } catch {
        return [];
    }
}

/**
 * @param {number} id
 * @returns {object|undefined}
 */
export function getUserById(id) {
    return getUsers().find(u => u.id === id);
}

/**
 * @param {string} username
 * @returns {object|undefined}
 */
export function getUserByUsername(username) {
    return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * @param {string} email
 * @returns {object|undefined}
 */
export function getUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

// ─── Escritura ────────────────────────────────────────────────────────────────

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function nextId(users) {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

/**
 * Crea un nuevo usuario con rol 'client' por defecto.
 * @param {{ username: string, email: string, password: string, role?: string }} data
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function createUser({ username, email, password, role = 'client' }) {
    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'El nombre de usuario ya está en uso.' };
    }

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'El email ya está registrado.' };
    }

    const newUser = {
        id: nextId(users),
        username,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, user: newUser };
}

/**
 * Actualiza los datos de un usuario.
 * @param {number} id
 * @param {Partial<{username, email, password, role}>} data
 * @returns {{ success: boolean, error?: string }}
 */
export function updateUser(id, data) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return { success: false, error: 'Usuario no encontrado.' };

    if (data.username) {
        const conflict = users.find(u => u.username.toLowerCase() === data.username.toLowerCase() && u.id !== id);
        if (conflict) return { success: false, error: 'El nombre de usuario ya está en uso.' };
    }

    if (data.email) {
        const conflict = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.id !== id);
        if (conflict) return { success: false, error: 'El email ya está registrado.' };
    }

    users[index] = { ...users[index], ...data };
    saveUsers(users);

    return { success: true };
}

/**
 * Elimina un usuario. No permite eliminar al admin semilla (id=1).
 * @param {number} id
 * @returns {{ success: boolean, error?: string }}
 */
export function deleteUser(id) {
    if (id === 1) return { success: false, error: 'No se puede eliminar al administrador principal.' };

    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);

    return { success: true };
}

// ─── Init automático ─────────────────────────────────────────────────────────
initDefaultUsers();
