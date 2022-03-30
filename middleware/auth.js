const jwt = require("jsonwebtoken");
const config = require("config");

// you could create a named function and at end use module.exports = auth, or just module.exports the unnamed function as below
//function auth(req, res, next) {
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  // if no token, exit
  if (!token) return res.status(401).send("Access denied. No token provided");
  // if a token exists, check it is valid. If not send error. If it is pass control to next() as this is middleware.
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};

//module.exports = auth;
