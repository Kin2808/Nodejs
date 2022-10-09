const express = require("express");
const { default: mongoose } = require("mongoose");
const Category = require("../models/category");
const { ObjectId } = require("mongodb");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");
const router = express.Router();

const collectionName = "categories";

//MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/find/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.find().byName(name);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const category = new Category(data);
    await category.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Category.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
//Hiển thị tất cả danh mục (Categories) với số lượng hàng hóa trong mỗi danh mục
router.get("/question/18", async function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: "products",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$categoryId"] },
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
  const aggregate = [
    {
      $match: { _id: ObjectId("63302a817d9c8322088534fa") },
    },
    {
      $lookup: {
        from: "products",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$categoryId"] },
            },
          },
        ],
        as: "products",
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

// GET BY NAME
// router.get("/search/name", async function (req, res) {
//   try {
//     const { text } = req.query;
//     const query = { name: text };
//     const result = await findDocuments(query, collectionName);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

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
