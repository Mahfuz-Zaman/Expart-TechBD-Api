const { body } = require('express-validator');

exports.checkInput = [
    body('categoryName').not().isEmpty().withMessage('categoryName required!'),
    body('categoryId').not().isEmpty().withMessage('categoryId required!'),
    body('slug').not().isEmpty().withMessage('slug required!'),
];
