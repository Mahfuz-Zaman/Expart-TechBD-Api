const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const Carousel = require("../models/carousel");
const OfferBanner = require("../models/offer-banner");
const ContactInfo = require("../models/contact-info");
const OfferProduct = require("../models/offer-product");
const OfferPackage = require("../models/offer-package");
const OfferBannerCard = require("../models/offer-banner-card");
const PageInfo = require("../models/page-info");
const Branch = require("../models/branch");

/**
 * Add Author
 * Get Author List
 */

exports.addNewCarousel = async (req, res, next) => {
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

    const dataExists = await Carousel.findOne({
      url: data.url,
    }).lean();

    if (dataExists) {
      const error = new Error(
        "A Offer Category Card with this name already exists!"
      );
      error.statusCode = 406;
      next(error);
    } else {
      const dataModel = new Carousel(req.body);
      await dataModel.save();
      res.status(200).json({
        message: "Carousel Added Successfully!",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};
exports.editCarousel = async (req, res, next) => {
  try {
    const updatedData = req.body;
    const query = { _id: updatedData._id };
    const push = { $set: updatedData };

    // let productIds = [];
    // promoOffers.forEach((offer) => {
    //   offer.products.forEach((id) => {
    //     productIds.push(new ObjectId(id));
    //   });
    // });

    // await PromotionalOfferProduct.updateMany(
    //   { promotionalOffer: updatedData._id },
    //   { $set: { promotionalOfferSlug: updatedData.slug } }
    // );

    await Carousel.findOneAndUpdate(query, push);

    res.status(200).json({
      message: "Carousel Edited Successfully!",
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

exports.getAllCarousel = async (req, res, next) => {
  try {
    const select = req.query.select;

    const data = await Carousel.find()
      .select(select ? select : "")
      .sort({ priority: -1 });

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
exports.getSingleCarouselById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    const data = await Carousel.findOne(query);
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

exports.deleteCarouselById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await Carousel.deleteOne(query);
    res.status(200).json({
      message: "Carousel delete Successfully!",
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

/**
 * Add Offer Banner
 * Get Offer Banner List
 */

exports.addNewOfferBanner = async (req, res, next) => {
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
    const dataModel = new OfferBanner(req.body);
    await dataModel.save();

    res.status(200).json({
      message: "Offer Banner Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.pushOfferData = async (req, res, next) => {
  try {
    const bannerId = req.body.id;
    const data = req.body.data;

    await OfferBanner.updateOne(
      { _id: bannerId },
      { $push: { bannerData: data } },
      { new: true }
    );

    res.status(200).json({
      message: "Successfully add data.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.pullOfferData = async (req, res, next) => {
  try {
    const bannerId = req.body.bannerId;
    const offerId = req.body.offerId;

    await OfferBanner.updateOne(
      { _id: bannerId },
      { $pull: { bannerData: { _id: offerId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Successfully deleted data.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllOfferBanner = async (req, res, next) => {
  try {
    let select = req.query.select;

    const data = await OfferBanner.find().select(select ? select : "");

    res.status(200).json({
      data: data,
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

exports.deleteOfferBannerById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await OfferBanner.deleteOne(query);
    res.status(200).json({
      message: "Offer Banner delete Successfully!",
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

/**
 * Contact Info
 */

exports.setContactInfo = async (req, res, next) => {
  try {
    const id = req.body._id;

    if (id === null) {
      const dataModel = new ContactInfo(req.body);
      await dataModel.save();
    } else {
      await ContactInfo.findOneAndUpdate({ _id: id }, req.body);
    }

    res.status(200).json({
      message: "Contact Info Set Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getContactInfo = async (req, res, next) => {
  try {
    const select = req.query.select;
    const data = await ContactInfo.find().select(select ? select : "");

    res.status(200).json({
      data: data[0],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

/**
 * Branch Info
 */

exports.setBranchInfo = async (req, res, next) => {
  try {
    // console.log(req.body);

    const id = req.body._id;
    console.log(id);

    if (id) {
      await Branch.findOneAndUpdate({ _id: id }, req.body);
    } else {
      const dataModel = new Branch(req.body);
      console.log(dataModel);
      await dataModel.save();
    }

    res.status(200).json({
      message: "Branch Info Set Successfully!",
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

exports.getBranchInfo = async (req, res, next) => {
  try {
    const data = await Branch.find().sort("-priority");
    res.status(200).json({
      data: data,
      message: "All data fetch Successfully!",
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

exports.deleteBranchInfoById = async (req, res, next) => {
  try {
    const id = req.params.id;

    await Branch.deleteOne({ _id: id });

    res.status(200).json({
      message: "Branch Removed Successfully!",
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

/**
 * OFFER PRODUCT
 */

exports.addOfferProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const product = new OfferProduct(data);
    await product.save();
    res.status(200).json({
      message: "Product Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllOfferProduct = async (req, res, next) => {
  try {
    const data = await OfferProduct.find({}).populate("product").limit(20);
    res.status(200).json({
      data: data,
      message: "Product Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getQueryOfferProduct = async (req, res, next) => {
  try {
    const query = { tagSlug: req.params.slug };
    const data = await OfferProduct.find(query).populate("product").limit(10);

    res.status(200).json({
      data: data,
      message: "Product Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteOfferProductById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await OfferProduct.deleteOne(query);
    res.status(200).json({
      message: "Offer Product delete Successfully!",
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

/**
 * OFFER PACKAGE
 */

exports.addOfferPackage = async (req, res, next) => {
  try {
    const data = req.body;
    const product = new OfferPackage(data);
    await product.save();
    res.status(200).json({
      message: "Data Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllOfferPackage = async (req, res, next) => {
  try {
    const data = await OfferPackage.find({}).limit(50);
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

exports.getQueryOfferPackage = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    const data = await OfferPackage.findOne(query);

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

exports.deleteOfferPackageById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await OfferPackage.deleteOne(query);
    res.status(200).json({
      message: "Offer Package delete Successfully!",
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

/**
 * OFFER Banner CARD
 */

exports.addOfferBannerCard = async (req, res, next) => {
  try {
    const data = req.body;
    const product = new OfferBannerCard(data);
    await product.save();
    res.status(200).json({
      message: "Data Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllOfferBannerCard = async (req, res, next) => {
  try {
    let pageSize = +req.query.pageSize;
    let currentPage = +req.query.page;
    let select = req.query.select;
    let bannerData = OfferBannerCard.find();

    if (pageSize && currentPage) {
      bannerData.skip(pageSize * (currentPage - 1)).limit(Number(pageSize));
    }

    const data = await bannerData.select(select ? select : "");
    const count = await OfferBannerCard.countDocuments();

    res.status(200).json({
      data: data,
      count: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteOfferBannerCardById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    await OfferBannerCard.deleteOne(query);
    res.status(200).json({
      message: "Offer Package delete Successfully!",
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

/**
 * Add Author
 * Get Author List
 */

exports.addNewPageInfo = async (req, res, next) => {
  try {
    const id = req.body._id;

    if (!id) {
      const data = new PageInfo(req.body);
      await data.save();
    } else {
      await PageInfo.findOneAndUpdate({ _id: id }, req.body);
    }

    res.status(200).json({
      message: "Data Set Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getPageInfoBySlug = async (req, res, next) => {
  try {
    const data = await PageInfo.findOne({ slug: req.params.slug });
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
