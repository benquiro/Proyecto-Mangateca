import '../services/CacheService.js';
import { renderDetailedProductList } from '../services/RenderService.js';
import { products } from '../../db/products-db.js';

renderDetailedProductList(products, "all-products-list");
