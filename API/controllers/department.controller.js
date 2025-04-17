const db = require("../models/index");
const Department = db.department;
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
  try {
    let result;

    if (false) {
      // Needs to be logged in
    } else {
      result = await Department.findAll({ order: [["createdAt"]] });
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while finding departments.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    // if (req.loggedUser.role != "admin")
    //   return res.status(403).json({ error: "You do not have permission" });

    let department = {};
    if (!req.body.title) res.status(400).json({ error: "Title is required" });
    else if (typeof req.body.title != "string")
      res.status(400).json({ error: "name must be a string" });
    else department.title = req.body.title;

    let newDepartment = await Department.create(department);
    res.status(201).json({
      sucess: true,
      msg: `Department created successfully`,
      URL: `/departments/${newDepartment.id}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg:
        err.message || "Some error occurred while creating a new department.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    // if (req.loggedUser.role != "admin")
    //   res.status(403).json({ error: "You do not have permission" });
    let department = await Department.findByPk(req.params.departmentId);
    if (!department)
      res
        .status(404)
        .json({ error: `Department Id ${req.params.departmentId} not found` });

    let updateDepartment = {};
    if (req.body.title && typeof req.body.title != "string")
      res.status(400).json({ error: "title must be a string" });
    else updateDepartment.title = req.body.title;

    await Department.update(updateDepartment, { where: { id: department.id } });
    res
      .status(200)
      .json({ msg: `Department ${department.id} was changed successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while updating department ${req.params.departmentId}.`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    // if (req.loggedUser.role != "admin")
    //   res.status(403).json({ error: "You do not have permission" });
    const department = await Department.findOne({
      where: { id: req.params.departmentId },
    });
    await department.destroy({ where: { id: req.params.departmentId } });
    res.status(200).json({
      msg: `Department ${req.params.departmentId} was successfully deleted!`,
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while deleting department ${req.params.departmentId}.`,
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let department = await Department.findByPk(req.params.departmentId);
    if (!department) {
      res
        .status(404)
        .json({ error: `Department Id ${req.params.departmentId} not found` });
    } else res.status(200).json(department);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while finding department ${req.params.departmentId}.`,
    });
  }
};
