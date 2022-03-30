//jshint esversion:6
//const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cl = (...args) => console.log(...args);

// 1. connection set in index.js, then set schema / model in models.genres.js

// get all genres
router.get("/", async (req, res) => {
  //throw new Error("Could not get the genres");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// create new genre
router.post("/", auth, async (req, res) => {
  //cl("[Post] req.body: ", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

// Update a genre
router.put("/:id", [auth, validateObjectId], async (req, res) => {
  //validate before update
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //cl("[.put after validate] req.body.name: ", req.body.name);
  //cl("[.put after validate] req.body.name.length: ", req.body.name);

  //update first approach - note 3rd param is to get updated obj from db
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // look up genre and if it doesnt exist then 404
  if (!genre) return res.status(404).send("Requested : genre was not found!");
  res.send(genre);
});

// DELETE a genre
router.delete("/:id", [auth, admin], async (req, res) => {
  //update first approach
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // look up genre and if it doesnt exist then 404
  if (!genre) return res.status(404).send("Requested : genre was not found!");

  res.send(genre);
});

// get single genre
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  return !genre
    ? res.status(404).send("Requested : genre was not found!")
    : res.send(genre);
});

// export this module
module.exports = router;
