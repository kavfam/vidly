//jshint esversion:6
const { Customer, validate } = require("../models/customer");

const mongoose = require("mongoose");
const express = require("express");
//const { boolean } = require("joi");
const router = express.Router();
const cl = (...args) => console.log(...args);

// 1. connection set in index.js, and  schema and model are set in  customers.js file in models

// get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// create new customer
router.post("/", async (req, res) => {
  //cl("[post] req.body", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);

  // no try/catch!!
});

// Update a customer
router.put("/:id", async (req, res) => {
  //validate before update
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // cl("[PUT] after validate req.body.name: ", req.body.name);
  // cl("[PUT] after validate req.body.name.length: ", req.body.name);

  //update first approach - note 3rd param is to get updated obj from db
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );

  // look up customer and if it doesnt exist then 404
  if (!customer)
    return res.status(404).send("Requested : customer was not found!");
  res.send(customer);
});

// DELETE a customer
router.delete("/:id", async (req, res) => {
  //update first approach
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // look up customer and if it doesnt exist then 404
  if (!customer)
    return res.status(404).send("Requested : customer was not found!");

  res.send(customer);
});

// get single customer
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return;
  res.status(404).send("Requested : customer was not found!");
  res.send(customer);
});

// export this module
module.exports = router;
