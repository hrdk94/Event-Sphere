const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).send("No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).send("Invalid Token");
    }
  },

  requireRole: (role) => {
    return (req, res, next) => {
      if (req.user.role !== role)
        return res.status(403).send("Access Denied");
      next();
    };
  }
};
