// backend/models/Progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId:      { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
  courseId:       { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  quizId:         { type: mongoose.Schema.Types.ObjectId, ref: "Quiz",   required: true },
  correctAnswers: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  progress:       { type: Number, default: 0 }, // percentage
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);
