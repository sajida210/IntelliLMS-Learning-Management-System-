const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Quiz = require("../models/Quiz");
const StudentQuizResponse = require("../models/StudentQuizResponse");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// ✅ [ADMIN] Add a new quiz
router.post("/add", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { courseId, questions } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid or missing Course ID" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required!" });
    }

    const newQuiz = new Quiz({ courseId, questions });
    await newQuiz.save();

    res.status(201).json({ message: "Quiz added successfully!", quiz: newQuiz });
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [PUBLIC] Get all quizzes
router.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find().lean();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [PUBLIC] Get quizzes for a specific course
router.get("/by-course/:courseId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const quizzes = await Quiz.find({ courseId: req.params.courseId }).lean();
    res.status(200).json(quizzes || []);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [PUBLIC] Get a specific quiz by ID
router.get("/:quizId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      return res.status(400).json({ message: "Invalid Quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.quizId).lean();
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [ADMIN] Update a quiz
router.put("/:quizId/update", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { questions },
      { new: true, lean: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [ADMIN] Delete a quiz
router.delete("/:quizId/delete", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ [STUDENT] Submit quiz answers
router.post("/submit", async (req, res) => {
  try {
    const { studentId, quizId, responses } = req.body;

    if (!studentId || !quizId || !responses || responses.length === 0) {
      return res.status(400).json({ message: "Student ID, Quiz ID, and responses are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const validatedResponses = responses.map((response) => {
      const question = quiz.questions.find(q => q._id.toString() === response.questionId);
      return {
        questionText: question?.questionText || "Unknown Question",
        selectedAnswer: response.selectedAnswer,
        isCorrect: question?.correctAnswer === response.selectedAnswer
      };
    });

    const studentResponse = new StudentQuizResponse({
      studentId,
      quizId,
      responses: validatedResponses
    });

    await studentResponse.save();

    res.json({ message: "Quiz submitted successfully!", results: validatedResponses });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ [STUDENT] Get quiz results
router.get("/results/:studentId", async (req, res) => {
  try {
    const results = await StudentQuizResponse.find({ studentId: req.params.studentId })
      .populate("quizId", "questions")
      .lean();

    res.status(200).json(results || []);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;