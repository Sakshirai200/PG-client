const jwt = require("jsonwebtoken");

// VERIFY USER (Logged in or not)
exports.verifyUser = (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ONLY OWNER
exports.isOwner = (req, res, next) => {
    if (req.user.role !== "owner") {
        return res.status(403).json({ message: "Access denied: Owners only" });
    }
    next();
};

// ONLY ADMIN
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
};