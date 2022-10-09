const express = require("express");
const { default: mongoose } = require("mongoose");
const Customer = require("../models/customer");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");
const router = express.Router();

const collectionName = "customers";

//MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const customer = new Customer(data);
    await customer.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Customer.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
//Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu
router.get("/question/4", async function (req, res) {
  const query = { address: { $regex: "quận Hải Châu" } };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các khách hàng có năm sinh 1990
router.get("/question/5", async function (req, res) {
  const query = {
    birthday: {
      $gte: new Date("1990"),
      $lt: new Date("1991"),
    },
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Hiển thị tất cả các khách hàng có sinh nhật là hôm nay
router.get("/question/6", async function (req, res) {
  const aggregate = [
    {
      $match: {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: new Date() }],
            },
            { $eq: [{ $month: "$birthday" }, { $month: new Date() }] },
          ],
        },
      },
    },
  ];
  try {
    const result = await findDocuments(
      { aggregate: aggregate },
      collectionName
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// --------------END-------------- //

//GET ALL
router.get("/", async function (req, res) {
  try {
    const result = await findDocuments({}, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ID
router.get("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await findDocument(id, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//POST
router.post("/", async function (req, res) {
  try {
    const data = req.body;
    const result = await insertDocument(data, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id, collectionName);
    res.status(200).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await updateDocument(id, data, collectionName);
    res.status(200).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
