const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.filter = new Schema(
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

exports.range = new Schema(
    {
        min: {
            type: Number,
        },
        max: {
            type: Number
        }
    },
    {
        _id: false
    }
);


exports.MenuChild = new Schema(
    {
        subCatId: {
            type: String,
            required: true
        },
        subCatName: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        brands: {
            type: [Object],
            required: true
        },
        priority: {
            type: Number,
            required: false
        }
    },
    {
        _id: false
    }
);


exports.BannerData = new Schema(
    {
        tag: {
            type: String,
            required: false
        },
        order: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: false
        },
    },
    {
        _id: true
    }
);


exports.address = new Schema(
    {
        addressType: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        alternativePhoneNo: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true
        },

        area: {
            type: String,
            required: true
        },

        zone: {
            type: String,
            required: false
        },

        shippingAddress: {
            type: String,
            required: true
        },
    },
    {
        _id: true
    }
);

exports.orderItem = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discountType: {
            type: Number,
            required: false
        },
        discountAmount: {
            type: Number,
            required: false
        },
        quantity: {
            type: Number,
            required: true
        },
        orderType: {
            type: String,
            required: true
        }
    },
    {
        _id: true
    }
);
