const express = require("express");

// Imports
const controller = require("../controller/shop");
const inputValidator = require("../validation/shop");
const checkAdminAuth = require("../middileware/check-admin-auth");

// Get Express Router Function..
const router = express.Router();

/**
 * /api/shop
 * http://localhost:3000/api/shop
 */

router.post(
  "/add-new-carousel",
  inputValidator.checkCarouselInput,
  controller.addNewCarousel
);
router.get("/get-all-carousel", controller.getAllCarousel);
router.get("/get-carousel-by-id/:id", controller.getSingleCarouselById);
router.put("/edit-carousel-by-id", controller.editCarousel);
router.delete("/delete-carousel-by-id/:id", controller.deleteCarouselById);
// Offer Banner
router.post(
  "/add-new-offer-banner",
  checkAdminAuth,
  controller.addNewOfferBanner
);
router.post("/push-offer-banner-data", controller.pushOfferData);
router.post("/pull-offer-banner-data", controller.pullOfferData);
router.get("/get-all-offer-banner", controller.getAllOfferBanner);
router.delete(
  "/delete-offer-banner-by-id/:id",
  controller.deleteOfferBannerById
);
// Contact Info
router.post("/set-contact-info", controller.setContactInfo);
router.get("/get-contact-info", controller.getContactInfo);
// Branch Info
router.post("/set-branch-info", controller.setBranchInfo);
router.get("/get-branch-info", controller.getBranchInfo);
router.delete("/delete-branch-info-by-id/:id", controller.deleteBranchInfoById);
// Offer Product
router.post("/add-new-offer-product", controller.addOfferProduct);
router.get("/get-all-offer-product", controller.getAllOfferProduct);
router.get("/get-query-offer-product/:slug", controller.getQueryOfferProduct);
router.delete("/delete-offer-product/:id", controller.deleteOfferProductById);
// Offer Package
router.post("/add-new-offer-package", controller.addOfferPackage);
router.get("/get-all-offer-package", controller.getAllOfferPackage);
router.get("/get-query-offer-package/:id", controller.getQueryOfferPackage);
router.delete("/delete-offer-package/:id", controller.deleteOfferPackageById);
// Offer Banner Card
router.post("/add-new-offer-banner-card", controller.addOfferBannerCard);
router.get("/get-all-offer-banner-card", controller.getAllOfferBannerCard);
router.delete(
  "/delete-offer-banner-card/:id",
  controller.deleteOfferBannerCardById
);
// Page Info
router.post("/add-page-info", checkAdminAuth, controller.addNewPageInfo);
router.get("/get-page-info/:slug", controller.getPageInfoBySlug);

// Export router class..
module.exports = router;
