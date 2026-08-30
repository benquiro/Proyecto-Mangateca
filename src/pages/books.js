import { renderProductsByCategory } from '../services/RenderService.js';
import { ProductType } from '../../db/products-db.js';

function initBooks() {
    renderProductsByCategory(ProductType.BOOK, "books-by-category-container");
}

document.addEventListener('DOMContentLoaded', initBooks);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initBooks();
}
