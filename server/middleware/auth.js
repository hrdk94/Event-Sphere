const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ NORMALIZED USER OBJECT
      req.user = {
        id: decoded.id || decoded._id || decoded.userId,
        role: decoded.role?.toLowerCase(),
      };

      if (!req.user.id) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      next();
    } catch (err) {
      console.error("Auth error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  },

  requireRole: (role) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: "Access Denied" });
      }
      next();
    };
  },
};
