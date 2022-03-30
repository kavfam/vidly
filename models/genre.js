const Joi = require("joi");
const mongoose = require("mongoose");
const cl = (...args) => console.log(...args);

// 2. Define Schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20,
  },
});

// 3. Define Model Class
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  //cl("[ValidateGenre] genre: ", genre);
  // cl("In ValidateGenre. genre.length: ", genre.length);
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  //  const result = schema.validate({ name: genre });
  const result = schema.validate(genre);
  //cl("[ValidateGenre] result: ", result);
  return result;
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
