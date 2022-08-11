const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const FeaturedProduct = require('../models/featured-product');

/**
 * Add Gallery
 * Get Gallery List
 */

exports.addNewFeaturedProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }
    try {

        const data = req.body;
        const dataSchema = new FeaturedProduct(data);
        await dataSchema.save();

        res.status(200).json({
            message: 'Featured Product Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllFeaturedProduct = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = FeaturedProduct.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate({ path: 'products', select: 'name slug features regularPrice salePrice images productCode discount isEMI availableQuantity categorySlug categoryName subCatSlug subCatName brandSlug brandName productImages'}).sort({createdAt: -1});
        const dataCount = await FeaturedProduct.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Featured Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleFeaturedProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await FeaturedProduct.findOne(query)
            .populate('products', select ? select : '');

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


exports.deleteFeaturedProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await FeaturedProduct.deleteOne(query);

        res.status(200).json({
            message: 'Featured Product delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editFeaturedProduct = (req, res, next) => {
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

    FeaturedProduct.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Featured Product Updated Successfully!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}


