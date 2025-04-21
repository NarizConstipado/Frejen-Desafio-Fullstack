const db = require("../models/index");
const Department = db.department;
const {
  checkAdminPermission,
  notFound,
  badRequest,
} = require("../utilities/validation");

exports.findAll = async (req, res) => {
  try {
    let result = await Department.findAll();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while finding departments.",
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let department = await Department.findByPk(req.params.departmentId);
    notFound(req, res, department, req.params.departmentId);
    res.status(200).json(department);
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

exports.create = async (req, res) => {
  try {
    if (!checkAdminPermission(req, res)) return;

    if (!req.body.title) {
      res.status(400).json({ error: "title is required" });
    } else if (typeof req.body.title != "string") {
      return res.status(400).json({ error: "title must be a string" });
    }

    let newDepartment = await Department.create(req.body);
    res.status(201).json({
      sucess: true,
      msg: `Department created successfully`,
      URL: `/departments/${newDepartment.id}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      sucess: false,
      msg:
        err.message || "Some error occurred while creating a new department.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    if (!checkAdminPermission(req, res)) return;

    let department = await Department.findByPk(req.params.departmentId);
    notFound(req, res, department, req.params.departmentId);

    isValid(req, res, req.body?.title, "title", "string");

    await Department.update(req.body, { where: { id: department.id } });
    res
      .status(200)
      .json({ msg: `Department ${department.id} updated successfully` });
  } catch (err) {
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
    if (!checkAdminPermission(req, res)) return;

    const department = await Department.findByPk(req.params.departmentId);
    notFound(req, res, department, req.params.departmentId);

    await department.destroy({ where: { id: req.params.departmentId } });
    res.status(200).json({
      msg: `Department ${req.params.departmentId} deleted successfully`,
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
