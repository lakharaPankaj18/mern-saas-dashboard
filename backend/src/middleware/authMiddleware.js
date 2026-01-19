import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  let token;

  // check for authorization headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to req
      req.user = await User.findById(decoded.id).select("-password");

      // Allow req
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token invalid",
      });
    }
  }
  // No token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

export default protect;
