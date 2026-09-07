/**
 * admin.js
 * Lógica del panel de administración.
 * Gestiona el CRUD de productos y usuarios.
 *
 * Ruta: src/pages/admin.js
 */

import '../services/cache-service.js';
import '../services/header-service.js';
import { requireAdmin } from '../services/auth-service.js';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../db/products-db.js';
import { getUsers, createUser, updateUser, deleteUser } from '../../db/users-db.js';
import { showToast } from '../services/notification-service.js';
import { ProductType, categories } from '../../db/products-db.js';

// Guardia: solo admin puede acceder
requireAdmin('../pages/login.html');

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const tabProducts = document.getElementById('tab-products');
const tabUsers = document.getElementById('tab-users');
const sectionProducts = document.getElementById('section-products');
const sectionUsers = document.getElementById('section-users');

tabProducts?.addEventListener('click', () => switchTab('products'));
tabUsers?.addEventListener('click', () => switchTab('users'));

function switchTab(tab) {
    const isProducts = tab === 'products';

    tabProducts.classList.toggle('border-indigo-600', isProducts);
    tabProducts.classList.toggle('text-indigo-600', isProducts);
    tabProducts.classList.toggle('border-transparent', !isProducts);
    tabProducts.classList.toggle('text-gray-500', !isProducts);

    tabUsers.classList.toggle('border-indigo-600', !isProducts);
    tabUsers.classList.toggle('text-indigo-600', !isProducts);
    tabUsers.classList.toggle('border-transparent', isProducts);
    tabUsers.classList.toggle('text-gray-500', isProducts);

    sectionProducts.classList.toggle('hidden', !isProducts);
    sectionUsers.classList.toggle('hidden', isProducts);
}

// ─── Utilidades de Modal ──────────────────────────────────────────────────────

const modal = document.getElementById('admin-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function openModal(title, bodyHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// ─── CRUD de Productos ────────────────────────────────────────────────────────

function renderProductsTable() {
    const container = document.getElementById('products-table-container');
    if (!container) return;

    const productList = getProducts();
    const typeLabels = { BOOK: 'Libro', MANGA: 'Manga', COMIC: 'Comic' };

    if (productList.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-12">No hay productos.</p>';
        return;
    }

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <th class="pb-3 pr-4">ID</th>
                        <th class="pb-3 pr-4">Portada</th>
                        <th class="pb-3 pr-4">Título</th>
                        <th class="pb-3 pr-4">Tipo</th>
                        <th class="pb-3 pr-4">Autor</th>
                        <th class="pb-3 pr-4">Precio</th>
                        <th class="pb-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    ${productList.map(p => `
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="py-3 pr-4 text-gray-400">#${p.id}</td>
                            <td class="py-3 pr-4">
                                <a href="../pages/product-detail.html?id=${p.id}" class="block hover:opacity-80 transition-opacity">
                                    <img src="${p.imageUrl}" alt="" class="w-10 h-14 object-cover rounded shadow-sm">
                                </a>
                            </td>
                            <td class="py-3 pr-4 font-medium text-gray-900 max-w-[200px] truncate">${p.title}</td>
                            <td class="py-3 pr-4 text-gray-500">${typeLabels[p.type] ?? p.type}</td>
                            <td class="py-3 pr-4 text-gray-500 max-w-[140px] truncate">${p.author}</td>
                            <td class="py-3 pr-4 font-semibold text-indigo-600">$${p.price.toFixed(2)}</td>
                            <td class="py-3">
                                <div class="flex gap-2">
                                    <button
                                        class="btn-edit-product px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                        data-id="${p.id}"
                                    >Editar</button>
                                    <button
                                        class="btn-delete-product px-3 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                        data-id="${p.id}"
                                    >Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Eventos de tabla
    container.querySelectorAll('.btn-edit-product').forEach(btn => {
        btn.addEventListener('click', () => openProductForm(Number(btn.dataset.id)));
    });

    container.querySelectorAll('.btn-delete-product').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
            deleteProduct(Number(btn.dataset.id));
            showToast('Producto eliminado', 'info');
            renderProductsTable();
        });
    });
}

