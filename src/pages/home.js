import '../services/cache-service.js';
import '../services/header-service.js';
import { renderProductList, renderDetailedProductList } from '../services/render-service.js';
import { getProducts, searchProductsByTitle } from '../../db/products-db.js';

const allProducts = getProducts();

// Novedades: últimos agregados o invertimos el array
const newReleases = [...allProducts].reverse().slice(0, 8);

// Más vendidos: Hardcodeado basado en la realidad (Los más vendidos históricamente)
// One Piece (4), Harry Potter (10), El Señor de los Anillos (11), El Principito (8), Cien años de soledad (1), Death Note (24), Astérix (36), The Walking Dead (31), Watchmen (5), Fullmetal Alchemist (22), El diario de Ana Frank (14), El alquimista (12)
const bestsellers = allProducts.filter(p => [4, 10, 11, 8, 1, 24, 36, 31, 5, 22, 14, 12].includes(p.id));

// Recomendados: Hardcodeado basado en obras maestras aclamadas por la crítica
// Berserk (3), JoJo SBR (20), Vagabond (21), The Sandman (29), Batman TDKR (26), V de Vendetta (28), Persépolis (33), Akira (25), 1984 (2), Un mundo feliz (18), Frankenstein (15), Drácula (16)
const recommended = allProducts.filter(p => [3, 20, 21, 29, 26, 28, 33, 25, 2, 18, 15, 16].includes(p.id));

// Renderizar secciones
renderProductList(newReleases, "new-releases-list");
renderProductList(bestsellers, "bestsellers-list");
renderProductList(recommended, "recommended-list");

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
