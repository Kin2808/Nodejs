const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
  {
    name: String,
    email: String,
    phoneNumber: String,
    address: String,
  },
  {
    query: {
      byName(name) {
        return this.where({ name: new RegExp(name, "i") });
      },
    },
  }
);

const Supplier = model("Supplier", supplierSchema);
module.exports = Supplier;