function productFormHtml(product = null) {
    const categoryOptions = categories.map(c =>
        `<option value="${c.id}" ${product?.categoryIds?.includes(c.id) ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    return `
        <form id="product-form" class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Título *</label>
                    <input type="text" name="title" value="${product?.title ?? ''}" required
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Tipo *</label>
                    <select name="type" required class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                        <option value="BOOK" ${product?.type === 'BOOK' ? 'selected' : ''}>Libro</option>
                        <option value="MANGA" ${product?.type === 'MANGA' ? 'selected' : ''}>Manga</option>
                        <option value="COMIC" ${product?.type === 'COMIC' ? 'selected' : ''}>Comic</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Precio *</label>
                    <input type="number" name="price" value="${product?.price ?? ''}" step="0.01" min="0" required
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Autor *</label>
                    <input type="text" name="author" value="${product?.author ?? ''}" required
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">ISBN</label>
                    <input type="text" name="isbn" value="${product?.isbn ?? ''}"
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Fecha publicación</label>
                    <input type="date" name="publicationDate" value="${product?.publicationDate ?? ''}"
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">URL de imagen</label>
                    <input type="url" name="imageUrl" value="${product?.imageUrl ?? ''}"
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                </div>
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Categorías</label>
                    <select name="categoryIds" multiple
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm h-28">
                        ${categoryOptions}
                    </select>
                    <span class="text-xs text-gray-400">Ctrl+click / Cmd+click para seleccionar varias</span>
                </div>
                <div class="col-span-2 flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Descripción</label>
                    <textarea name="description" rows="3"
                        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    >${product?.description ?? ''}</textarea>
                </div>
                <div class="col-span-2 flex items-center gap-2">
                    <input type="checkbox" name="available" id="chk-available" ${product?.available !== false ? 'checked' : ''}
                        class="w-4 h-4 rounded text-indigo-600">
                    <label for="chk-available" class="text-sm font-semibold text-gray-700">Disponible (en stock)</label>
                </div>
            </div>

            <div class="flex gap-3 pt-2">
                <button type="submit"
                    class="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                    ${product ? 'Guardar cambios' : 'Agregar producto'}
                </button>
                <button type="button" id="modal-cancel"
                    class="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                    Cancelar
                </button>
            </div>
        </form>
    `;
}

function openProductForm(productId = null) {
    const product = productId ? getProducts().find(p => p.id === productId) : null;
    openModal(product ? 'Editar producto' : 'Agregar producto', productFormHtml(product));

    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('product-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);

        const categoryIds = [...e.target.querySelector('[name="categoryIds"]').selectedOptions]
            .map(opt => Number(opt.value));

        const data = {
            title: fd.get('title').trim(),
            type: fd.get('type'),
            author: fd.get('author').trim(),
            price: parseFloat(fd.get('price')),
            isbn: fd.get('isbn').trim() || null,
            publicationDate: fd.get('publicationDate') || '',
            imageUrl: fd.get('imageUrl').trim() || '',
            description: fd.get('description').trim(),
            available: fd.has('available'),
            categoryIds,
        };

        if (!data.title || !data.author || isNaN(data.price)) {
            showToast('Completa los campos obligatorios', 'error');
            return;
        }

        if (product) {
            updateProduct(product.id, data);
            showToast('Producto actualizado ✓', 'success');
        } else {
            addProduct(data);
            showToast('Producto agregado ✓', 'success');
        }

        closeModal();
        renderProductsTable();
    });
}

document.getElementById('btn-add-product')?.addEventListener('click', () => openProductForm());

// ─── CRUD de Usuarios ─────────────────────────────────────────────────────────

function renderUsersTable() {
    const container = document.getElementById('users-table-container');
    if (!container) return;

    const userList = getUsers();
    const roleLabels = { admin: 'Admin', client: 'Cliente' };

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <th class="pb-3 pr-4">ID</th>
                        <th class="pb-3 pr-4">Usuario</th>
                        <th class="pb-3 pr-4">Email</th>
                        <th class="pb-3 pr-4">Rol</th>
                        <th class="pb-3 pr-4">Creado</th>
                        <th class="pb-3">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    ${userList.map(u => `
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="py-3 pr-4 text-gray-400">#${u.id}</td>
                            <td class="py-3 pr-4 font-medium text-gray-900">${u.username}</td>
                            <td class="py-3 pr-4 text-gray-500">${u.email}</td>
                            <td class="py-3 pr-4">
                                <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}">
                                    ${roleLabels[u.role] ?? u.role}
                                </span>
                            </td>
                            <td class="py-3 pr-4 text-gray-400 text-xs">${new Date(u.createdAt).toLocaleDateString('es-AR')}</td>
                            <td class="py-3">
                                <div class="flex gap-2">
                                    <button
                                        class="btn-edit-user px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                        data-id="${u.id}"
                                    >Editar</button>
                                    ${u.id !== 1 ? `
                                    <button
                                        class="btn-delete-user px-3 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                        data-id="${u.id}"
                                    >Eliminar</button>` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.querySelectorAll('.btn-edit-user').forEach(btn => {
        btn.addEventListener('click', () => openUserForm(Number(btn.dataset.id)));
    });

    container.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
            const result = deleteUser(Number(btn.dataset.id));
            if (result.success) {
                showToast('Usuario eliminado', 'info');
                renderUsersTable();
            } else {
                showToast(result.error, 'error');
            }
        });
    });
}

function userFormHtml(user = null) {
    return `
        <form id="user-form" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Usuario *</label>
                <input type="text" name="username" value="${user?.username ?? ''}" required
                    class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Email *</label>
                <input type="email" name="email" value="${user?.email ?? ''}" required
                    class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">${user ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
                <input type="password" name="password" ${user ? '' : 'required'}
                    class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Rol *</label>
                <select name="role" required class="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="client" ${user?.role === 'client' ? 'selected' : ''}>Cliente</option>
                    <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </div>

            <div class="flex gap-3 pt-2">
                <button type="submit"
                    class="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                    ${user ? 'Guardar cambios' : 'Crear usuario'}
                </button>
                <button type="button" id="modal-cancel"
                    class="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                    Cancelar
                </button>
            </div>
        </form>
    `;
}

function openUserForm(userId = null) {
    const user = userId ? getUsers().find(u => u.id === userId) : null;
    openModal(user ? 'Editar usuario' : 'Crear usuario', userFormHtml(user));

    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);

    document.getElementById('user-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);

        const username = fd.get('username').trim();
        const email = fd.get('email').trim();
        const password = fd.get('password');
        const role = fd.get('role');

        if (user) {
            const data = { username, email, role };
            if (password) data.password = password;
            const result = updateUser(user.id, data);
            if (result.success) {
                showToast('Usuario actualizado ✓', 'success');
                closeModal();
                renderUsersTable();
            } else {
                showToast(result.error, 'error');
            }
        } else {
            if (!password) { showToast('La contraseña es obligatoria', 'error'); return; }
            const result = createUser({ username, email, password, role });
            if (result.success) {
                showToast('Usuario creado ✓', 'success');
                closeModal();
                renderUsersTable();
            } else {
                showToast(result.error, 'error');
            }
        }
    });
}

document.getElementById('btn-add-user')?.addEventListener('click', () => openUserForm());

// ─── Init ─────────────────────────────────────────────────────────────────────

renderProductsTable();
renderUsersTable();
