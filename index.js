const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/categories");
const customersRoute = require("./routes/customers");
const employeesRoute = require("./routes/employees");
const ordersRoute = require("./routes/orders");
const suppliersRoute = require("./routes/suppliers");

const uploadRoute = require("./routes/upload");

const DATABASE_NAME = "shop";
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/" + DATABASE_NAME;

MongoClient.connect(CONNECTION_STRING).then(() => {
  console.log("DB is running");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/products", productsRoute);
app.use("/categories", categoriesRoute);
app.use("/customers", customersRoute);
app.use("/employees", employeesRoute);
app.use("/orders", ordersRoute);
app.use("/suppliers", suppliersRoute);

app.use("/upload", uploadRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ error: err.message });
});

module.exports = app;
