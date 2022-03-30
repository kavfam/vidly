const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  // make sure user not already exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password!");

  // compare password entered with that saved in docs
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password!");
  // if reaches here, its valid!

  // here, had following code to get jwt token, but this code is duplicated and not only that, it doesnt belong here, but generating an Auth token really belongs in User model, so created there and that new method is called here.
  // // get up a jwt token. 2nd param is confidential ad should be in env var
  // //res.send(true);
  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  // res.send(token);

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  const result = schema.validate(req);
  //cl("[validate], result: ", result);
  return result;
}

// export this module
module.exports = router;
