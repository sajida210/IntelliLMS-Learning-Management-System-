const mongoose = require("mongoose");

const studentQuizResponseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to student
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true }, // Reference to quiz
  responses: [
    {
      questionText: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentQuizResponse", studentQuizResponseSchema);
