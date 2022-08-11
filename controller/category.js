const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Category = require('../models/category');
const Product = require('../models/product');

/**
 * Add Category
 * Get Category List
 * Get Single Category
 * Delete Category
 * Edit Category
 */

exports.addNewCategory = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const category = new Category(data);

    try {
        await category.save();
        res.status(200).json({
            message: 'Category Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllCategory = async (req, res, next) => {
    try {
        const data = await Category.find().select('-products');
        res.status(200).json({
            data: data,
            message: 'All Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getCategoryBasicList = async (req, res, next) => {
    try {
        const data = await Category.find().select('categoryName slug');
        res.status(200).json({
            data: data
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleCategoryById = async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Category.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getASingleCategoryBySlug = async (req, res, next) => {
    const catSlug = req.params.slug;
    const query = {slug: catSlug}

    try {
        const data = await Category.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteCategoryById = async (req, res, next) => {
    const catId = req.params.id;
    const query = {_id: catId}

    try {
        const data = await Category.deleteOne(query);
        res.status(200).json({
            data: data,
            message: 'Category delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editCategoryData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;
    const query = {_id: updatedData._id}
    const push = {$set: updatedData}

    Category.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Category Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

exports.getCategoryFilter = async (req, res, next) => {

    try {
        const slug = req.params.slug;

        const result = await Category.findOne({slug: slug}).select('filters priceRange -_id');
        res.status(200).json({
            data: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByCatFilters = async (req, res, next) => {

    const data = req.body;

    try {
        // const query = {"filters.processor": "M1 Chip", "filters.ram": "16 GB", "filters.ssd": "Up to 1TB SSD", "filters.graphics": "8GB"}
        const query1 = {"filters.processor": "M1 Chip", "filters.ram": "16 GB"};
        const query2 = {"filters.processor": "Ryzen 7", "filters.ram": "16 GB"};
        const mQuery = [query1, query2];
        const fQuery = [{"filters.processor": "Ryzen 7"}, {"filters.processor": "M1 Chip"}, {"filters.ram": "16 GB"}];

        // const query = {"filters.size": "XL", "filters.colors": "Green"};
        const results = await Product.find({$or: data})



        res.status(200).json({
            data: results,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByCatSubCatBrandFilters = async (req, res, next) => {
    try {

        const data = req.body;

        const catSlug = data.fixedData.categorySlug;
        const subCatSlug = data.fixedData.subCatSlug;
        const filterData = data.filterData;

        console.log(catSlug);
        console.log(subCatSlug);
        console.log(filterData);

        const results = await Product.find(
            {
                $and: [
                    {
                        $or: filterData
                    },
                    {categorySlug: catSlug},
                    {subCatSlug: subCatSlug}
                ]
            }
        ).limit(20);

        res.status(200).json({
            data: results
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}




