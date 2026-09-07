import '../services/cache-service.js';
import '../services/header-service.js';
import { renderDetailedProductList } from '../services/render-service.js';
import { products } from '../../db/products-db.js';

renderDetailedProductList(products, "all-products-list");
