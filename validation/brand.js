const { body } = require('express-validator');

exports.checkInput = [
    body('authorName').not().isEmpty().withMessage('Please enter a valid authorName!'),
    body('slug').not().isEmpty().withMessage('Please enter a valid slug!'),
];
