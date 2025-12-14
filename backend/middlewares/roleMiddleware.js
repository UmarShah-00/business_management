const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "Access denied: You are not allowed",
      });
    }
    next(); 
  };
};

module.exports = authorizeRoles;
