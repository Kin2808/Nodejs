const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");

const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/categories");
const customersRoute = require("./routes/customers");
const employeesRoute = require("./routes/employees");
const ordersRoute = require("./routes/orders");
const suppliersRoute = require("./routes/suppliers");

const DATABASE_NAME = "shop";
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/" + DATABASE_NAME;

MongoClient.connect(CONNECTION_STRING).then(() => {
  console.log("DB is running");
});

app.use(cors());
app.use(express.json());

app.use("/products", productsRoute);
app.use("/categories", categoriesRoute);
app.use("/customers", customersRoute);
app.use("/employees", employeesRoute);
app.use("/orders", ordersRoute);
app.use("/suppliers", suppliersRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
