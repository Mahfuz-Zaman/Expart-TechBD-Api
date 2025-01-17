const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema(
    {
        deliveryInDhaka: {
            type: Number,
            required: true
        },
        deliveryOutsideDhaka: {
            type: Number,
            required: true
        },
        deliveryOutsideBD: {
            type: Number,
            required: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ExtraData', schema);

