const {validationResult} = require('express-validator');
const PromotionalOffer = require('../models/promotional-offer');
const Product = require('../models/product');

// Require Post Schema from Model..
const OfferProduct = require('../models/promotional-offer-product');
const ObjectId = require('mongoose').Types.ObjectId;

const utils = require('../helpers/utils');

/**
 *  Offer Product
 */

exports.addNewOfferProduct = async (req, res, next) => {
    try {

        const data = req.body;
        const promotionalOffer = await PromotionalOffer.findOne({_id: data.promotionalOffer});
        const productIds = data.products.map(m => new ObjectId(m));


        const dataSchema = new OfferProduct(data);
        await dataSchema.save();

        await Product.updateMany({_id: {$in: productIds}}, {$set: {
                campaignStartDate: promotionalOffer.campaignStartDate,
                campaignStartTime: promotionalOffer.campaignStartTime,
                campaignEndDate: promotionalOffer.campaignEndDate,
                campaignEndTime: promotionalOffer.campaignEndTime,
            }})

        res.status(200).json({
            message: 'Offer Product Added Successfully!'
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


exports.getAllOfferProduct = async (req, res, next) => {
    try {

        let pageSize = req.query.pageSize;
        let currentPage = req.query.page;

        let queryData;
        queryData = OfferProduct.find();

        if (pageSize && currentPage) {
            queryData.skip(Number(pageSize) * (Number(currentPage) - 1)).limit(Number(pageSize))
        }

        const data = await queryData.populate('products').sort({createdAt: -1});
        const dataCount = await OfferProduct.countDocuments();

        res.status(200).json({
            data: data,
            count: dataCount,
            message: 'Offer Product fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleOfferProductById = async (req, res, next) => {
    const id = req.params.id;
    const query = {_id: id};
    const select = req.query.select;


    try {
        const data = await OfferProduct.findOne(query)
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

exports.getOfferProductBySlugMultiple = async (req, res, next) => {
    try {
        const productSlug = req.params.slug;
        const select = req.query.select;
        const query = {promotionalOfferSlug: productSlug};
        const promotionalOffer = await PromotionalOffer.findOne({slug: productSlug});
        const offerProducts = await OfferProduct.find(query)
            .populate('products', select ? select : '');

        // Store Data
        let endDateTimeData = null;
        let startDateTimeData = null;
        let campaignStatus = null; // 0 -> Not Start, 1 -> Expired, 2 -> Running

        // Check Discount with Campaign
        if (promotionalOffer && promotionalOffer.campaignStartDate && promotionalOffer.campaignEndDate) {
            const startDateTime = utils.convertToDateTime(promotionalOffer.campaignStartDate , promotionalOffer.campaignStartTime);
            const endDateTime = utils.convertToDateTime(promotionalOffer.campaignEndDate , promotionalOffer.campaignEndTime);

            const startTimeFromNow = utils.getDateTimeDifference(startDateTime);
            const endTimeFromNow = utils.getDateTimeDifference(endDateTime);

            endDateTimeData = endDateTime;
            startDateTimeData = startDateTime;


            // startTimeFromNow > 0 ---> Not Start Yet ** Discount will be 0 **
            // startTimeFromNow < 0 ---> Already Started ** Discount will live **
            // endTimeFromNow > 0 ---> Running ** Discount will live **
            // endTimeFromNow < 0 ---> Expired ** Discount will be 0 **

            if (startTimeFromNow > 0) {
                campaignStatus = 0;
            }

            if (endTimeFromNow < 0) {
                campaignStatus = 1;
            }


            console.log('######')
            console.log(startDateTime);
            console.log(endDateTime);

            if (startTimeFromNow > 0 || endTimeFromNow <= 0) {
                console.log('Discount will be ZERO');
                offerProducts.forEach(m1 => {
                    m1.products.forEach(m2 => {
                        m2.discount = 0;
                        m2.discountType = null;
                    })
                })
            } else {
                campaignStatus = 2;
                console.log('RUNNING...')
            }

        }

        res.status(200).json({
            data: offerProducts,
            info: promotionalOffer,
            campaignStatus
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.getOfferProductBySlug = async (req, res, next) => {
    const productSlug = req.params.slug;
    const select = req.query.select;
    try {
        const query = {promotionalOfferSlug: productSlug};
        const data = await OfferProduct.findOne(query)
        .populate('products', select ? select : '')
        .populate(
            {
                path: 'promotionalOffer',
                model: 'PromotionalOffer'
            }
        )

        const promotionalOffer = data.promotionalOffer;
        let isCampaignRunning;
        let isCampaignStart;
        let isCampaignEnd;
        let endDateTimeData = null;
        let startDateTimeData = null;

        // Check Discount with Campaign
        if (promotionalOffer && promotionalOffer.campaignStartDate && promotionalOffer.campaignEndDate) {
            const startDateTime = utils.convertToDateTime(promotionalOffer.campaignStartDate , promotionalOffer.campaignStartTime);
            const endDateTime = utils.convertToDateTime(promotionalOffer.campaignEndDate , promotionalOffer.campaignEndTime);

            const startTimeFromNow = utils.getDateTimeDifference(startDateTime);
            const endTimeFromNow = utils.getDateTimeDifference(endDateTime);

            endDateTimeData = endDateTime;
            startDateTimeData = startDateTime;

            console.log(endDateTime);

            // startTimeFromNow > 0 ---> Not Start Yet ** Discount will be 0 **
            // startTimeFromNow < 0 ---> Already Started ** Discount will live **
            // endTimeFromNow > 0 ---> Running ** Discount will live **
            // endTimeFromNow < 0 ---> Expired ** Discount will be 0 **

            isCampaignStart = startTimeFromNow <= 0;
            isCampaignEnd = endTimeFromNow <= 0;

            if (startTimeFromNow > 0 || endTimeFromNow <= 0) {
                console.log('Discount will be ZERO');
                data.products.forEach(m => {
                    m.discount = 0;
                    m.discountType = null;
                });

                isCampaignRunning = false;
                // data.discountType = null;
                // data.discountAmount = 0;
            } else {
                isCampaignRunning = true;
                console.log('RUNNING...')
            }

        }

        res.status(200).json({
            data: data,
            isCampaignRunning,
            isCampaignStart,
            isCampaignEnd,
            endDateTimeData,
            startDateTimeData,
            message: 'Promotional Offer products fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteOfferProductById = async (req, res, next) => {

    try {
        const id = req.params.id;
        const query = {_id: id}
        const offerProduct = await OfferProduct.findOne({_id: id});

        const productIds = offerProduct.products.map(m => new ObjectId(m));

        await Product.updateMany({_id: {$in: productIds}}, {$set: {
                campaignStartDate: null,
                campaignStartTime: null,
                campaignEndDate: null,
                campaignEndTime: null,
                discount: 0
            }})

        await OfferProduct.deleteOne(query);

        res.status(200).json({
            message: 'Offer Product delete Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

// const promotionalOffer = await PromotionalOffer.findOne({_id: data.promotionalOffer});
// const productIds = data.products.map(m => new ObjectId(m));
//
//
// const dataSchema = new OfferProduct(data);
// await dataSchema.save();
//
// await Product.updateMany({_id: {$in: productIds}}, {$set: {
//         campaignStartDate: promotionalOffer.campaignStartDate,
//         campaignStartTime: promotionalOffer.campaignStartTime,
//         campaignEndDate: promotionalOffer.campaignEndDate,
//         campaignEndTime: promotionalOffer.campaignEndTime,
//     }})

exports.editOfferProduct = async (req, res, next) => {
    try {

        const data = req.body;
        const promotionalOffer = await PromotionalOffer.findOne({_id: data.promotionalOffer});
        const productIds = data.products.map(m => new ObjectId(m));


        await OfferProduct.findOneAndUpdate({_id: data._id}, data);

        await Product.updateMany({_id: {$in: productIds}}, {$set: {
                campaignStartDate: promotionalOffer.campaignStartDate,
                campaignStartTime: promotionalOffer.campaignStartTime,
                campaignEndDate: promotionalOffer.campaignEndDate,
                campaignEndTime: promotionalOffer.campaignEndTime,
            }})

        res.status(200).json({
            message: 'Offer Product Added Successfully!'
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



