const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cl = (...args) => console.log(...args);

Fawn.init("mongodb://127.0.0.1:27017/vidly");
// Fawn.init(mongoose);  // fails

// routes
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  //cl("[POST] req.body", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");
  //cl("Found Customer id: ", req.body.customerId);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");
  //cl("Found Movie id: ", req.body.movieId);
  //cl("Movies in Stock: ", movie.numberInStock);

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Transaction failed.");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  return !rental
    ? res.status(404).send("The rental with the given ID was not found.")
    : res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  //cl("[DELETE] rental", rental);
  //cl("DELETE] rental.movie._id", rental.movie._id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  // need to get movie id to update number in stock and can use rental.movie._id for this below

  try {
    new Fawn.Task()
      .update(
        "movies",
        { _id: rental.movie._id },
        {
          $inc: { numberInStock: 1 },
        }
      )
      .run();

    res.send(rental);

    // cl("[DELETE] try success!");
  } catch (ex) {
    res.status(500).send("Transaction failed.");
  }
});

module.exports = router;
