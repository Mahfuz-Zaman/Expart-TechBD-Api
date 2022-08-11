const express = require('express');

// Created Require Files..
const controller = require('../controller/book');
const inputValidator = require('../validation/book');
const checkAdminAuth = require('../middileware/check-admin-auth');

// Get Express Router Function..
const router = express.Router();

/**
 * /api/book
 * http://localhost:3000/api/book
 */

router.post('/add-single-book', inputValidator.checkBookInput, controller.addSingleBook);
router.get('/get-all-book-list', controller.getAllBooks);
router.get('/get-single-book-by-slug/:slug', controller.getSingleBookBySlug);
router.get('/get-single-book-by-id/:id', controller.getSingleBookById);
// // Search
router.get('/get-books-by-text-search', controller.getSearchBookByText);
router.get('/get-all-books-by-category/:id', controller.getAllBooksByCategory);
router.get('/get-all-books-by-author/:id', controller.getAllBooksByAuthor);
router.get('/get-all-books-by-publisher/:id', controller.getAllBooksByPublisher);
// Modify
router.post('/edit-book-by-id', inputValidator.checkBookInput, controller.editBookData);
router.delete('/delete-book-by-id/:id', controller.deleteBookById);


// Export All router..
module.exports = router;
