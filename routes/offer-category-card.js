const express = require("express");

// Imports
const controller = require("../controller/offer-category-card");
const checkAdminAuth = require("../middileware/check-admin-auth");
const checkIpWhitelist = require("../middileware/check-ip-whitelist");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/promotional-offer
 * http://localhost:3000/api/offer-category-card
 */

router.post(
  "/add-new-offer-category-card",
  checkIpWhitelist,
  checkAdminAuth,
  controller.addNewOfferCategoryCard
);
router.post(
  "/add-new-promotional-offer-multi",
  checkIpWhitelist,
  checkAdminAuth,
  controller.addNewOfferCategoryCardMulti
);
router.get(
  "/get-all-offer-category-card-list",
  controller.getAllOfferCategoryCard
);
router.get(
  "/get-offer-category-card-by-id/:id",
  controller.getSingleOfferCategoryCardById
);
router.get(
  "/get-offer-category-card-by-slug-multiple/:slug",
  controller.getSingleOfferCategoryCardBySlug
);
router.delete(
  "/delete-offer-category-card-by-id/:id",
  checkIpWhitelist,
  checkAdminAuth,
  controller.deleteOfferCategoryCardById
);
router.post(
  "/delete-offer-category-card-by-id",
  checkIpWhitelist,
  checkAdminAuth,
  controller.deleteOfferCategoryCardMulti
);
router.put(
  "/edit-offer-category-card-by-id",
  checkIpWhitelist,
  checkAdminAuth,
  controller.editOfferCategoryCardData
);

// Export router class..
module.exports = router;
