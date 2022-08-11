/**
 * NODEJS API
 * DATABASE MONGODB
 * VERSION 1.0.0
 * POWERED BY SOFTLAB IT
 * DEVELOP BY MD IQBAL HOSSEN
 */
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();

// Cross Unblocked File..
const cors = require("cors");
const errorHandler = require("./middileware/error-handler");

/**
 *  Router File Import
 */
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const featuredCategoryRoutes = require("./routes/featured-category");
const subCategoryRoutes = require("./routes/sub-category");
const bookRoutes = require("./routes/book");
const productRoutes = require("./routes/product");
const bazaarRoutes = require("./routes/bazaar");
const uploadRoutes = require("./routes/upload");
const checkoutRoutes = require("./routes/checkout");
const orderRoutes = require("./routes/order");
const orderTempRoutes = require("./routes/order-temporary");
const menuRoutes = require("./routes/menu");
const shopRoutes = require("./routes/shop");
const testRoutes = require("./routes/test");
const wishlistRoutes = require("./routes/wishlist");
const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");
const reviewRoutes = require("./routes/reviews");
const reviewControlRoutes = require("./routes/review-control");
const shippingChargeRoutes = require("./routes/shipping-charge");
const backupRestoreRoutes = require("./routes/backup-restore");
const galleryRoutes = require("./routes/gallery");
const imageFolderRoutes = require("./routes/image-folder");
const featuredProductRoutes = require("./routes/featured-product");
const PromotionalOfferProductRoutes = require("./routes/promotional-offer-product");
const PromotionalOfferRoutes = require("./routes/promotional-offer");
const OfferCategoryCardRoutes = require("./routes/offer-category-card");
// Payment SSL
const paymentSSLRoutes = require("./routes/payment-ssl");

/**
 * MAIN APP CONFIG
 * REPLACE BODY PARSER WITH EXPRESS PARSER
 */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * IMAGE UPLOAD STATIC DIR
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * MAIN BASE ROUTER WITH IMPORTED ROUTES
 */
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/featured-category", featuredCategoryRoutes);
app.use("/api/sub-category", subCategoryRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/product", productRoutes);
app.use("/api/bazaar", bazaarRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/test", testRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/order-temporary", orderTempRoutes);
app.use("/api/review-control", reviewControlRoutes);
app.use("/api/payment-ssl", paymentSSLRoutes);
app.use("/api/shipping-charge", shippingChargeRoutes);
app.use("/api/backup-restore", backupRestoreRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/image-folder", imageFolderRoutes);
app.use("/api/featured-product", featuredProductRoutes);
app.use("/api/promotional-offer", PromotionalOfferRoutes);
app.use("/api/promotional-offer-product", PromotionalOfferProductRoutes);
app.use("/api/offer-category-card", OfferCategoryCardRoutes);
/**
 * MAIN BASE GET PATH
 */
app.get("/", (req, res) => {
  res.send(
    '<div style="width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center"><h1 style="color: blueviolet">API RUNNING...</h1><p style="color: lightcoral">Powered by SOFTLAB IT TEAM</p></div>'
  );
});

/**
 * Error Handler
 * 401 UnAuthorized, Access Denied
 * 406 Already Exists, Not Acceptable
 * 404 Not Found
 * 422 Input Validation Error, Unprocessable Entity
 * 500 Database Operation Error, Internal Server Error
 */
app.use(errorHandler.route);
app.use(errorHandler.next);

/**
 * NODEJS SERVER
 * PORT CONTROL
 * MongoDB Connection
 * IF PASSWORD contains @ then encode with https://meyerweb.com/eric/tools/dencoder/
 * Database Name roc-ecommerce
 * User Access authSource roc-ecommerce
 */
mongoose
  .connect(
    // `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/${process.env.DB_NAME}?authSource=${process.env.AUTH_SOURCE}`,
    `mongodb://localhost:27017/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server is running at port:${port}`));
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("Oops! Could not connect to mongoDB Cluster0", err);
  });
