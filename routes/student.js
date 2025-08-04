const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const validation = require("../utilities/student-validation");
const { isAuthenticated } = require('../middleware/authenticate');

// Define routes for student operations
router.get("/",
    studentController.getAllStudents
); 

router.get(
    "/:id",
    studentController.getStudentById
);

router.post("/",
    isAuthenticated,
    validation.addStudentRules(),
    validation.addStudentValidation,
    studentController.createStudent
);

router.put(
    "/:id",
    isAuthenticated,
    validation.addStudentRules(),
    validation.addStudentValidation,
    studentController.updateStudent
);

router.delete(
    "/:id",
    isAuthenticated,
    studentController.deleteStudent
);

module.exports = router;