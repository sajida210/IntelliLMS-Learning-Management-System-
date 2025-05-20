const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");

// ✅ Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.json(students); // Return the students as a response
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// ✅ Get Enrolled Courses
router.get("/enrolled", async (req, res) => {
  try {
    const studentId = req.query.studentId; // Correctly access the studentId
    if (!studentId) return res.status(400).json({ error: "Student ID is required" });

    const student = await Student.findById(studentId).populate("enrolledCourses");
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json(student.enrolledCourses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching enrolled courses" });
  }
});

// ✅ Enroll a Student
router.post("/enroll", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) return res.status(400).json({ error: "Missing studentId or courseId" });

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    if (!student || !course) return res.status(404).json({ error: "Student or Course not found" });

    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res.json({ message: "Enrolled successfully", enrolledCourses: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ error: "Error enrolling student" });
  }
});

module.exports = router;
