import { renderProductsByCategory } from '../services/RenderService.js';
import { ProductType } from '../../db/products-db.js';

function initComics() {
    renderProductsByCategory(ProductType.COMIC, "comics-by-category-container");
}

document.addEventListener('DOMContentLoaded', initComics);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initComics();
}
