const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  name:      { type: String, required: true },      // name as they want printed
  issuedAt:  { type: Date,   default: Date.now }
});

module.exports = mongoose.model("Certificate", certificateSchema);
