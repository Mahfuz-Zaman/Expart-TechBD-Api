const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');


exports.addToCart = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const userId = req.userData.userId;
    const data = req.body;
    const final = {...data, ...{user: userId}}
    console.log(final);

    try {
        const cart = new Cart(final);
        const cartRes = await cart.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                carts: cartRes._id
            }
        })
        res.status(200).json({
            message: 'Added to Cart Successfully!'
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

exports.getCartItemByUserId = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

            const data = await User.findOne({_id: userId})
                .populate({ path: 'carts -_id', populate: { path: 'product', select: 'name slug category categorySlug categoryName salePrice discount quantity images productImages' } }).select('carts')

        res.status(200).json({
            data: data.carts ? data.carts : [],
            message: 'All Products Fetched Successfully!'
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

exports.incrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            {_id: cartId},
            {$inc: {'selectedQty': 1}},
            {new: true}
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.decrementCartQty = async (req, res, next) => {

    const cartId = req.body.cartId;

    try {
        await Cart.findOneAndUpdate(
            {_id: cartId},
            {$inc: {'selectedQty': -1}},
            {new: true}
        )
        res.status(200).json({
            message: 'Update cart quantity Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteCartItem = async (req, res, next) => {

    console.log(req.params);

    const cartId = req.params.cartId;
    const userId = req.userData.userId;

    try {
        const query = {_id: cartId}
        await Cart.deleteOne(query)

        await User.updateOne(
            {_id: userId},
            {
                $pull: { carts: { "$in": cartId } }
            }
        )

        res.status(200).json({
            message: 'Item Removed Successfully From Cart!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getCartItemCount = async (req, res, next) => {

    const userId = req.userData.userId;

    try {

        const cartsId = await User.findOne({_id: userId}).distinct('carts')

        res.status(200).json({
            data: cartsId.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleCartProduct = async (req, res, next) => {
    const userId = req.userData.userId;
    const productId = req.params.productId;

    try {

        const data = await Cart.findOne({user: userId, product: productId}).select('selectedQty')

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
