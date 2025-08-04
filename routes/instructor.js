const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
const validation = require("../utilities/instructor-validation")
const { isAuthenticated } = require('../middleware/authenticate');

// Define routes for student operations
router.get("/",
    instructorController.getAllInstructors
); 

router.get(
    "/:id",
    instructorController.getInstructorById
);

router.post("/",
    isAuthenticated,
    validation.addInstructorRules(),
    validation.addInstructorValidation,
    instructorController.createInstructor
);

router.put(
    "/:id",
    isAuthenticated,
    validation.addInstructorRules(),
    validation.addInstructorValidation,
    instructorController.updateInstructor
);

router.delete(
    "/:id",
    isAuthenticated,
    instructorController.deleteInstructor
);

module.exports = router;