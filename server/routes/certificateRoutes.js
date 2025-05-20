// routes/certificateRoutes.js
const express     = require("express");
const PDFDocument = require("pdfkit");
const path        = require("path");
const Progress    = require("../models/Progress");
const Certificate = require("../models/Certificate");
const User        = require("../models/User");
const Course      = require("../models/Course");

const router = express.Router();

// POST /api/certificates/generate
router.post("/generate", async (req, res) => {
  const { studentId, courseId, studentName } = req.body;

  try {
    // 1️⃣ Fetch student
    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ error: "Student not found" });

    // 2️⃣ Decide name
    const name = studentName.trim() || user.name;

    // 3️⃣ Fetch course title
    const course      = await Course.findById(courseId);
    const courseTitle = course ? course.title : "Your Course";

    // 4️⃣ Verify 100% completion
    const entries = await Progress.find({ studentId, courseId });
    if (!entries.length) return res.status(400).json({ error: "No progress found" });
    const avg = entries.reduce((sum, e) => sum + e.progress, 0) / entries.length;
    if (avg < 100) return res.status(403).json({ error: "Course not completed yet" });

    // 5️⃣ Save record
    await Certificate.create({ studentId, courseId, name });

    // 6️⃣ Stream PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${courseId}.pdf"`
    );

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0
    });
    doc.pipe(res);

    doc.registerFont("DancingScript", path.join(__dirname, "../assets/Fonts/DancingScript-SemiBold.ttf"));
    doc.registerFont("BodoniSerif", path.join(__dirname, "../assets/Fonts/Boldonse-Regular.ttf")); // corrected



    // — Background
    const bgPath = path.join(__dirname, "../assets/cert-bg.jpg");
    doc.image(bgPath, 0, 0, { width: 842, height: 595 });

    // — Student Name
    doc
      .font("DancingScript")
      .fontSize(32)
      .fillColor("#003366")
      .text(name, 0, 247, {
        align: "center",
        width: 842,
      });

    // — “has successfully completed this course”
    doc
      .font("Times-Italic")
      .fontSize(20)
      .fillColor("#004C4C")
      .text("has successfully completed this course", 0, 290, {
        align: "center",
        width: 842,
      });

    // — Course Title
    doc
      .font("Courier-BoldOblique")
      .fontSize(24)
      .fillColor("#004C4C")
      .text(`"${courseTitle}"`, 0, 320, {
        align: "center",
        width: 842,
      });

    // — Date (bottom-left)
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#000")
      .text(`Date: ${new Date().toLocaleDateString()}`, 175, 440);

    // — IntelliLMS Signature Label (above Authorized Signature)
    doc
      .font("BodoniSerif")
      .fontSize(16)
      .fillColor("#003366")
      .text("IntelliLMS", 517, 428, {
        align: "right",
        width: 132,
      });

    // — Authorized Signature (bottom-right)
    doc
      .font("Helvetica-Oblique")
      .fontSize(12)
      .fillColor("#000")
      .text("Authorized Signature", 535, 460, {
        align: "right",
        width: 132,
      });

    doc.end();
  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;