const { validationResult } = require("express-validator");

// Require Post Schema from Model..
const FeaturedCategory = require("../models/featured-category");

/**
 * Add Featured Category
 * Get Featured Category List
 */

exports.addNewFeaturedCategory = async (req, res, next) => {
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

  const data = req.body;
  const featuredCategory = new FeaturedCategory(data);

  try {
    await featuredCategory.save();
    res.status(200).json({
      message: "Featured Category Added Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAllFeaturedCategories = async (req, res, next) => {
  try {
    const data = await FeaturedCategory.find();
    res.status(200).json({
      data: data,
      message: "All Featured Category fetch Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.getAFeaturedCategoryById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    const data = await FeaturedCategory.findOne(query);
    res.status(200).json({
      data: data,
      message: "Featured Category fetch Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.deleteFeaturedCategoryById = async (req, res, next) => {
  const id = req.params.id;
  const query = { _id: id };

  try {
    const data = await FeaturedCategory.deleteOne(query);
    res.status(200).json({
      data: data,
      message: "Featured Category delete Successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Something went wrong on database operation!";
    }
    next(err);
  }
};

exports.editFeaturedCategoryData = (req, res, next) => {
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

  const updatedData = req.body;
  const query = { _id: updatedData._id };
  const push = { $set: updatedData };

  FeaturedCategory.findOneAndUpdate(query, push)
    .then(() => {
      res.status(200).json({
        message: "Brand Updated Success!",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
