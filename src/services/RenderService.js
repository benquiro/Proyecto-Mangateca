import { renderSimpleProductCard, renderDetailedProductCard } from '../components/ProductCard.js';
import { getProductsByType, categoriesById } from '../../db/products-db.js';

export function renderProductList(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = items.map(renderSimpleProductCard).join("");
    container.insertAdjacentHTML("beforeend", html);
}

export function renderDetailedProductList(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = items.map(renderDetailedProductCard).join("");
    container.insertAdjacentHTML("beforeend", html);
}

export function renderProductsByCategory(productType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = getProductsByType(productType);
    
    // Group products by category
    const byCategory = {};
    
    products.forEach(product => {
        product.categoryIds.forEach(catId => {
            if (!byCategory[catId]) {
                byCategory[catId] = [];
            }
            byCategory[catId].push(product);
        });
    });

    // Sort categories alphabetically
    const categoryIds = Object.keys(byCategory).sort((a, b) => {
        const catA = categoriesById.get(Number(a))?.name || "";
        const catB = categoriesById.get(Number(b))?.name || "";
        return catA.localeCompare(catB);
    });

    let html = "";
    
    categoryIds.forEach(catId => {
        const category = categoriesById.get(Number(catId));
        if (category) {
            const categoryProducts = byCategory[catId];
            
            html += `
                <section class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">${category.name}</h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        ${categoryProducts.map(renderDetailedProductCard).join("")}
                    </div>
                </section>
            `;
        }
    });
    
    container.innerHTML = html;
}
