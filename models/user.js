//user.js
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const cl = (...args) => console.log(...args);

// Define Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  isAdmin: Boolean,
});

// added this after generating jason web token in Auth,js and duplicating code in users.js then realising the Authentication really belongs in user model. So adding method to user model here. Needs to come BEFORE creating model!
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  // cl("[user.js] token: ", token);
  return token;
};

// 3. Define Model Class
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  //cl("[ValidateUser] user: ", user);
  //cl("[ValidateUser]. user.length: ", user.length);
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  const result = schema.validate(user);
  //cl("[validateUser], result: ", result);
  return result;
}

exports.User = User;
exports.validate = validateUser;
