const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  featuredCategoryName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("FeaturedCategory", schema);
