const config = require("config");
//console.log("config.js");
module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  }
};
