const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Menu = require('../models/menu');

/**
 * Add Author
 * Get Author List
 */

exports.addNewMenu = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const dataModel = new Menu(req.body);
        await dataModel.save();
        res.status(200).json({
            message: 'Menu Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getAllMenu = async (req, res, next) => {
    try {
        const data = await Menu.find();
        res.status(200).json({
            data: data,
            message: 'All Menu fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteMenuById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id}

    try {
        await Menu.deleteOne(query);
        res.status(200).json({
            message: 'Menu delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateMenuItem = async (req, res, next) => {
    const id = req.body.id;
    const data = req.body.data;

    try {
        await Menu.updateOne(
            {_id: id},
            { $push: { subCategories:  { $each: data} } }
        )
        res.status(200).json({
            message: 'Menu updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteMenuSubCat = async (req, res, next) => {
    try {
        const menuId = req.body.id;
        const subCatId = req.body.subCatId;

        await Menu.updateOne(
            {_id: menuId},
            {$pull: {subCategories: {subCatId: subCatId}}}
        );

        // db.test.update({},{$pull: {"attendance.$.students": {"studentId":{$in:[1,2,3]}}}},{multi:true})

        res.status(200).json({
            message: 'Menu deleted Successfully!'
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



exports.updateMenuData = async (req, res, next) => {

    try {
        const id = req.body.id;
        const data = req.body.data;
        const query = {_id: id};

        await Menu.findOneAndUpdate(
            query,
            {$set: data}
        )

        res.status(200).json({
            data: data,
            message: 'Data added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateMenuSubCategoryData = async (req, res, next) => {

    try {
        const menuId = req.body.id;
        const priority = req.body.priority;
        const subCatId = req.body.subCatId

        await Menu.updateOne(
            { '_id': menuId, 'subCategories.subCatId': subCatId },
            { $set: 
                {
                    'subCategories.$.priority': priority
                }
            }
        );

        res.status(200).json({
            message: 'Data updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


// exports.getASingleBrandBySlug = async (req, res, next) => {
//     const slug = req.params.slug;
//     const query = {slug: slug}
//
//     try {
//         const data = await Brand.findOne(query);
//         res.status(200).json({
//             data: data,
//             message: 'Brand fetch Successfully!'
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }
//

// exports.editBrandData = (req, res, next) => {
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
//     Brand.findOneAndUpdate(query, push)
//         .then(() => {
//             res.status(200).json({
//                 message: 'Brand Updated Success!'
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
