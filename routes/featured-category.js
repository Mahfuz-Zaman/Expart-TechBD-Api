const express = require("express");

// Imports
const controller = require("../controller/featured-category");
const inputValidator = require("../validation/featured-category");
const checkAdminAuth = require("../middileware/check-admin-auth");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/brand
 * http://localhost:3000/api/featured-category
 */

router.post("/add-new-featured-category", controller.addNewFeaturedCategory);
router.get(
  "/get-all-featured-category-list",
  controller.getAllFeaturedCategories
);
router.get(
  "/edit-featured-category-by-id/:id",
  controller.getAFeaturedCategoryById
);
// router.get(
//   "/get-brand-details-by-slug/:slug",
//   controller.getASingleBrandBySlug
// );
router.delete(
  "/delete-featured-category-by-id/:id",
  controller.deleteFeaturedCategoryById
);
router.post(
  "/edit-featured-category-by-id/",
  controller.editFeaturedCategoryData
);

// Export router class..
module.exports = router;
