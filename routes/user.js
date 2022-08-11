// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/user');
const inputValidator = require('../validation/user');
const checkAuth = require('../middileware/check-user-auth');
const checkAdminAuth = require('../middileware/check-admin-auth');

const router = express.Router();

/**
 * /api/user
 * http://localhost:3000/api/user
 */


router.post('/registration', controller.userRegistrationDefault);
router.put('/login', controller.userLoginDefault);
router.post('/facebook-login', controller.userFacebookAuth);
router.get('/logged-in-user-data', checkAuth, controller.getLoginUserInfo);
router.put('/edit-logged-in-user-data', checkAuth, controller.editLoginUserInfo);
router.get('/get-all-user-list', checkAdminAuth, controller.getUserLists);
router.get('/check-user-by-phone/:phoneNo', controller.checkUserByPhone)

// ADDRESS
router.post('/add-address', checkAuth, controller.addAddress);
router.put('/edit-address', checkAuth, controller.editAddress);
router.get('/get-addresses', checkAuth, controller.getAddresses);
router.delete('/delete-address-by-id/:id', checkAuth, controller.deleteUserAddress);
// ADMIN
router.put('/edit-user-access/:id', controller.editUserAccess);

// Export All router..
module.exports = router;
