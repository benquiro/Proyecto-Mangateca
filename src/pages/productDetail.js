import { getProductById, getCategoriesForProduct } from '../../db/products-db.js';
import { renderFullProductDetail } from '../components/ProductCard.js';

function initProductDetail() {
    const container = document.getElementById("product-detail-container");
    if (!container) return;

    // Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (!idParam) {
        showError(container, "No se ha especificado un producto válido.");
        return;
    }

    const productId = Number(idParam);
    const product = getProductById(productId);

    if (!product) {
        showError(container, "El producto que buscas no existe o ha sido eliminado.");
        return;
    }

    // Set page title
    document.title = `Mangateca - ${product.title}`;

    // Get category objects for tags
    const categories = getCategoriesForProduct(productId);

    // Render HTML
    container.innerHTML = renderFullProductDetail(product, categories);
}

function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-20 flex flex-col items-center">
            <h1 class="text-4xl font-extrabold text-gray-900 mb-4">¡Ups!</h1>
            <p class="text-xl text-gray-500 mb-8 max-w-md">${message}</p>
            <a href="../pages/product-list.html" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                Ver Catálogo Completo
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initProductDetail);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initProductDetail();
}
