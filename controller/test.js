const faker = require('faker');

const Test = require('../models/test');
const TestProduct = require('../models/test-product');
const FilterCategory = require('../models/filter-category');


// Tests
const getArrayFieldData = async (req, res, next) => {

    const authorId = '5fee4440a76bce01b0774c90';
    const filter = {_id: authorId}

    // db.blogs.find({}, {posts:{$slice: [10, 10]}}) // skip 10, limit 10

    try {
        const result = await Book.findOne(
            filter,
            {
                tests: {$slice: [0, 2]}
            }
        ).exec()

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

const removeArrayFieldData = async (req, res, next) => {

    const authorId = '5fee4440a76bce01b0774c90';
    const filter = {_id: authorId}

    try {
        const result = await Book.updateOne(
            filter,
            {
                $pullAll: {tests: ['id7']}
            }
        ).exec()

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

const addTenKDummyData = async (req, res, next) => {

    const totalNumber = 10000;

    for (let i = 0; i < totalNumber; i++) {
        const team = new Test({
            name: faker.name.findName(),
            username: faker.internet.userName(),
            description: faker.lorem.paragraph()
        })
        team.save()
    }

    res.status(200).json({
        data: 'success'
    });
}

const getExplainQuery = async (req, res, next) => {

    // const authorId = '5fee4440a76bce01b0774c90';
    const filter = {name: 'Tami Stokes'}


    try {
        const result = await Test.find(
            filter
        ).lean()

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

const getSearchByText = async (req, res, next) => {
    try {
        const query = req.query.q;

        const results = await Test.fuzzySearch({query: query, prefixOnly: false, minSize: 1})
        console.log(results.length)

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
 * 18 Jan 2020
 */

exports.insertTestProduct = async (req, res, next) => {

    const data = req.body;
    try {
        const product = new TestProduct(data)
        await product.save();

        res.status(200).json({
            message: 'Added Data'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.filterTestProduct = async (req, res, next) => {

    const data = req.body;
    console.log(data);

    try {
        // const query = {"filters.processor": "M1 Chip", "filters.ram": "16 GB", "filters.ssd": "Up to 1TB SSD", "filters.graphics": "8GB"}
        const query1 = {"filters.processor": "M1 Chip", "filters.ram": "16 GB"};
        const query2 = {"filters.processor": "Ryzen 7", "filters.ram": "16 GB"};
        const mQuery = [query1, query2];
        const fQuery = [{"filters.processor": "Ryzen 7"}, {"filters.processor": "M1 Chip"}, {"filters.ram": "16 GB"}];

        // const query = {"filters.size": "XL", "filters.colors": "Green"};
        const results = await TestProduct.find({$or: data})



        res.status(200).json({
            data: results,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.insertFilterCategory = async (req, res, next) => {

    const data = req.body;
    try {
        const product = new FilterCategory(data)
        await product.save();

        res.status(200).json({
            message: 'Added Data'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.getFilterCategory = async (req, res, next) => {

    try {
        const result = await FilterCategory.findOne();
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


// Tests
exports.getArrayFieldData = getArrayFieldData
exports.removeArrayFieldData = removeArrayFieldData
exports.addTenKDummyData = addTenKDummyData
exports.getExplainQuery = getExplainQuery
exports.getSearchByText = getSearchByText
