const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");


router.get("/student/:id", enrollmentController.getEnrollmentsByStudent);
router.get("/course/:id", enrollmentController.getEnrollmentsByCourse);
router.post("/", enrollmentController.enrollStudent);
router.delete("/:id", enrollmentController.dropEnrollment);
router.put("/:id/progress", enrollmentController.updateEnrollmentProgress);

module.exports = router;