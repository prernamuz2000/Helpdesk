const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { printRed } = require("../utils/chalkUtils");

const tokenSecret = process.env.JWT_SECRET || "my-jwt-secret";
const tokenIssuer = process.env.JWT_ISSUER || "your-issuer"; // Ensure you set this correctly

const authMiddleware = (requiredRole) => {
  if(requiredRole)
  {
    console.log('required role',requiredRole);
  }
  
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Token is missing or malformed" ,
            middlewareError:true
          });
      }

      const token = authorization.substring("Bearer ".length);
      if(token)
      {
        printRed(`Getting token inside middleware`);
      }else{
        printRed(`Token inside middleware is empty`);
      }
      
      
      let decoded;

      try {
        decoded = jwt.verify(token, tokenSecret);
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ message: `Unauthorized: ${err.message}` ,middlewareError: true });
        } else if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token has expired" ,middlewareError: true});
        } else {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token",middlewareError: true });
        }
      }

      const { exp, iss, empid, role, empname } = decoded;

      if (iss !== tokenIssuer || exp < Date.now() / 1000) {
        return res
          .status(403)
          .json({ message: "Forbidden: Token is invalid or expired",middlewareError: true });
      }

      const user = await User.findOne({ empid });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (requiredRole && user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: `Forbidden: ${requiredRole} access required`,middlewareError: true });
      }

      if (user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Role mismatch",middlewareError: true });
      }

      if (user.empname !== empname) {
        return res.status(403).json({ message: "Forbidden: Empname mismatch",middlewareError: true });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = authMiddleware;
