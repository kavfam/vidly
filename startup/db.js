const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
//console.log("db.js");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => winston.info(`Connected to Mongodb: ${db} ...`));
  //  const db = mongoose.connection; //get the default connecton
};

//mongoose.connect("mongodb://127.0.0.1:27017/testDB");
// Fawn.init(mongoose);  // this line fails
// Fawn.init(mongoDB);   // this line fails
// Fawn.init("mongodb://localhost/" + myDB); // fails
//Fawn.init("mongodb://localhost/vidly"); // fails
//Fawn.init("mongodb://localhost:27017/" + myDB); // fails
//Fawn.init("mongodb://127.0.0.1:27017/" + myDB); // fails
//Fawn.init("mongodb://127.0.0.1:27017/vidly"); // fails

// app has methods get, post, put, delete
// these are in routes folder
