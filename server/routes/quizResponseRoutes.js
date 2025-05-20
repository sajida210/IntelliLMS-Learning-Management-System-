// backend/routes/quizResponseRoutes.js
const express = require("express");
const router = express.Router();
const StudentQuizResponse = require("../models/StudentQuizResponse");
const Quiz                 = require("../models/Quiz");
const Progress             = require("../models/Progress");

// ✅ Submit a quiz response (student)
router.post("/submit", async (req, res) => {
  try {
    const { studentId, quizId, responses } = req.body;
    if (!studentId || !quizId || !responses?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1) Fetch the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // 2) Grade it
    let correctCount = 0;
    const processed = responses.map((r) => {
      const question = quiz.questions.find((q) => q._id.toString() === r.questionId);
      const isCorrect = question && r.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionText: question?.questionText || "Unknown question",
        selectedAnswer: r.selectedAnswer,
        isCorrect
      };
    });

    // 3) Save the student’s raw responses
    const saved = await StudentQuizResponse.create({
      studentId,
      quizId,
      responses: processed
    });

    // 4) Upsert into Progress
    const totalQuestions    = quiz.questions.length;
    const progressPercentage = Math.round((correctCount / totalQuestions) * 100);
    const courseId           = quiz.courseId;

    let entry = await Progress.findOne({ studentId, quizId });
    if (entry) {
      entry.correctAnswers   = correctCount;
      entry.totalQuestions   = totalQuestions;
      entry.progress         = progressPercentage;
      await entry.save();
    } else {
      entry = await Progress.create({
        studentId,
        courseId,
        quizId,
        correctAnswers: correctCount,
        totalQuestions,
        progress: progressPercentage
      });
    }

    return res.status(201).json({
      message: "Quiz submitted successfully!",
      correctAnswers: correctCount,
      totalQuestions,
      progress: progressPercentage
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all quiz responses for a student
router.get("/:studentId", async (req, res) => {
  try {
    const list = await StudentQuizResponse.find({ studentId: req.params.studentId });
    if (!list.length) return res.status(404).json({ message: "No responses found" });
    return res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
