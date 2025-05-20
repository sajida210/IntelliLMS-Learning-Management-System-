const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register Controller
exports.register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);

    const { name, email, password, role } = req.body;
    if (!email || !password || !role) {
      console.log("Missing fields:", { name, email, password, role });
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    console.log("User registered successfully:", email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing fields:", { email, password });
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔐 Sign token with role and user ID
    const token = jwt.sign(
      {
        id: user._id,       // ✅ `id` instead of `userId` for consistency with middleware
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    console.log("Login successful for:", email);
    res.json({
      token,
      role: user.role,
      studentId: user._id, // ✅ optional: useful for client-side routing or DB calls
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
