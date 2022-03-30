const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
//console.log("logging.js");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true,
      prettyPrint: true,
    })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  new winston.transports.File({ filename: "error.log", level: "error" });
  //new winston.transports.File({ filename: "combined.log" });

  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/vidly",
      level: "info",
      useUnifiedTopology: true,
    })
  );

  //cl("NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
        prettyPrint: true,
      })
    );
  }
};
