/**
 * login.js
 * Lógica del formulario de inicio de sesión.
 *
 * Ruta: src/pages/login.js
 */

import '../services/cache-service.js';
import '../services/header-service.js';
import { login, isLoggedIn } from '../services/auth-service.js';
import { showToast } from '../services/notification-service.js';

// Si ya hay sesión activa, redirigir al home
if (isLoggedIn()) {
    window.location.href = '../index.html';
}

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const errorMsg = document.getElementById('login-error');
const submitBtn = document.getElementById('login-submit');

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showError('Por favor completa todos los campos.');
        return;
    }

    // Estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ingresando...';

    const result = login(username, password);

    if (result.success) {
        showToast(`¡Bienvenido, ${result.user.username}!`, 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 800);
    } else {
        showError(result.error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar sesión';
    }
});

function showError(message) {
    if (!errorMsg) return;
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

// Limpiar error al escribir
[usernameInput, passwordInput].forEach(input => {
    input?.addEventListener('input', () => errorMsg?.classList.add('hidden'));
});
