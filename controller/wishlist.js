
// Require Post Schema from Model..
const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Book = require('../models/product');

/**
 * Add To Wishlist
 * Delete From Wishlist
 */


 exports.getAllBooksInWishlistByUserId = async (req, res, next) => {
    try {

        const userId = req.userData.userId;
        const wishlist = await Wishlist.find({userId: userId});
        const ids = wishlist.map(function(wishlist) { return wishlist.product});
        const books = await Book.find({_id: {$in: ids}});

        res.status(200).json({
            data: books,
            message: "Wishlist Retrieved Successfully!"
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

 exports.addToWishlist = async (req, res, next) => {

    const userId = req.userData.userId;
    const data = req.body;
    const final = {...data, ...{userId: userId}}

    try {
        const wishlist = new Wishlist(final);
        await wishlist.save();

        await User.findOneAndUpdate({_id: userId}, {
            "$push": {
                wishlists: data.product
            }
        })

        res.status(200).json({
            message: 'Added to Wishlist Successfully!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.removeBookFromWishlistByBookId = async (req, res, next) => {

    // const userId = req.userData.userId;
    const userId = req.userData.userId;
    const bookId = req.params.bookId;

    try {

        await User.updateOne({_id: userId}, {$pullAll: {wishlists: [bookId]}});
        await Wishlist.deleteOne({product: bookId, userId: userId});

        res.status(200).json({
            message: 'Item Removed Successfully From Wishlist!'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getStatusOfBookInWishlist = async (req, res, next) => {
    const userId = req.userData.userId;
    const bookId = req.params.bookId;

    try {

        const data = await Wishlist.findOne({userId: userId, product: bookId}).distinct('product')
        let message = "Item can be added to Wishlist";
        let exists = false;
        if (data.length === 1) {
            exists = true;
            message = "Item already exists in wishlist!";
        }
        res.status(200).json({
            // data: data.length,
            exists: exists,
            message: message
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
