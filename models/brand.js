const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        brandName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        about: {
            type: String
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
    }
)

module.exports = mongoose.model('Brand', schema);
