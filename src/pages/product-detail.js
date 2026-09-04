import '../services/cache-service.js';
import { getProductById, getCategoriesForProduct } from '../../db/products-db.js';
import { renderFullProductDetail } from '../components/product-card.js';

function showError(container, message) {
    container.innerHTML = `
        <div class="text-center py-20 flex flex-col items-center">
            <h1 class="text-4xl font-extrabold text-gray-900 mb-4">¡Ups!</h1>
            <p class="text-xl text-gray-500 mb-8 max-w-md">${message}</p>
            <a href="./product-list.html" class="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors">
                Ver Catálogo Completo
            </a>
        </div>
    `;
}

const container = document.getElementById("product-detail-container");
if (container) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (!idParam) {
        showError(container, "No se ha especificado un producto válido.");
    } else {
        const productId = Number(idParam);
        const product = getProductById(productId);

        if (!product) {
            showError(container, "El producto que buscas no existe o ha sido eliminado.");
        } else {
            document.title = `Mangateca - ${product.title}`;
            const categories = getCategoriesForProduct(productId);
            container.innerHTML = renderFullProductDetail(product, categories);
        }
    }
}
