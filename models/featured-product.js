const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
{
    type: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: false
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, {
    timestamps: false
});

module.exports = mongoose.model('FeaturedProduct', schema);