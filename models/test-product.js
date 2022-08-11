const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schema = new Schema(
    {
        name: {
            type: String,
        },
        filters: {
            type: Object
        }
    }
);

module.exports = mongoose.model('TestProduct', schema);
