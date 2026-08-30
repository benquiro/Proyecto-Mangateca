import { renderProductsByCategory } from '../services/RenderService.js';
import { ProductType } from '../../db/products-db.js';

function initMangas() {
    renderProductsByCategory(ProductType.MANGA, "mangas-by-category-container");
}

document.addEventListener('DOMContentLoaded', initMangas);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initMangas();
}
