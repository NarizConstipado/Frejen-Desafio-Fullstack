const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const Department = db.department;
const {
  checkAdminPermission,
  notFound,
  badRequest,
  isValid,
} = require("../utilities/validation");

// Reusable attributes
const departmentAttributes = ["id", "title"];

exports.login = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        msg: "Must provide an email, and a password.",
      });
    }

    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: ["id", "email", "password", "admin", "id_department"],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });
    }

    let token = false;
    if (user.verifyPassword(req.body.password, user.password)) {
      token = jwt.sign(
        { id: user.id, admin: user.admin, id_department: user.id_department },
        config.SECRET,
        {
          expiresIn: "24h",
        }
      );
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });
    }

    res.status(200).json({ success: true, accessToken: token });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred at login.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: ["id", "name", "email", "admin"],
      include: [
        {
          model: Department,
          attributes: departmentAttributes,
        },
      ],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId, {
      attributes: ["id", "name", "email", "admin"],
      include: [{ model: Department, attributes: departmentAttributes }],
    });

    notFound(req, res, user, req.params.userId);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (!checkAdminPermission(req, res)) return;

    badRequest(req, res, req.body.name, "name", "string");

    badRequest(req, res, req.body.email, "email", "string");

    badRequest(req, res, req.body.id_department, "id_department", "integer");

    // check if id department exists
    const department = await Department.findByPk(req.body.id_department);
    if (!department) {
      return res.status(400).json({
        success: false,
        msg: "id_department must be a valid Department",
      });
    }

    badRequest(req, res, req.body.password, "password", "string");
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let newUser = await User.create(req.body);
    res.status(201).json({
      sucess: true,
      msg: `User created successfully`,
      URL: `/users/${newUser.id}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    if (
      req.loggedUser.admin == false &&
      req.loggedUser.id != req.params.userId
    ) {
      return res.status(403).json({ error: "You do not have permission" });
    }

    let user = await User.findByPk(req.params.userId);
    notFound(req, res, user, req.params.userId);

    isValid(req, res, req.body?.name, "name", "string");
    if (req.body.name) {
      user.name = req.body.name;
    }

    isValid(req, res, req.body?.email, "email", "string");
    if (req.body.email) {
      user.email = req.body.email;
    }

    isValid(req, res, req.body?.password, "password", "string");
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }

    if (req.body.id_department) {
      const department = await Department.findByPk(req.body.id_department);
      notFound(req, res, department, req.body.id_department);

      user.id_department = req.body.id_department;
    }

    await user.save();

    res.status(202).json({
      success: true,
      msg: `User ${user.id} updated successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!checkAdminPermission(req, res)) return;

    let user = await User.findByPk(req.params.userId);
    notFound(req, res, user, req.params.userId);

    await user.destroy();

    res.status(200).json({
      sucess: true,
      msg: `User ${req.params.userId} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while deleting a user.",
    });
  }
};
