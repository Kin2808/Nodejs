const express = require("express");
const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
var moment = require("moment");
const { ObjectId } = require("mongodb");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");
const router = express.Router();

const collectionName = "orders";

const lookupCategory = {
  $lookup: {
    from: "categories",
    localField: "products.categoryId",
    foreignField: "_id",
    as: "products.category",
  },
};

const lookupSupplier = {
  $lookup: {
    from: "suppliers",
    localField: "products.supplierId",
    foreignField: "_id",
    as: "products.supplier",
  },
};

//MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const order = new Order(data);
    await order.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Order.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
//Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED
router.get("/question/7", async function (req, res) {
  const query = { status: "completed" };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay
router.get("/question/8", async function (req, res) {
  const today = moment();
  const query = {
    $and: [
      {
        status: "completed",
      },
      {
        createdDate: new Date(today.format("YYYY-MM-DD")),
      },
    ],
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED
router.get("/question/9", async function (req, res) {
  const query = { status: "canceled" };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
router.get("/question/10", async function (req, res) {
  const today = moment();
  const query = {
    $and: [
      {
        status: "canceled",
      },
      {
        createdDate: new Date(today.format("YYYY-MM-DD")),
      },
    ],
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH
router.get("/question/11", async function (req, res) {
  const query = {
    paymentType: "cash",
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREDIT CARD
router.get("/question/12", async function (req, res) {
  const query = {
    paymentType: "creditcard",
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng có địa chỉ giao hàng là Hà Nội
router.get("/question/13", async function (req, res) {
  const query = {
    shippingAddress: { $regex: "Hà Nội" },
  };
  try {
    const result = await findDocuments({ query: query }, collectionName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Hiển thị tất cả các đơn hàng cùng với thông tin chi tiết khách hàng (Customer)
router.get("/question/16", async function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
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

//Hiển thị tất cả các mặt hàng được bán trong khoảng từ ngày, đến ngày
router.get("/question/20", async function (req, res) {
  const eqDay = {
    $eq: [{ $dayOfMonth: "$createdDate" }, { $dayOfMonth: new Date() }],
  };
  const eqMonth = { $eq: [{ $month: "$createdDate" }, { $month: new Date() }] };
  const aggregate = [
    {
      $match: {
        $expr: {
          $and: [eqDay, eqMonth],
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.productId",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: { _id: 0, products: 1, createdDate: 1 },
    },
    // {
    //   $group: {
    //     _id: "$_id",
    //     createdDate: { $first: "$createdDate" },
    //     products: {
    //       $push: {
    //         product: {
    //           _id: "$products._id",
    //           name: "$products.name",
    //           price: "$products.price",
    //         },
    //         quantity: {
    //           $getField: {
    //             field: 'quantity',
    //             input: {
    //               $first: {
    //                 $filter: {
    //                   input: '$orderDetails',
    //                   as: 'od',
    //                   cond: { $eq: ['$$od.productId', '$products._id'] },
    //                 }
    //               }
    //             }
    //           }
    //         },
    //       },
    //     },
    //   },
    // },
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
router.get("/", async function (req, res) {
  const aggregate = [
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.productId",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "products.categoryId",
        foreignField: "_id",
        as: "products.category",
      },
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "products.supplierId",
        foreignField: "_id",
        as: "products.supplier",
      },
    },
    {
      $group: {
        _id: "$_id",
        code: { $first: "$code" },
        createdDate: { $first: "$createdDate" },
        products: {
          $push: {
            product: {
              _id: "$products._id",
              name: "$products.name",
              price: "$products.price",
              category: { $first: "$products.category" },
              supplier: { $first: "$products.supplier" },
            },
            quantity: {
              $getField: {
                field: "quantity",
                input: {
                  $first: {
                    $filter: {
                      input: "$orderDetails",
                      as: "od",
                      cond: { $eq: ["$$od.productId", "$products._id"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ];
  // const aggregate = [
  //   {
  //     $lookup: {
  //       from: "customers",
  //       localField: "customerId",
  //       foreignField: "_id",
  //       as: "customer",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "employees",
  //       localField: "employeeId",
  //       foreignField: "_id",
  //       as: "employee",
  //     },
  //   },
  // ];
  try {
    const result = await findDocuments({ aggregate }, collectionName);
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
