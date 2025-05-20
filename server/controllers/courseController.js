const Course = require('../models/Course');

// Create
exports.addCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail } = req.body;
    const newCourse = new Course({ title, description, videoUrl, thumbnail });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error: error.message });
  }
};

// Get All
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// Update
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      { title, description, videoUrl, thumbnail },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found!" });
    }

    res.status(200).json({ message: "Course updated successfully!", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

// Delete
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found!" });
    }

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};
