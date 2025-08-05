const express = require("express");
const router = express.Router();
const validate = require("../utilities/enrolment-validation");
const enrollmentController = require("../controllers/enrollmentController");
const { isAuthenticated } = require('../middleware/authenticate');


router.get("/student/:id",
    enrollmentController.getEnrollmentsByStudent
);

router.get("/course/:id",
    enrollmentController.getEnrollmentsByCourse
);

router.post("/",
    isAuthenticated,
    validate.addEnrollmentRules(),
    validate.addEnrollmentValidation,
    enrollmentController.enrollStudent
);

router.put("/:id/progress",
    isAuthenticated,
    validate.updateProgressRules(),
    validate.addEnrollmentValidation,
    enrollmentController.updateEnrollmentProgress
);

router.delete("/:id",
    isAuthenticated,
    validate.addEnrollmentRules(),
    validate.addEnrollmentValidation,
    enrollmentController.dropEnrollment
);


module.exports = router;