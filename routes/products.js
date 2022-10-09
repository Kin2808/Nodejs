const express = require("express");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");
const router = express.Router();

const collectionName = "products";

const lookupCategory = {
  $lookup: {
    from: "categories",
    localField: "categoryId",
    foreignField: "_id",
    as: "category",
  },
};

const lookupSupplier = {
  $lookup: {
    from: "suppliers",
    localField: "supplierId",
    foreignField: "_id",
    as: "supply",
  },
};

// MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/find/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.find().byName(name);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const product = new Product(data);
    await product.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Product.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
// Hiển thị tất cả các mặt hàng có giảm giá <= 10%
router.get("/question/1", async function (req, res) {
  const query = { discount: { $lte: 10 } };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});

// Hiển thị tất cả các mặt hàng có tồn kho <= 5
router.get("/question/2", async function (req, res) {
  const query = { stock: { $lte: 5 } };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});

// Hiển thị tất cả các mặt hàng có Giá bán sau khi đã giảm giá <= 100.000
router.get("/question/3", async function (req, res) {
  const s = { $subtract: [100, "$discount"] };
  const m = { $multiply: [s, "$price"] };
  const d = { $divide: [m, 100] };

  const aggregate = [
    {
      $match: {
        $expr: {
          $lte: [d, 100000],
        },
      },
    },
    lookupCategory,
    lookupSupplier,
    {
      $addFields: {
        discountedPrice: d,
        category: { $first: "$category" },
        supply: { $first: "$supply" },
      },
    },
  ];

  try {
    const result = await findDocuments({ aggregate }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------------END-------------- //

//GET ALL
//Hiển thị tất cả các mặt hàng cùng với thông tin chi tiết của Category và Supplier
router.get("/", async function (req, res) {
  const aggregate = [lookupCategory, lookupSupplier];
  try {
    const result = await findDocuments({ aggregate }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET ID
router.get("/search/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const result = await findDocument(id, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET NAME
// router.get("/search/name", async function (req, res) {
//   try {
//     const { text } = req.query;
//     const query = { name: new RegExp(`${text}`) };
//     const result = await findDocuments({ query: query }, collectionName);
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
