const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const SubCategory = require('../models/sub-category');
const Category = require('../models/category');
const Product = require('../models/product');
const Menu = require('../models/menu');

/**
 * Add Publisher
 * Get Publisher List
 */

exports.addNewSubCat = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;
    const publisher = new SubCategory(data);

    try {
        await publisher.save();
        res.status(200).json({
            message: 'Sub Category Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllSubCategory = async (req, res, next) => {
    try {
        const data = await SubCategory.find()
            .select('-products')
            .populate('parentCategory', 'categoryName');

        res.status(200).json({
            data: data,
            message: 'All Sub Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSubCatsByParentCatId = async (req, res, next) => {
    const catId = req.params.id;
    try {
        const data = await SubCategory.find({parentCategory: catId})
            .select('-products -parentCategory')
        // .populate('parentCategory', 'categoryName');

        res.status(200).json({
            data: data,
            message: 'All Sub Category fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getASingleSubCategoryById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        const data = await SubCategory.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Data fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getASingleSubCategoryBySlug = async (req, res, next) => {
    const publisherSlug = req.params.slug;
    const query = {slug: publisherSlug}

    try {
        const data = await SubCategory.findOne(query);
        res.status(200).json({
            data: data,
            message: 'Publisher fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteSubCategoryById = async (req, res, next) => {
    const publisherId = req.params.id;
    const query = {_id: publisherId}

    try {
        const data = await SubCategory.deleteOne(query);
        res.status(200).json({
            data: data,
            message: 'Author delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.editSubCategoryData = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Input Validation Error! Please complete required information.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         next(error)
//         return;
//     }
//
//     const updatedData = req.body;
//     const query = {_id: updatedData._id}
//     const push = {$set: updatedData}
//
//     SubCategory.findOneAndUpdate(query, push)
//         .then(() => {
//             res.status(200).json({
//                 message: 'Publisher Updated Success!'
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
//
// }


// exports.editSubCategoryData = async(req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Input Validation Error! Please complete required information.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         next(error)
//         return;
//     }
//
//
//
//     try {
//         let subCategory= await SubCategory.findById(req.params.subId);
//         let previousSlug= subCategory.slug;
//
//         let product= await Product.find({subCatSlug:previousSlug});
//
//         product.forEach(el=>{
//             el.subCatSlug=req.body.slug;
//             el.subCatName=req.body.name;
//             el.save();
//
//         })
//
//         subCategory= await SubCategory.findByIdAndUpdate(req.params.subId,req.body,{
//             new: true,
//             runValidators: true
//         })
//
//         res.json({
//             data:subCategory,
//             message:"Sub category is updated"
//         })
//
//
//
//     } catch (error) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
//
// }

exports.editSubCategoryData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {

        const newData = req.body;

        const oldSubCategory = await SubCategory.findOne({_id: newData._id});

        await SubCategory.findByIdAndUpdate(req.body._id, req.body, {
            new: true,
            runValidators: true
        })

        if (oldSubCategory.slug !== newData.slug || oldSubCategory.subCatName.trim() !== newData.subCatName.trim()) {
            console.log('On Product Update')
            await Product.updateMany({subCatSlug: oldSubCategory.slug}, {
                $set: {
                    subCatSlug: req.body.slug,
                    subCatName: req.body.subCatName
                }
            });

            await Menu.updateOne(
                {
                    categoryId: req.body.parentCategory,
                    "subCategories.subCatId": req.body._id
                },
                {
                    $set: {
                        "subCategories.$.subCatName": req.body.subCatName,
                        "subCategories.$.slug": req.body.slug
                    }
                }
            )
        }

        res.json({
            message: "Sub category is updated"
        })


    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


exports.getSubCategoryFilter = async (req, res, next) => {

    try {
        const slug = req.params.slug;

        const result = await SubCategory.findOne({slug: slug}).select('filters priceRange -_id');
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

exports.getSubCatsByParentSlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const category = await Category.findOne({slug: slug}).distinct('_id');
        const data = await SubCategory.find({parentCategory: category[0]})
            .select('subCatName slug')

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

