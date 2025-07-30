import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(404).json({ success: false, error: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(404).json({ success: false, error: "Invalid token" });
    }

    const user = await User.findById({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: "Unauthorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin resource, access denied' });
  }
};

// Authorize middleware factory
const authorize = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    return res.status(403).json({ message: `Require ${role} role` });
  }
};


export { verifyUser, verifyAdmin, authorize }; // Export authorize