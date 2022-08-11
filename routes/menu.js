const express = require('express');

// Imports
const controller = require('../controller/menu');
const inputValidator = require('../validation/menu');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/menu
 * http://localhost:3000/api/menu
 */

router.post('/add-new-menu', inputValidator.checkInput, controller.addNewMenu);
router.get('/get-all-menu', controller.getAllMenu);
router.delete('/delete-menu-by-id/:id', controller.deleteMenuById);
router.post('/update-menu-item', controller.updateMenuItem);
router.post('/delete-menu-sub-item', controller.deleteMenuSubCat);
router.post('/update-menu-data', controller.updateMenuData);
router.post('/update-menu-sub-priority-data', controller.updateMenuSubCategoryData);
// router.get('/get-all-brand-list', controller.getAllBrands);
// router.get('/get-brand-details-by-id/:id', controller.getASingleBrandById);
// router.get('/get-brand-details-by-slug/:slug', controller.getASingleBrandBySlug);
// router.post('/edit-brand-by-id/', controller.editBrandData);


// Export router class..
module.exports = router;
