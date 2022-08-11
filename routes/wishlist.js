const express = require('express');

// Imports
const controller = require('../controller/wishlist');
const checkAuth = require('../middileware/check-user-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/wishlist
 * http://localhost:3000/api/wishlist
 */

//adds book data to wishlist, use with the API below that is, get-status-of-book-in-wishlist/:bookId which returns status of book
router.post('/add-to-wishlist', checkAuth, controller.addToWishlist); // http://localhost:3000/api/wishlist/add-to-wishlist


//returns true if book is in wishlist else returns false against the book ID and user ID
router.get('/get-status-of-book-in-wishlist/:bookId', checkAuth, controller.getStatusOfBookInWishlist); // http://localhost:3000/api/wishlist/get-status-of-book-in-wishlist/:bookId


//returns an array of books against the logged in user ID
router.get('/get-all-book-from-wishlist', checkAuth, controller.getAllBooksInWishlistByUserId); // http://localhost:3000/api/wishlist/get-all-book-from-wishlist/:userID


//deletes book from wishlist against the book ID and user ID
router.delete('/delete-book-from-wishlist-by-book-id/:bookId', checkAuth, controller.removeBookFromWishlistByBookId); // http://localhost:3000/api/product/delete-book-from-wishlist-by-book-id/:bookId


// Export router class..
module.exports = router;
