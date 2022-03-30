// const jwt = require("jsonwebtoken");
// const config = require("config");

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access forbidden!");
  // 401 unauthorized (invalid jwt), 403 forbidden (not allowed to access this resource even if a valid login)
  // otherwise, pass control to next middleware function
  next();
};
