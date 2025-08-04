const express = require('express');
const router = express.Router();
const validate = require('../utilities/course-validation');

const courses = require('../controllers/courseController');
const { isAuthenticated } = require('../middleware/authenticate');

router.post('/',
    isAuthenticated,
    validate.addCourseRules(),
    validate.addCourseValidation,
    courses.createCourse
);

router.get('/',
    courses.getAll
);

router.get('/:id',
    courses.getById
);

router.put('/:id',
    isAuthenticated,
    validate.addCourseRules(),
    validate.addCourseValidation,
    courses.updateCourse
)

router.delete('/:id',
    isAuthenticated,
    courses.deleteCourse
);

module.exports = router;