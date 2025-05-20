const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check authentication
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database (minus password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found" });
    }

    // Attach the user object to req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
