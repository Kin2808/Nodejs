const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customerSchema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  address: String,
  email: String,
  birthday: Date,
});

const Customer = model("Customer", customerSchema);
module.exports = Customer;
