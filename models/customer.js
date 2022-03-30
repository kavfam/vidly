const mongoose = require("mongoose");
const Joi = require("joi");
const cl = (...args) => console.log(...args);

// Define Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  phone: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

// 3. Define Model Class
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  // cl("[ValidateCustomer] customer: ", customer);
  // cl("[ValidateCustomer]. customer.length: ", customer.length);
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  const result = schema.validate(customer);
  //cl("[validateCustomer], result: ", result);
  return result;
}

exports.Customer = Customer;
exports.validate = validateCustomer;
