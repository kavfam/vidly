// index.js for vidly app
cl = (...args) => console.log(...args);

// dependencies
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
// could write code here to load production only if in production environment.
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`listening on port ${port}`)
);

module.exports = server;
