/**
 * notification-service.js
 * Toast notifications ligeras para confirmar acciones del usuario.
 *
 * Ruta: src/services/notification-service.js
 */

const TOAST_DURATION_MS = 2500;

/**
 * Muestra un toast en la esquina inferior derecha.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(message, type = 'success') {
    const container = getOrCreateContainer();

    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const colors = {
        success: 'bg-indigo-600 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-gray-700 text-white',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: '',
    };

    toast.className = `
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        text-sm font-medium
        transform translate-y-2 opacity-0
        transition-all duration-300 ease-out
        ${colors[type] ?? colors.success}
    `.trim().replace(/\s+/g, ' ');

    toast.innerHTML = `
        <span class="text-base font-bold">${icons[type] ?? icons.success}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        });
    });

    // Auto-remove
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, TOAST_DURATION_MS);
}

function getOrCreateContainer() {
    const existing = document.getElementById('toast-container');
    if (existing) return existing;

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none';
    document.body.appendChild(container);
    return container;
}
