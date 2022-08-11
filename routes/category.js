const express = require('express');

// Imports
const controller = require('../controller/category');
const inputValidator = require('../validation/category');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/category
 * http://localhost:3000/api/category
 */

router.post('/add-new-category', controller.addNewCategory);
router.get('/get-all-category-list', controller.getAllCategory);
router.get('/get-category-basic-list', controller.getCategoryBasicList);
router.get('/get-category-details-by-id/:id', controller.getASingleCategoryById);
router.get('/get-category-details-by-slug/:slug', controller.getASingleCategoryBySlug);
router.delete('/delete-category-by-id/:id', controller.deleteCategoryById);
router.post('/edit-category-by-id/', controller.editCategoryData);
router.get('/get-category-filter/:slug', controller.getCategoryFilter);
router.post('/get-product-by-category-filter/', controller.filterByCatFilters);
router.post('/get-product-by-category-subcat-brand-filter/', controller.filterByCatSubCatBrandFilters);


// Export router class..
module.exports = router;

