const express = require('express');

// Imports
const controller = require('../controller/promotional-offer-product');
const checkAdminAuth = require('../middileware/check-admin-auth');
const checkIpWhitelist = require('../middileware/check-ip-whitelist');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/promotional-offer-product
 * http://localhost:3000/api/promotional-offer-product
 */

router.post('/add-new-promotional-offer-product',checkIpWhitelist,checkAdminAuth, controller.addNewOfferProduct);
router.get('/get-all-promotional-offer-product-list', controller.getAllOfferProduct);
router.get('/get-promotional-offer-product-by-id/:id', controller.getSingleOfferProductById);
router.get('/get-promotional-offer-product-by-slug/:slug', controller.getOfferProductBySlug);
router.get('/get-promotional-offer-product-by-slug-multiple/:slug', controller.getOfferProductBySlugMultiple);
router.delete('/delete-promotional-offer-product-by-id/:id',checkIpWhitelist,checkAdminAuth, controller.deleteOfferProductById);
router.put('/edit-promotional-offer-product-by-id',checkIpWhitelist,checkAdminAuth, controller.editOfferProduct);


// Export router class..
module.exports = router;
