const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found, authentication failed" });
    }

    try {
      jwt.verify(token, config.JWT_SECRET, (error, decodedToken) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            return res
              .status(401)
              .json({ error: "Token expired, authentication failed" });
          } else {
            return res
              .status(401)
              .json({ error: "Token invalid, authentication failed" });
          }
        }

        req.userId = decodedToken.id;
        next();
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  },
};

module.exports = authMiddleware;
