const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ▶️ Create a new course
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming course data:", req.body);  // <--- Add this

    const { title, description, videoUrl, thumbnail } = req.body;

    // Check if all required fields are present
    if (!title || !description || !videoUrl || !thumbnail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCourse = new Course({ title, description, videoUrl, thumbnail });
    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("❌ Error creating course:", error.message);  // log only message
    res.status(500).json({ message: "Error creating course", error: error.message }); // include message in response
  }
});

// ✅ Get all courses
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find();
    return res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    return res.status(500).json({ message: "Error fetching courses" });
  }
});

// ✅ Get a specific course by MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.json(course);
  } catch (error) {
    console.error("❌ Error fetching course:", error);
    return res.status(500).json({ message: "Error fetching course" });
  }
});

// ✅ Get students enrolled in a course by course _id
router.get("/:id/students", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollments = await Enrollment.find({ courseId: id }).populate("studentId", "email");
    const numberOfStudents = enrollments.length;
    const students = enrollments.map((e) => e.studentId.email);

    return res.json({ numberOfStudents, students });
  } catch (error) {
    console.error("❌ Error fetching enrolled students:", error);
    return res.status(500).json({ message: "Error fetching enrolled students" });
  }
});

// ✅ Update a course by MongoDB _id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Course not found" });
    return res.json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    return res.status(500).json({ message: "Error updating course" });
  }
});

// ✅ Delete a course by MongoDB _id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    return res.status(500).json({ message: "Error deleting course" });
  }
});

module.exports = router;
