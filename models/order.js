const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    shippedDate: Date,
    status: String,
    description: String,
    shippingAddress: String,
    paymentType: String,
    customerId: { type: Schema.Types.ObjectId },
    employeeId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: "createdDate", updatedAt: false } }
);

const Order = model("Order", orderSchema);
module.exports = Order;
