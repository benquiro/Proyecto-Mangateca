import '../services/cache-service.js';
import '../services/header-service.js';
import { renderProductsByCategory } from '../services/render-service.js';
import { ProductType } from '../../db/products-db.js';

renderProductsByCategory(ProductType.COMIC, "comics-by-category-container");
