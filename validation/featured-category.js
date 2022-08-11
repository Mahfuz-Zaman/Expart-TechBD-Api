const { body } = require("express-validator");

exports.checkInput = [
  body("featuredCategoryName")
    .not()
    .isEmpty()
    .withMessage("Please enter a valid Featured Category!"),
  body("url").not().isEmpty().withMessage("Please enter a valid Url!"),
];
