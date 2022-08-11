const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        shortDesc: {
            type: String,
            required: true
        },
        validation: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('OfferPackage', schema);
