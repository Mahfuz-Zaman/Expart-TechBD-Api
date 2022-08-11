const express = require('express');

// Created Require Files..
const controller = require('../controller/product');
const inputValidator = require('../validation/product');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/product
 * http://localhost:3000/api/product
 */

router.post('/add-single-product', controller.addSingleProduct);
router.get('/get-all-product-list', controller.getAllProducts);
router.get('/get-single-product-by-slug/:slug', controller.getSingleProductBySlug);
router.get('/get-single-product-by-id/:id', controller.getSingleProductById);
router.get('/get-related-products/:category/:subCategory/:id', controller.getRelatedProducts);
router.post('/get-specific-products-by-ids', controller.getSpecificProductsByIds);
// Search
router.post('/get-products-by-regex-search', controller.getSearchProductByRegex);
router.get('/get-products-by-text-search', controller.getSearchProductByText);
router.post('/get-specific-books-by-id', controller.getSpecificBooksById);
// Modify
router.delete('/delete-product-by-id/:id', controller.deleteProductById);
router.post('/edit-product-data', controller.editProductData);
router.post('/edit-product-basic-data', controller.editProductBasicData);
router.post('/update-product-images', controller.updateProductImageField);
// Range
router.post('/get-max-min-price', controller.getMaxMinPrice);
router.post('/product-filter-by-menu-navigate-min-max', controller.productFilterByMinMax);
// Sort
// Filter
router.post('/product-filter-by-menu-navigate', controller.productFilterByMenu);
router.post('/product-filter-query', controller.productFilterByQuery);
// Pagination
router.get('/products-by-limit', controller.getProductsByLimit);
// Filter
router.post('/get-product-by-filter/', controller.filterByCatSubCatBrandFilters);
// Ultimate Query
router.post('/get-products-by-ultimate-query', controller.ultimateQuery)

router.post('/get-from-collection-by-search', controller.getFromCollectionBySearch);

router.post('/get-products-by-query', controller.getProductsByQuery);



// Export All router..
module.exports = router;
