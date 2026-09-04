import '../services/CacheService.js';
import { renderProductList } from '../services/RenderService.js';
import { ProductType, getProductsByType } from '../../db/products-db.js';

renderProductList(getProductsByType(ProductType.BOOK), "book-list");
renderProductList(getProductsByType(ProductType.MANGA), "manga-list");
renderProductList(getProductsByType(ProductType.COMIC), "comic-list");
