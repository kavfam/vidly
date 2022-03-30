const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  //cl("[POST] req.body", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");
  //cl("[POST] genre", genre);

  // below using a specific object for genre rather than genre found above, as the above could have MANY items and we only need two here
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  return !movie
    ? res.status(404).send("The movie with the given ID was not found.")
    : res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  return !movie
    ? res.status(404).send("The movie with the given ID was not found.")
    : res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  return !movie
    ? res.status(404).send("The movie with the given ID was not found.")
    : res.send(movie);
});

module.exports = router;
