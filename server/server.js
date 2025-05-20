// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS (allow Vite dev server)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.options("*", cors());

// JSON middleware
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes         = require("./routes/authRoutes");
const courseRoutes       = require("./routes/courseRoutes");
const quizRoutes         = require("./routes/quizRoutes");
const quizResponseRoutes = require("./routes/quizResponseRoutes");
const enrollRoutes       = require("./routes/enrollRoutes");
const studentRoutes      = require("./routes/studentRoutes");
const progressRoutes     = require("./routes/progressRoutes");
const certificateRoutes  = require("./routes/certificateRoutes");  // ← new

app.use("/api/auth",       authRoutes);
app.use("/api/courses",    courseRoutes);
app.use("/api/quizzes",    quizRoutes);
app.use("/api/responses",  quizResponseRoutes);
app.use("/api/enroll",     enrollRoutes);
app.use("/api/students",   studentRoutes);
app.use("/api/progress",   progressRoutes);
app.use("/api/certificates", certificateRoutes);

// Default
app.get("/", (req, res) => res.send("🚀 Welcome to the LMS API!"));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
