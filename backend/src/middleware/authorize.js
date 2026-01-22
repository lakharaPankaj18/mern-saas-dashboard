const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is already set by protect middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

export default authorize;
