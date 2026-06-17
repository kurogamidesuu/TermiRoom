const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = { _id: decoded.userId, username: decoded.username };
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session expired. Please log in again." });
    }
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;
