const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    discount: Number,
    stock: Number,
    categoryId: { type: Schema.Types.ObjectId },
    supplierId: { type: Schema.Types.ObjectId },
    description: String,
  },
  {
    // QUERY
    query: {
      byName(name) {
        return this.where({ name: new RegExp(name, "i") });
      },
    },
  }
);

const Product = model("Product", productSchema);
module.exports = Product;
