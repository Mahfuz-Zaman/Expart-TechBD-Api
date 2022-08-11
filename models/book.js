const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');


const bookSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        images: {
            type: Object,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        specification: {
            type: Object
        },
        oldPrice: {
            type: Number
        },
        newPrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        ratingsCount: {
            type: Number
        },
        ratingsValue: {
            type: Number
        },
        productCode: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author'
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher'
        },
        tag: {
            type: [String]
        },
        reviews: {
            type: [String]
        },
    },
    {
        timestamps: true
    }
);

bookSchema.plugin(mongoose_fuzzy_searching, { fields: ['name', 'slug'] });
module.exports = mongoose.model('Book', bookSchema);
