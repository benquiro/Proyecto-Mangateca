import { renderProductList } from '../services/RenderService.js';
import { ProductType, getProductsByType } from '../../db/products-db.js';

function initHome() {
    renderProductList(getProductsByType(ProductType.BOOK), "book-list");
    renderProductList(getProductsByType(ProductType.MANGA), "manga-list");
    renderProductList(getProductsByType(ProductType.COMIC), "comic-list");
}

document.addEventListener('DOMContentLoaded', initHome);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initHome();
}
