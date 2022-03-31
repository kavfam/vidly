const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
require("dotenv").config();

module.exports = function () {
  let db = config.get("db"); // use for local
  // cloud requires server credentials (.env)
  const envN = process.env.NODE_ENV;
  if (envN === "production") {
    const db_usr = process.env.db_usr;
    const db_key = process.env.db_key;
    db =
      "mongodb+srv://" +
      db_usr +
      ":" +
      db_key +
      "@cluster0.57qzj.mongodb.net/vidly?retryWrites=true&w=majority";
    console.log("db: ", db);
  }

  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => winston.info(`Connected to Mongodb: ${db} ...`));
};
