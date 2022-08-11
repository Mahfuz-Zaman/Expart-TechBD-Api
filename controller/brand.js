const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Brand = require('../models/brand');

/**
 * Add Author
 * Get Author List
 */

exports.addNewBrand = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const author = new Brand(data);

    try {
        await author.save();
        res.status(200).json({
            message: 'Brand Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllBrands = async (req, res, next) => {
    try {
        const data = await Brand.find();
        res.status(200).json({
            data: data,
            message: 'All Brand fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleBrandById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await Brand.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Brand fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getASingleBrandBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    const query = {slug: slug}

    try {
        const data = await Brand.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Brand fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteBrandById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await Brand.deleteOne(query);
        res.status(200).json({
            data: data,
            message: 'Brand delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editBrandData = (req, res, next) => {
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

    Brand.findOneAndUpdate(query, push)
        .then(() => {
            res.status(200).json({
                message: 'Brand Updated Success!'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
