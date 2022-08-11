const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filterSchema = new Schema(
    {
        title: {
            type: String,
        },
        key: {
            type: String
        },
        components: [Object]
    },
    {
        _id: false
    }
);

const schema = new Schema(
    {
        category: {
            type: String,
        },
        filters: {
            type: [filterSchema]
        }
    }
);

module.exports = mongoose.model('FilterCategory', schema);
