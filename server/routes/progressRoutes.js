// backend/routes/progressRoutes.js
const express = require("express");
const router  = express.Router();
const Progress = require("../models/Progress");

// ✅ Save or update a progress entry
router.post("/save", async (req, res) => {
  try {
    const { studentId, courseId, quizId, correctAnswers, totalQuestions } = req.body;
    const progressPercentage = Math.round((correctAnswers / totalQuestions) * 100);

    let entry = await Progress.findOne({ studentId, courseId, quizId });
    if (entry) {
      entry.correctAnswers = correctAnswers;
      entry.totalQuestions = totalQuestions;
      entry.progress       = progressPercentage;
      await entry.save();
    } else {
      entry = await Progress.create({
        studentId,
        courseId,
        quizId,
        correctAnswers,
        totalQuestions,
        progress: progressPercentage,
      });
    }

    return res.status(200).json(entry);
  } catch (error) {
    console.error("Error saving progress:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all progress entries for a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const entries = await Progress.find({ studentId: req.params.studentId });
    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
