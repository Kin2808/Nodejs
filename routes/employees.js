const express = require("express");
const { default: mongoose } = require("mongoose");
const Employee = require("../models/employee");
const {
  findDocuments,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
} = require("../helpers/MongoDbHelper");
const router = express.Router();

const collectionName = "employees";

//MONGOOSE
mongoose.connect("mongodb://localhost:27017/shop");

router.get("/mongoose", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/mongoose", async (req, res) => {
  try {
    const data = req.body;
    const employee = new Employee(data);
    await employee.save();
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/mongoose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await Employee.findByIdAndUpdate(id, data);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------EXERCISE-------------- //
//Hiển thị tất cả các nhân viên có sinh nhật là hôm nay
router.get("/question/14", async function (req, res) {
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
