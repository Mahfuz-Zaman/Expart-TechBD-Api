const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Product = require('../models/product');
const ProductExtraData = require('../models/product-extra-data');
const Brand = require('../models/brand');
const Category = require('../models/category');
const SubCategory = require('../models/sub-category');
const ObjectId = require('mongoose').Types.ObjectId;
const { countDocuments } = require('../models/product');
const { forEach } = require('lodash');
const utils = require('../helpers/utils');


/**
 * Add Product
 * Add Bulk Book
 * Get All Book List
 * Single Book by Slug
 */

exports.addSingleProduct = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const data = req.body;

    try {
        const product = new Product(data);
        const productExtra = new ProductExtraData(data)
        const prodExtraRes = await productExtra.save();
        const prodRes = await product.save();

        await Product.findOneAndUpdate({_id: prodRes._id}, {
            "$set": {
                extraData: prodExtraRes._id
            }
        })

        await Brand.findOneAndUpdate({_id: product.brand}, {
            "$push": {
                products: prodRes._id
            }
        })
        res.status(200).json({
            message: 'Product Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// exports.addSingleProduct = async (req, res, next) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//         const error = new Error('Input Validation Error! Please complete required information.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         next(error)
//         return;
//     }
//
//     const data = req.body;
//
//     try {
//         const product = new Product(data);
//         const prodRes = await product.save();
//
//         await Category.findOneAndUpdate({_id: product.category}, {
//             "$push": {
//                 products: prodRes._id
//             }
//         })
//         await SubCategory.findOneAndUpdate({_id: product.subCategory}, {
//             "$push": {
//                 products: prodRes._id
//             }
//         })
//         await Brand.findOneAndUpdate({_id: product.brand}, {
//             "$push": {
//                 products: prodRes._id
//             }
//         })
//         res.status(200).json({
//             message: 'Product Added Successfully!'
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

exports.getAllProducts = async (req, res, next) => {
    try {
        const data = await Product.find()
            .populate('category', '_id categoryName slug')
            .populate('subCategory', '_id subCatName slug')
            .populate('brand', '_id brandName slug')
        res.status(200).json({
            data: data,
            message: 'All Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleProductBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await Product.findOne(query)
            .populate('category', '_id categoryName slug')
            .populate('subCategory', '_id subCatName slug')
            .populate('brand', '_id brandName slug')
            .populate('extraData', '-_id')


        // Check Discount with Campaign
        if (data.campaignStartDate && data.campaignEndDate) {
            const startDateTime = utils.convertToDateTime(data.campaignStartDate , data.campaignStartTime);
            const endDateTime = utils.convertToDateTime(data.campaignEndDate , data.campaignEndTime);

            const startTimeFromNow = utils.getDateTimeDifference(startDateTime);
            const endTimeFromNow = utils.getDateTimeDifference(endDateTime);

            // startTimeFromNow > 0 ---> Not Start Yet ** Discount will be 0 **
            // startTimeFromNow < 0 ---> Already Started ** Discount will live **
            // endTimeFromNow > 0 ---> Running ** Discount will live **
            // endTimeFromNow < 0 ---> Expired ** Discount will be 0 **


            if (startTimeFromNow > 0 || endTimeFromNow <= 0) {
                data.discountType = null;
                data.discount = 0;
            }
        }


        res.status(200).json({
            data: data,
            message: 'Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleProductById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = {_id: id};
        const data = await Product.findOne(query).populate('extraData')
        res.status(200).json({
            data: data,
            message: 'Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.updateProductImageField = async (req, res, next) => {

    try {
        const id = req.body.id;
        const data = req.body.images.length === 0 ? null : req.body.images

        await Product.findOneAndUpdate({_id: id}, {
            "$set": {
                images: data
            }
        })
        res.status(200).json({
            message: 'Product Image Updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.editProductBasicData = async (req, res, next) => {

    try {
        const data = req.body;

        await Product.findOneAndUpdate(
            {_id: data._id},
            {$set: data}
        );

        res.status(200).json({
            message: 'Product Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editProductData = async (req, res, next) => {

    const updatedProduct = req.body.product;
    const updatedProductExtra = req.body.extraData;

    try {
        const oldProduct = await Product.findOne({_id: updatedProduct._id});
        await Product.findOneAndUpdate(
            {_id: updatedProduct._id},
            {$set: updatedProduct}
            );
        await ProductExtraData.findOneAndUpdate(
            {_id: updatedProductExtra._id},
            {$set: updatedProductExtra}
            );

        // Update Brand Ref

        if (oldProduct.brand !== updatedProduct.brand) {
            await Brand.updateOne(
                {_id: oldProduct.brand},
                {
                    $pull: {products: oldProduct._id}
                }
            )
            await Brand.findOneAndUpdate({_id: updatedProduct.brand}, {
                "$push": {
                    products: updatedProduct._id
                }
            })
        }

        res.status(200).json({
            message: 'Product Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}



/**
 * SPLIT STRING WITH REGEX SEARCH
 */

//  exports.getSearchProductByRegex = async (req, res, next) => {
//     try {
//         const query = req.query.q;

//         const newQuery = query.split(/[ ,]+/);
//         const queryArray = newQuery.map((str, index) => ({name: RegExp(str, 'i')}));
//         console.log(queryArray);

//         const results = await Product.find({

//             $and: queryArray

//         }).limit(21);

//         const count = results.length;

//         console.log(count);

//         res.status(200).json({
//             data: results,
//             count: count
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }

/**
 * Regex SEARCH
 */

// exports.getSearchProductByRegex = async (req, res, next) => {
//     try {
//         const query = req.query.q;
//         // console.log(query);
//         // const parent = req.query.parent;

//         const regex = new RegExp(query, 'i')

//         const results = await Product.find({
//             $or: [
//                 {name: regex},
//                 {brandName: regex},
//                 {brandSlug: regex},
//                 {categoryName: regex},
//                 {categorySlug: regex},
//                 {productCode: regex},
//                 {subCatName: regex},
//                 {subCatSlug: regex},
//             ]
//         }).limit(21);

//         const count = results.length;

//         console.log(results);
//         console.log(count);

//         res.status(200).json({
//             data: results,
//             count: count
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }


/**
 * Text SEARCH
 */

exports.getSearchProductByText = async (req, res, next) => {
    try {

        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const query = req.query.q;
        let queryProduct;

        if (pageSize && currentPage) {
            console.log('Iam Here in Quety')
            console.log(pageSize)
            console.log(currentPage)
            queryProduct = Product.fuzzySearch({query: query, prefixOnly: false, minSize: 1}).skip(pageSize * (currentPage - 1)).limit(pageSize);
        } else {
            console.log('Iam Here')
            queryProduct = Product.fuzzySearch({query: query, prefixOnly: false, minSize: 1}).limit(24);
        }

        // const productsCount = await queryProduct.countDocuments();

        // queryProduct = Product.fuzzySearch({query: query, prefixOnly: false, minSize: 1}).limit(24);
        // .populate('category', '_id categoryName slug')
        // .populate('subCategory', '_id subCatName slug')
        // .populate('brand', '_id brandName slug')

        const result = await queryProduct;
        const productsCount = await Product.fuzzySearch({query: query, prefixOnly: false, minSize: 1}).countDocuments();

        res.status(200).json({
            data: result,
            count: productsCount
        });







        // const query = req.query.q;
        // const results = await Product.fuzzySearch({query: query, prefixOnly: false, minSize: 1})
        //     .limit(24)
            // .populate('category', '_id categoryName slug')
            // .populate('subCategory', '_id subCatName slug')
            // .populate('brand', '_id brandName slug')

        // res.status(200).json({
        //     data: results
        // });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}



exports.deleteProductById = async (req, res, next) => {

    const productId = req.params.id;

    try {
        const query = {_id: productId}
        const product = await Product.findOne(query).select('brand extraData -_id')
        await Product.deleteOne(query)

        // Remove Ref
        await ProductExtraData.deleteOne({_id: product.extraData})

        await Brand.updateOne(
            {_id: product.brand},
            {
                $pull: {products: productId}
            }
        )

        res.status(200).json({
            message: 'Product deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


/**
 * PRODUCT FILTER BY MENU NAVIGATE
 */

exports.productFilterByMenu = async (req, res, next) => {

    try {
        const query = req.body.query;
        const paginate = req.body.paginate;
        const queryProduct = Product.find(query)

        if (paginate) {
            queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const productsCount = await Product.countDocuments(query);
        const result = await queryProduct;

        res.status(200).json({
            data: result,
            count: productsCount
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.productFilterByQuery = async (req, res, next) => {

    try {
        const query = req.body.query;
        const paginate = req.body.paginate;
        const queryProduct = Product.find(query).select('-extraData')

        if (paginate) {
            queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const productsCount = await Product.countDocuments(query);
        const result = await queryProduct;

        res.status(200).json({
            data: result,
            count: productsCount
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * PAGINATION
 */

exports.getProductsByLimit = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const queryProduct = Product.find();

        if (pageSize && currentPage) {
            queryProduct.skip(pageSize * (currentPage - 1)).limit(pageSize)
        }

        const productsCount = await Product.countDocuments();

        const data = await queryProduct
            // .populate('category', '_id categoryName slug')
            // .populate('subCategory', '_id subCatName slug')
            // .populate('brand', '_id brandName slug')

        res.status(200).json({
            data: data,
            count: productsCount
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getSpecificBooksById = async (req, res, next) => {

    try {

        const dataIds = req.body.bookId;
        const query = {_id: {$in: dataIds}}
        const data = await Product.find(query).populate('extraData');
            // .select('_id name slug image price discountPercent availableQuantity author authorName');

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

// exports.filterByCatSubCatBrandFilters = async (req, res, next) => {
//     try {

//         const data = req.body;

//         const catSlug = data.fixedData.categorySlug;
//         const subCatSlug = data.fixedData.subCatSlug;
//         const filterData = data.filterData;

//         console.log(catSlug);
//         console.log(subCatSlug);
//         console.log(filterData);

//         const results = await Product.find(
//             {
//                 $and: [
//                     {
//                         $or: filterData
//                     },
//                     {categorySlug: catSlug},
//                     {subCatSlug: subCatSlug}
//                 ]
//             }
//         ).limit(30);

//         res.status(200).json({
//             data: results,
//             count: 30
//         });
//     } catch (err) {
//         console.log(err);
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
// }




exports.getMaxMinPrice = async (req, res, next) => {
    try {

        const query = req.body;

        const data = await Product.aggregate([
            { $match:
                 query
            },
            { $group: {
                "_id": null,
                "max": { "$max": "$salePrice" },
                "min": { "$min": "$salePrice" }
            }}
         ]);
        res.status(200).json({
            data: data,
            message: 'Max - Min price retrieved successfully!'
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

exports.productFilterByMinMax = async (req, res, next) => {

    try {
        const query = req.body.query;
        const paginate = req.body.paginate;
        const min = req.body.range.min;
        const max =  req.body.range.max;
        const sort = req.body.sort;
        // console.log(req.body.sort);

        const queryProduct = Product.aggregate([
            { $match:
                query
            },
            { $match:
                {
                    salePrice: { "$gt": min - 1, "$lt": max + 1 }
                }
            },
            { $sort :
                {
                    salePrice : sort
                }
            }
        ]);

        if (paginate) {
            queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const result = await queryProduct;

        const count = await Product.aggregate(
            [
                { $match:
                    query
                },
                { $match:
                    {
                        salePrice: { "$gt" : min - 1, "$lt": max + 1}
                    }
                },
                { $count:
                    "productsCount"
                }
            ]
        );

        // console.log(count[0].productsCount);

        res.status(200).json({
            data: result,
            count: count[0].productsCount
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterByCatSubCatBrandFilters = async (req, res, next) => {
    try {

        const util = require('util');

        const data = req.body;
        // console.log("Data Starts Here");
        // console.log(util.inspect(data, {showHidden: false, depth: null}));
        // console.log("Data Ends Here");

        const catSlug = data.filter.fixedData.categorySlug;
        const subCatSlug = data.filter.fixedData.subCatSlug;
        const filterData = data.filter.filterData;

        // console.log(filterData);

        mappedFilterData = filterData.map(a => (key => ({ key:key, value: a[key] }))(Object.keys(a)[0]));

        var sortedObj = {};
        var sortedArrObj = {};
        let string = "";
        for( var i = 0, max = mappedFilterData.length; i < max ; i++ ){
            const temp = mappedFilterData[i].key;
            string = temp.substring(0, 0) + temp.substring(8, temp.length);
            if( sortedObj[mappedFilterData[i].key] == undefined ){
                sortedArrObj[string] = [];
                sortedObj[mappedFilterData[i].key] = [];
            }
            const obj = {[mappedFilterData[i].key]: mappedFilterData[i].value}
            sortedArrObj[string].push(obj);
            sortedObj[mappedFilterData[i].key].push(obj);
        }

        const sortedArrObjNoKey = Object.values(sortedArrObj);

        let queryArray = [];
        // here each element is an array
        sortedArrObjNoKey.forEach(element => queryArray.push({"$or": element}));
        // console.log(util.inspect(queryArray, {showHidden: false, depth: null}));

        let queryProduct = null;
        let count = null;

        const paginate = data.paginate;

        count = await Product.countDocuments(
            {
                $and: [
                    {
                        $and: queryArray
                    },
                    {categorySlug: catSlug},
                    {subCatSlug: subCatSlug}
                ]
            }
        );
        console.log(count);

        queryProduct = await Product.find(
            {
                $and: [
                    {
                        $and: queryArray
                    },
                    {categorySlug: catSlug},
                    {subCatSlug: subCatSlug}
                ]
            }
        ).skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize);

        res.status(200).json({
            data: queryProduct,
            count: count
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

exports.ultimateQuery = async (req, res, next) => {

    try {

        const util = require('util');
        console.log("");
        console.log("");
        console.log("<----- Body Data ----->");
        console.log("");
        console.log(util.inspect(req.body, {showHidden: false, depth: null}))

        // CATEGORY SUB-CATEGORY SLUG
        const query = req.body.query;

        // PAGINATION
        const paginate = req.body.paginate;

        // PRICE SORT
        let sort = 1;
        if(req.body.sort){
            sort = req.body.sort;
        }

        // PRICE RANGE
        let min = 0;
        let max = 10000000;
        if(req.body.range){
            min = req.body.range.min;
            max =  req.body.range.max;
        }

        // FILTER
        let filterData = null;
        let queryArray = [];
        if(req.body.filterData) {
            mappedFilterData = req.body.filterData.map(a => (key => ({ key:key, value: a[key] }))(Object.keys(a)[0]));
            console.log(mappedFilterData);
            var sortedObj = {};
            var sortedArrObj = {};
            let keys = "";
            for( var i = 0, maximum = mappedFilterData.length; i < maximum ; i++ ){
                const temp = mappedFilterData[i].key;
                keys = temp.substring(0, 0) + temp.substring(8, temp.length);
                if( sortedObj[mappedFilterData[i].key] == undefined ){
                    sortedArrObj[keys] = [];
                    sortedObj[mappedFilterData[i].key] = [];
                }
                const obj = {[mappedFilterData[i].key]: mappedFilterData[i].value}
                sortedArrObj[keys].push(obj);
                sortedObj[mappedFilterData[i].key].push(obj);
            }
            const sortedArrObjNoKey = Object.values(sortedArrObj);
            console.log(sortedObj, sortedArrObj, sortedArrObjNoKey);
            // here each element is an array
            sortedArrObjNoKey.forEach(element => queryArray.push({"$or": element}));
            filterData = queryArray;
            console.log("");
            console.log("<----- Processed Filter Data ----->");
            console.log("");
            console.log(util.inspect(filterData, {showHidden: false, depth: null}))
        }

        let queryProduct = null;
        let searchQuery;

        if (filterData) {
            searchQuery = Product.aggregate(
                [
                    { $match:
                        query
                    },
                    { $match:
                            {
                                salePrice: { "$gt" : min - 1, "$lt": max + 1}
                            }
                    },
                    { $match:
                            {
                                $and: queryArray
                            }
                    },
                    {
                        $count: "searchCount"
                    }
                ]
            )


            queryProduct = Product.aggregate([
                { $match:
                    query
                },
                { $match:
                    {
                        salePrice: { "$gt" : min - 1, "$lt": max + 1}
                    }
                },
                { $match:
                    {
                        $and: queryArray
                    }
                },
                { $sort :
                    {
                        salePrice : sort
                    }
                },
                { $project :
                    {
                        name_fuzzy: 0
                    }
                }
            ]);
        } else {

            searchQuery = Product.aggregate(
                [
                    { $match:
                        query
                    },
                    { $match:
                            {
                                salePrice: { "$gt" : min - 1, "$lt": max + 1}
                            }
                    },
                    {
                        $count: "searchCount"
                    }
                ]
            )

            queryProduct = Product.aggregate([
                { $match:
                    query
                },
                { $match:
                    {
                        salePrice: { "$gt" : min - 1, "$lt": max + 1}
                    }
                },
                { $sort :
                    {
                        salePrice : sort
                    }
                }
            ]);
        }

        if (paginate) {
            queryProduct.skip(paginate.pageSize * (paginate.currentPage - 1)).limit(paginate.pageSize)
        }

        const result = await queryProduct;
        const count = await searchQuery;
        // console.log(count)
        //
        // console.log("");
        // console.log("<----- Count ----->");
        // console.log("");
        // console.log(util.inspect(count, {showHidden: false, depth: null}))

        res.status(200).json({
            data: result,
            count: count && count.length > 0 ? Number(count[0].searchCount) : 0
        });

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

/**
 * SPLIT STRING WITH REGEX AND PRODUCT CODE SEARCH
 */

 exports.getSearchProductByRegex = async (req, res, next) => {
    try {

        // console.log(req.body);

        const query = req.query.q;
        const sort = parseInt(req.query.s);
        // console.log(sort);
        const paginate = req.body.paginate;
        const filterQuery = req.body.query;

        // SPLIT STRING AND REGEX
        const newQuery = query.split(/[ ,]+/);
        const queryArray = newQuery.map((str) => ({name: RegExp(str, 'i')}));
        // console.log(queryArray);

        // REGEX ONLY
        const regex = new RegExp(query, 'i')
        // console.log(regex);

        if (sort !== 0 && !filterQuery) {

            // console.log("Sort");

            products = Product.find({

                $and: [
                    {
                        $or: [
                            {
                                $and: queryArray
                            },
                            {productCode: regex}
                        ]
                    },

                ]

            }).sort({ "salePrice": sort});

        } else if (sort !== 0 && filterQuery) {

            products = Product.find({

                $and: [
                    {
                        $or: [
                            {
                                $and: queryArray
                            },
                            {productCode: regex}
                        ]
                    },
                    filterQuery
                ]

            }).sort({ "salePrice": sort});

        } else if (filterQuery) {

            products = Product.find({

                $and: [
                    {
                        $or: [
                            {
                                $and: queryArray
                            },
                            {productCode: regex}
                        ]
                    },
                    filterQuery
                ]

            });

        } else {

            products = Product.find({

                $or: [
                    {
                        $and: queryArray
                    },
                    {productCode: regex}
                ]

            });

        }

        if (paginate) {
            products.skip(parseInt(paginate.pageSize) * (parseInt(paginate.currentPage) - 1)).limit(parseInt(paginate.pageSize))
        }

        const results = await products;

        const count = results.length;

        // console.log(results);
        // console.log(count);

        res.status(200).json({
            data: results,
            count: count
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

exports.getRelatedProducts = async (req, res, next) => {

    console.log(req.params);

    const id = req.params.id;
    const category = req.params.category;
    const subCategory = req.params.subCategory;

    try {

        const data = await Product.aggregate([
            {
                $match:
                    {
                        $or: [
                            {category: new ObjectId(category)},
                            {subCategory: new ObjectId(subCategory)},
                        ],
                        $nor: [
                            {
                                $and: [
                                    {
                                        '_id': new ObjectId(id)
                                    }
                                ]
                            }
                        ]
                    }
            },
            {
                $sample:
                    {
                        size: 6
                    }
            }
        ])

        // const data = await Product.find({category: category, subCategory: subCategory, $nor:[{$and:[{'_id': id}]}]});

        res.status(200).json({
            data: data,
            message: 'Product fetch Successfully!'
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

exports.getSpecificProductsByIds = async (req, res, next) => {

    try {

        const dataIds = req.body.ids;
        const select = req.body.select;
        console.log(select)
        const query = {_id: {$in: dataIds}}
        const data = await Product.find(query)
            .select(select ? select : '')
            // .populate('attributes')
            .populate('brand')
            .populate('category')
            .populate('subCategory')

        // console.log(data);

        res.status(200).json({
            data: data
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


exports.getFromCollectionBySearch = async (req, res, next) => {
    try {
        console.log(req.query);

        let collectionName;

        switch (req.query.collectionName) {
            case "product":
            case "product":
                collectionName = Product;
                break;
            case "brand":
            case "brand":
                collectionName = Brand;
                break;
            case "category":
            case "Category":
                collectionName = Category;
                break;
            case "subCategory":
            case "SubCategory":
                collectionName = SubCategory;
                break;
            default:
                collectionName = Product;
                break;
        }

        console.log(collectionName);
        console.log(req.query.collectionName);

        const query = req.query.q;
        console.log(query);
        const searchField1 = req.query.searchField1, searchField2 = req.query.searchField2;
        const filterKey = req.query.filterKey, filterValue = req.query.filterValue;
        const paginate = req.body.paginate;

        const newQuery = query.split(/[ ,]+/);
        let queryArray1;
        if (searchField1 && searchField2) {
            queryArray1 = [
                {"$and": newQuery.map((string) => ({[searchField1]: RegExp(string, 'i')}))},
                {"$and": newQuery.map((string) => ({[searchField2]: RegExp(string, 'i')}))}
            ]
        }
        ;

        let results, count;

        if (queryArray1) {
            results = collectionName.find({$or: queryArray1});
            count = await collectionName.find({$or: queryArray1}).countDocuments();

        } else if (filterKey && filterValue && queryArray1) {
            results = collectionName.find({$or: queryArray1, [filterKey]: filterValue});
            count = await collectionName.find({$or: queryArray1, [filterKey]: filterValue}).countDocuments();

        } else {
            const keys = ["name", "slug", "categoryName", "categorySlug", "subCatName", "subCatSlug", "brandName", "brandSlug"];
            const queryArray2 = [];
            keys.forEach(key => queryArray2.push({"$and": newQuery.map((str) => ({[key]: RegExp(str, 'i')}))}));
            results = collectionName.find({$or: queryArray2});
            count = await collectionName.find({$or: queryArray2}).countDocuments();
        }

        if (paginate) {
            results.skip(Number(paginate.pageSize) * (Number(paginate.currentPage) - 1)).limit(Number(paginate.pageSize));
        }

        const data = await results;
        // console.log(data);

        res.status(200).json({
            data: data,
            count: count
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


exports.getProductsByQuery = async (req, res, next) => {

    try {
        let pagination = req.body.pagination;
        const query = req.body.query;
        const sort = req.body.sort;
        const select = req.body.select;

        let queryData;
        let countDoc;

        if (query) {
            queryData = Product.find(query);
            countDoc = Product.countDocuments(query);
        } else {
            queryData = Product.find();
            countDoc = Product.countDocuments();
        }

        if (sort) {
            queryData = queryData.sort(sort)
        }
        if (select) {
            queryData = queryData.select(select)
        }

        if (pagination && pagination.pageSize && pagination.currentPage) {
            queryData.skip(Number(pagination.pageSize) * (Number(pagination.currentPage) - 1)).limit(Number(pagination.pageSize))
        }

        const count = await countDoc;
        const data = await queryData.sort({createdAt: -1})

        res.status(200).json({
            data: data,
            count: count
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}
