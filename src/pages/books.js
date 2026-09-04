import '../services/cache-service.js';
import { renderProductsByCategory } from '../services/render-service.js';
import { ProductType } from '../../db/products-db.js';

renderProductsByCategory(ProductType.BOOK, "books-by-category-container");
