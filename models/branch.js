const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        primaryPhoneNo: {
            type: String,
            required: true
        },
        secondaryPhoneNo: {
            type: String,
            required: false
        },
        addressLineOne: {
            type: String,
            required: true
        },
        addressLineTwo: {
            type: String,
            required: false
        },
        addressLines: [{
            type:String,
            required: false
        }],
        email: {
            type: String,
            required: false
        },
        shopOpenTime: {
            type: String,
            required: true
        },
        notification: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        priority: {
            type: Number,
            required: false
        }
    }
)

module.exports = mongoose.model('Branch', schema);
