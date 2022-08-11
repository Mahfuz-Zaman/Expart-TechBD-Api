const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        isEMI: {
            type: Boolean,
            required: false
        },
        mpn: {
            type: String
        },
        specification: {
            type: [Object]
        },
        description: {
            type: String
        },
        ratingsCount: {
            type: Number
        },
        ratingsValue: {
            type: Number
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review',
            required: false
        }]
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('ProductExtraData', productSchema);
