const {body, validationResult} = require('express-validator');

const validate = {};

validate.addEnrollmentRules = () => {
    return [
        body('studentId')  
            .trim()
            .escape()
            .notEmpty().withMessage('Student ID cannot be empty'),
        body('courseId')
            .trim()
            .escape()
            .notEmpty().withMessage('Course ID cannot be empty'),
    ];
}

validate.updateProgressRules = () => {
    return [
            body('progress')
            .trim()
            .escape()
            .notEmpty().withMessage('Progress cannot be empty')
            .isIn(['enrolled', 'completed', 'dropped']).withMessage('Status must be one of: enrolled, completed, dropped'),
    ];
}


validate.addEnrollmentValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
    return res.status(422).json({
        errors : extractedErrors,
    })
};

module.exports = validate;