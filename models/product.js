const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        features: {
            type: [String],
            required: true
        },
        regularPrice: {
            type: Number,
            required: false
        },
        salePrice: {
            type: Number,
            required: true
        },
        images: {
            type: [Object],
            required: false
        },
        productImages: {
            type: [String],
            required: false
        },
        productCode: {
            type: String,
            required: false
        },
        discount: {
            type: Number
        },
        discountType: {
            type: Number,
            required: false
        },
        isEMI: {
            type: Boolean,
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        categorySlug: {
            type: String,
            required: true
        },
        categoryName: {
            type: String,
            required: true
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        },
        subCatSlug: {
            type: String,
            required: true
        },
        subCatName: {
            type: String,
            required: true
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand'
        },
        brandSlug: {
            type: String,
            required: false
        },
        brandName: {
            type: String,
            required: false
        },
        isCampaigned: {
            type: Boolean,
            required: false
        },
        youtubeUrl: {
            type: String,
            required: false
        },
        filters: {
            type: Object
        },
        extraData: {
            type: Schema.Types.ObjectId,
            ref: 'ProductExtraData'
        },
        campaignStartDate: {
            type: String,
            required: false
        },
        campaignStartTime: {
            type: String,
            required: false
        },
        campaignEndDate: {
            type: String,
            required: false
        },
        campaignEndTime: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
);

productSchema.plugin(mongoose_fuzzy_searching, {fields: ['name']});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
