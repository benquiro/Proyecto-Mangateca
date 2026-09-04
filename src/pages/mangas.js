import '../services/CacheService.js';
import { renderProductsByCategory } from '../services/RenderService.js';
import { ProductType } from '../../db/products-db.js';

renderProductsByCategory(ProductType.MANGA, "mangas-by-category-container");
