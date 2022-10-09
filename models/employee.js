const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const employeeSchema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  address: String,
  email: String,
  birthday: Date,
});

const Employee = model("Employee", employeeSchema);
module.exports = Employee;
