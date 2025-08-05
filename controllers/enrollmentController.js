const { ObjectId } = require("mongodb");
const mongodb = require('../data/database');

// POST /api/enrollments
const enrollStudent = async (req, res) => {
  //#swagger.tags = ['Enrollments']
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) {
    return res.status(400).json({ error: "studentId and courseId are required" });
  }

  try {
    const result = await mongodb.getDb().db().collection("enrollments").insertOne({
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId),
      progress: "enrolled",
      enrolledAt: new Date(),
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll student", details: error.message });
  }
};

// DELETE /api/enrollments/:id
const dropEnrollment = async (req, res) => {
  //#swagger.tags = ['Enrollments']
  const { id } = req.params;
  try {
    const result = await mongodb.getDb().db().collection("enrollments").deleteOne({ _id: new ObjectId(id) });
    result.deletedCount === 1
      ? res.status(200).json({ message: "Enrollment deleted" })
      : res.status(404).json({ error: "Enrollment not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enrollment", details: error.message });
  }
};

// GET /api/enrollments/student/:id
const getEnrollmentsByStudent = async (req, res) => {
  //#swagger.tags = ['Enrollments']
  const { id } = req.params;
  try {
    
    const enrollments = await mongodb.getDb().db()
      .collection("enrollments")
      .find({ studentId: new ObjectId(id) })
      .toArray();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments", details: error.message });
  }
};

// GET /api/enrollments/course/:id
const getEnrollmentsByCourse = async (req, res) => {
  //#swagger.tags = ['Enrollments']
  const { id } = req.params;
  try {
    
    const enrollments = await mongodb.getDb().db()
      .collection("enrollments")
      .find({ courseId: new ObjectId(id) })
      .toArray();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments", details: error.message });
  }
};

// PATCH /api/enrollments/:id/progress
const updateEnrollmentProgress = async (req, res) => {
  //#swagger.tags = ['Enrollments']
  const { id } = req.params;
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ error: "Progress is required" });
  }

  try {
    
    const result = await mongodb.getDb().db().collection("enrollments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { progress } }
    );
    result.modifiedCount === 1
      ? res.status(200).json({ message: "Progress updated" })
      : res.status(404).json({ error: "Enrollment not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress", details: error.message });
  }
};

module.exports = {
  enrollStudent,
  dropEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollmentProgress,
};
