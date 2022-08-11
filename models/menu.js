const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subSchema = require('./sub-schema-model');

const schema = new Schema(
    {
        categoryName: {
            type: String,
            required: true
        },
        categoryId: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        subCategories: {
            type: [subSchema.MenuChild],
            required: false
        },
        priority: {
            type: Number,
            required: false
        }
    }
)

module.exports = mongoose.model('Menu', schema);
