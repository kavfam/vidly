const winston = require("winston");

module.exports = function (err, req, res, next) {
  // log the exception
  winston.error(err.message, err);
  // error, warn, info, verbose, debug, silly
  res.status(500).send("That wasnt supposed to happen!");
};
