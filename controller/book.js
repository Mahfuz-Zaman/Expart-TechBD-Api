const {validationResult} = require('express-validator');

// Require Post Schema from Model..
const Book = require('../models/book');
const Author = require('../models/brand');
const Category = require('../models/category');
const Publisher = require('../models/sub-category');


/**
 * Add Book
 * Add Bulk Book
 * Get All Book List
 * Single Book by Slug
 */

exports.addSingleBook = async (req, res, next) => {
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
        const book = new Book(data);
        const bookRes = await book.save();

        await Category.findOneAndUpdate({_id: book.category}, {
            "$push": {
                books: bookRes._id
            }
        })
        await Author.findOneAndUpdate({_id: book.author}, {
            "$push": {
                books: bookRes._id
            }
        })
        await Publisher.findOneAndUpdate({_id: book.publisher}, {
            "$push": {
                books: bookRes._id
            }
        })
        res.status(200).json({
            message: 'Book Added Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getAllBooks = async (req, res, next) => {
    try {
        const data = await Book.find()
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')
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

exports.getSingleBookBySlug = async (req, res, next) => {
    const slug = req.params.slug;
    try {
        const query = {slug: slug};
        const data = await Book.findOne(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')
        res.status(200).json({
            data: data,
            message: 'Book fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getSingleBookById = async (req, res, next) => {
    const bookId = req.params.id;
    try {
        const query = {_id: bookId};
        const data = await Book.findOne(query)
        res.status(200).json({
            data: data,
            message: 'Book fetch Successfully!'
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
 * Text SEARCH
 */

exports.getSearchBookByText = async (req, res, next) => {
    try {
        const query = req.query.q;
        const results = await Book.fuzzySearch({query: query, prefixOnly: false, minSize: 1})
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: results
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
 * Edit Product
 */
exports.editBookData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    const updatedData = req.body;

    try {
        const query = {_id: updatedData._id};
        const push = {$set: updatedData};
        const oldBook = await Book.findOne(query);
        await Book.findOneAndUpdate(query, push);

        // Update Category Ref
        if (oldBook.category !== updatedData.category) {
            await Category.updateOne(
                {_id: oldBook.category},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Category.findOneAndUpdate({_id: updatedData.category}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        if (oldBook.author !== updatedData.author) {
            await Author.updateOne(
                {_id: oldBook.author},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Author.findOneAndUpdate({_id: updatedData.author}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        if (oldBook.publisher !== updatedData.publisher) {
            await Publisher.updateOne(
                {_id: oldBook.publisher},
                {
                    $pull: {books: oldBook._id}
                }
            )
            await Publisher.findOneAndUpdate({_id: updatedData.publisher}, {
                "$push": {
                    books: updatedData._id
                }
            })
        }

        res.status(200).json({
            message: 'Book Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.deleteBookById = async (req, res, next) => {

    const bookId = req.params.id;

    try {
        const query = {_id: bookId}
        const book = await Book.findOne(query).select('category author publisher -_id')
        await Book.deleteOne(query)

        // Remove Ref
        await Author.updateOne(
            {_id: book.author},
            {
                $pull: {books: bookId}
            }
        )
        await Category.updateOne(
            {_id: book.category},
            {
                $pull: {books: bookId}
            }
        )
        await Publisher.updateOne(
            {_id: book.publisher},
            {
                $pull: {books: bookId}
            }
        )
        res.status(200).json({
            message: 'Book deleted Successfully!'
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
 * GET BY QUERY
 */

exports.getAllBooksByCategory = async (req, res, next) => {

    const catId = req.params.id;

    try {
        const booksId = await Category.find({_id: catId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: allBooks,
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

exports.getAllBooksByAuthor = async (req, res, next) => {

    const authorId = req.params.id;

    try {
        const booksId = await Author.find({_id: authorId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: allBooks,
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

exports.getAllBooksByPublisher = async (req, res, next) => {

    const publisherId = req.params.id;

    try {
        const booksId = await Publisher.find({_id: publisherId}).distinct('books');
        const query = {_id: {$in: booksId}}
        const allBooks = await Book.find(query)
            .populate('category', '_id categoryName slug')
            .populate('author', '_id authorName slug')
            .populate('publisher', '_id publisherName slug')

        res.status(200).json({
            data: allBooks,
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
