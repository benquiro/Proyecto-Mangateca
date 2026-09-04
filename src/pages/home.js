import '../services/CacheService.js';
import { renderProductList, renderDetailedProductList } from '../services/RenderService.js';
import { ProductType, getProductsByType, searchProductsByTitle } from '../../db/products-db.js';

// Render default categories
renderProductList(getProductsByType(ProductType.BOOK), "book-list");
renderProductList(getProductsByType(ProductType.MANGA), "manga-list");
renderProductList(getProductsByType(ProductType.COMIC), "comic-list");

// Search logic
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const searchResultsList = document.getElementById('search-results-list');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query.trim().length > 0) {
            searchDropdown.classList.remove('hidden');
            
            const results = searchProductsByTitle(query);
            searchResultsList.innerHTML = '';
            
            if (results.length > 0) {
                const html = results.map(item => `
                    <li>
                        <a href="./pages/product-detail.html?id=${item.id}" class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <img src="${item.imageUrl}" alt="${item.title}" class="w-12 h-16 object-cover rounded shadow-sm">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-gray-900 text-sm truncate">${item.title}</h4>
                                <p class="text-xs text-gray-500 truncate">${item.author}</p>
                            </div>
                            <span class="font-extrabold text-indigo-600 text-sm">$${item.price.toFixed(2)}</span>
                        </a>
                    </li>
                `).join('');
                searchResultsList.innerHTML = html;
            } else {
                searchResultsList.innerHTML = '<li class="p-6 text-center text-gray-500">No se encontraron productos.</li>';
            }
        } else {
            searchDropdown.classList.add('hidden');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.add('hidden');
        }
    });

    // Re-open on focus if there's text
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
            searchDropdown.classList.remove('hidden');
        }
    });
}
