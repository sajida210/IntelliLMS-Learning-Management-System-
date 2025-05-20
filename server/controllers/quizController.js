const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

// ✅ Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    console.log("Received Quiz Data:", req.body);

    const { courseId, questions } = req.body;

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid or missing Course ID" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required!" });
    }

    const quiz = new Quiz({ courseId, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz added successfully!", quiz });
  } catch (error) {
    console.error("Error in createQuiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("courseId", "title description").lean();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
