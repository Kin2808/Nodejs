const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Supplier = require("../models/supplier");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");

const collectionName = "suppliers";

//MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/find/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const supplier = await Supplier.find().byName(name);
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const supplier = new Supplier(data);
    await supplier.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Supplier.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Supplier.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
//Hiển thị tất cả các nhà cung cấp có tên là: (SONY, SAMSUNG, TOSHIBA, APPLE)
router.get("/question/15", async function (req, res) {
  const aggregate = [
    {
      $match: {
        name: { $in: ["Sony", "Samsung", "Apple", "Toshiba"] },
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
    res.status(500).json(error);
  }
});

//Hiển thị tất cả nhà cung cấp (Suppliers) với số lượng hàng hóa mỗi nhà cung cấp
router.get("/question/19", async function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: "products",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$supplierId"] },
            },
          },
        ],
        as: "products",
      },
    },
    {
      $addFields: { numberOfProducts: { $size: "$products" } },
    },
  ];
  try {
    const result = await findDocuments({ aggregate }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
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

//GET BY NAME
router.get("/search/name", async function (req, res) {
  try {
    const { text } = req.query;
    const query = { name: new RegExp(`${text}`) };
    const result = await findDocuments(query, collectionName);
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
