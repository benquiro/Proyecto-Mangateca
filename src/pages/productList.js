import { renderDetailedProductList } from '../services/RenderService.js';
import { products } from '../../db/products-db.js';

function initProductList() {
    renderDetailedProductList(products, "all-products-list");
}

document.addEventListener('DOMContentLoaded', initProductList);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initProductList();
}
