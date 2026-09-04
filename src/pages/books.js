import '../services/CacheService.js';
import { renderProductsByCategory } from '../services/RenderService.js';
import { ProductType } from '../../db/products-db.js';

renderProductsByCategory(ProductType.BOOK, "books-by-category-container");
