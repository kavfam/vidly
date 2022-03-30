//users.js
//jshint esversion:6
// const config = require("config");
// const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
//const { boolean } = require("joi");
const router = express.Router();

// 1. connection set in index.js, and  schema and model are set in  users.js file in models

// get single user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return !user
    ? res.status(404).send("Requested : user was not found!")
    : res.send(user);
});

// get all users
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

// create new user
router.post("/", async (req, res) => {
  //cl("[post] req.body", req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //cl("[post] after validate ...");
  // make sure user not already registered
  let user = await User.findOne({ email: req.body.email });
  //cl("[post] after findOne ...");
  if (user) return res.status(400).send("User already registered");
  //cl("[post] checked if use already registered ...");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();

  // was generating token here but duplicated this is auth.js then realised the token generation is really a method of the user model so moved code there.
  //const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

// Update a user
router.put("/:id", async (req, res) => {
  //validate before update
  const { error } = validate(req.body);
  if (error) return res.status(400).send(e11rror.details[0].message);

  // cl("[PUT] after validate req.body.name: ", req.body.name);
  // cl("[PUT] after validate req.body.name.length: ", req.body.name);

  //update first approach - note 3rd param is to get updated obj from db
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email, password: req.body.password },
    { new: true }
  );

  // look up user and if it doesnt exist then 404
  if (!user) return res.status(404).send("Requested : user was not found!");
  res.send(user.name, user.email, user.password);
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  //update first approach
  const user = await User.findByIdAndRemove(req.params.id);

  // look up user and if it doesnt exist then 404
  if (!user) return res.status(404).send("Requested : user was not found!");

  res.send(user);
});

// export this module
module.exports = router;
