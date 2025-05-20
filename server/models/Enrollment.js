// const mongoose = require("mongoose");

// const enrollmentSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   paymentId: {
//     type: String,
//     required: true,
//   },
//   enrolledAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Enrollment", enrollmentSchema);


// const mongoose = require("mongoose");

// const enrollmentSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",  // ✅ Must match the model you're using for students
//     required: true,
//   },
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   paymentId: {
//     type: String,
//     required: true,
//   },
//   enrolledAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Enrollment", enrollmentSchema);

const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",    // ← Make sure this matches your User model name exactly
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
