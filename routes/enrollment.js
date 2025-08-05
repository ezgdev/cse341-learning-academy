const express = require("express");
const router = express.Router();
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
    enrollmentController.enrollStudent
);

router.put("/:id/progress",
    isAuthenticated,
    enrollmentController.updateEnrollmentProgress
);

router.delete("/:id",
    isAuthenticated,
    enrollmentController.dropEnrollment
);


module.exports = router;