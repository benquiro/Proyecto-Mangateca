/**
 * register.js
 * Lógica del formulario de registro de nuevos usuarios.
 *
 * Ruta: src/pages/register.js
 */

import '../services/cache-service.js';
import '../services/header-service.js';
import { isLoggedIn, login } from '../services/auth-service.js';
import { createUser } from '../../db/users-db.js';
import { showToast } from '../services/notification-service.js';

// Si ya hay sesión activa, redirigir al home
if (isLoggedIn()) {
    window.location.href = '../index.html';
}

const form = document.getElementById('register-form');
const usernameInput = document.getElementById('reg-username');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const confirmInput = document.getElementById('reg-confirm');
const errorMsg = document.getElementById('register-error');
const submitBtn = document.getElementById('register-submit');

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    // Validaciones
    if (!username || !email || !password || !confirm) {
        showError('Por favor completa todos los campos.');
        return;
    }

    if (password !== confirm) {
        showError('Las contraseñas no coinciden.');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando cuenta...';

    const result = createUser({ username, email, password, role: 'client' });

    if (result.success) {
        // Login automático tras registro exitoso
        login(username, password);
        showToast(`¡Cuenta creada! Bienvenido, ${username}`, 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 800);
    } else {
        showError(result.error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear cuenta';
    }
});

function showError(message) {
    if (!errorMsg) return;
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

// Limpiar error al escribir
[usernameInput, emailInput, passwordInput, confirmInput].forEach(input => {
    input?.addEventListener('input', () => errorMsg?.classList.add('hidden'));
});
