const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const PromotionalOffer = require("../models/promotional-offer");
const PromotionalOfferProduct = require("../models/promotional-offer-product");
// const Product = require('../models/product');
const OfferCategoryCard = require("../models/offer-category-card");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * Add PromotionalOffer
 * Get PromotionalOffer List
 */

exports.addNewOfferCategoryCard = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(
      "Input Validation Error! Please complete required information."
    );
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  try {
    const data = req.body;

    const dataExists = await OfferCategoryCard.findOne({
      link: data.link,
    }).lean();

    if (dataExists) {
      const error = new Error(
        "A Offer Category Card with this name already exists!"
      );
      error.statusCode = 406;
      next(error);
    } else {
      const dataSchema = new OfferCategoryCard(data);
      await dataSchema.save();

      res.status(200).json({
        message: " Offer Category Card Added Successfully!",
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.addNewOfferCategoryCardMulti = async (req, res, next) => {
  try {
    const data = req.body.data;
    await OfferCategoryCard.insertMany(data);

    res.status(200).json({
      message: "Multiple Product Added to Promotional Offer Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllOfferCategoryCard = async (req, res, next) => {
  try {
    let pageSize = req.query.pageSize;
    let currentPage = req.query.page;
    const select = req.query.select;

    let queryData;
    queryData = OfferCategoryCard.find()
      .populate("promotionalOffer")
      .select(select ? select : "");

    if (pageSize && currentPage) {
      queryData
        .skip(Number(pageSize) * (Number(currentPage) - 1))
        .limit(Number(pageSize));
    }

    const data = await queryData.sort({ createdAt: -1 });
    const dataCount = await OfferCategoryCard.countDocuments();

    res.status(200).json({
      data: data,
      count: dataCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getSingleOfferCategoryCardById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    const data = await OfferCategoryCard.findOne(query);
    res.status(200).json({
      data: data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getSingleOfferCategoryCardBySlug = async (req, res, next) => {
  const slug = req.params.slug;
  const query = { slug: slug };

  try {
    const data = await OfferCategoryCard.findOne(query);

    res.status(200).json({
      data: data,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteOfferCategoryCardById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await OfferCategoryCard.deleteOne(query);
    res.status(200).json({
      message: "Promotional Offer delete Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteOfferCategoryCardMulti = async (req, res, next) => {
  const ids = req.body.data;

  try {
    await OfferCategoryCard.deleteMany({ _id: ids });
    res.status(200).json({
      message: "Promotional Offers delete Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editOfferCategoryCardData = async (req, res, next) => {
  try {
    const updatedData = req.body;
    const query = { _id: updatedData._id };
    const push = { $set: updatedData };

    const promoOffers = await OfferCategoryCard.find({
      promotionalOffer: updatedData._id,
    });

    let productIds = [];
    promoOffers.forEach((offer) => {
      offer.products.forEach((id) => {
        productIds.push(new ObjectId(id));
      });
    });

    // await PromotionalOfferProduct.updateMany(
    //   { promotionalOffer: updatedData._id },
    //   { $set: { promotionalOfferSlug: updatedData.slug } }
    // );

    await OfferCategoryCard.findOneAndUpdate(query, push);

    // await Product.updateMany(
    //   { _id: { $in: productIds } },
    //   {
    //     $set: {
    //       campaignStartDate: updatedData.campaignStartDate,
    //       campaignStartTime: updatedData.campaignStartTime,
    //       campaignEndDate: updatedData.campaignEndDate,
    //       campaignEndTime: updatedData.campaignEndTime,
    //     },
    //   }
    // );

    res.status(200).json({
      message: "Offers Category Card Edited Successfully!",
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};
