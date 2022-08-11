const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        },
        priority: {
            type: Number,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: false
        },
    }
)
module.exports = mongoose.model('offerBanner', schema);
