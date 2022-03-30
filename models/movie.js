const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

function validateMovie(movie) {
  // note schema uses genreId NOT genre which is a complex object
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movie);
}

// function validateGenre(genre) {
//   // cl("In ValidateGenre. genre: ", genre);
//   // cl("In ValidateGenre. genre.length: ", genre.length);
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//   });
//   return schema.validate({ name: genre });
// }

exports.Movie = Movie;
exports.validate = validateMovie;
