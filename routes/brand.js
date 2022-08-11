const express = require('express');

// Imports
const controller = require('../controller/brand');
const inputValidator = require('../validation/brand');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/brand
 * http://localhost:3000/api/brand
 */

router.post('/add-new-brand', controller.addNewBrand);
router.get('/get-all-brand-list', controller.getAllBrands);
router.get('/get-brand-details-by-id/:id', controller.getASingleBrandById);
router.get('/get-brand-details-by-slug/:slug', controller.getASingleBrandBySlug);
router.delete('/delete-brand-by-id/:id', controller.deleteBrandById);
router.post('/edit-brand-by-id/', controller.editBrandData);


// Export router class..
module.exports = router;
