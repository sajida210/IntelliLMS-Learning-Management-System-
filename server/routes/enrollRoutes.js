
const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Enroll in course
// Mounted at /api/enroll, so this listens on POST /api/enroll
router.post("/", authMiddleware, async (req, res) => {
  console.log("⬅️ POST /api/enroll called");
  console.log("Request body:", req.body);
  console.log("User from token:", req.user);

  const { courseId } = req.body;
  const studentId = req.user._id;

  if (!studentId || !courseId) {
    console.warn("❌ Missing studentId or courseId", { studentId, courseId });
    return res.status(400).json({ error: "Missing studentId or courseId" });
  }

  try {
    // Prevent double‑enrollment
    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
      console.warn("⚠️ Already enrolled:", { studentId, courseId });
      return res.status(400).json({ error: "Already enrolled" });
    }

    // Ensure the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.warn("❌ Course not found:", courseId);
      return res.status(404).json({ error: "Course not found" });
    }

    // Create the enrollment record
    const newEnrollment = new Enrollment({
      courseId,
      studentId,
      paymentId: "ENROLLMENT_FREE_MODE",
    });
    await newEnrollment.save();

    console.log("✅ Enrollment successful:", newEnrollment._id);
    return res.status(201).json({
      message: "Enrollment successful",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("❌ Error saving enrollment:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// Get all enrolled courses for student
// Mounted at GET /api/enroll/mine
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user._id;
    console.log("➡️ GET /api/enroll/mine for student:", studentId);

    const enrollments = await Enrollment.find({ studentId }).populate("courseId");
    const courses = enrollments.map((e) => e.courseId);
    return res.status(200).json(courses);
  } catch (err) {
    console.error("❌ Error fetching enrolled courses:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
