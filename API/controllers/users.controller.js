const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const Department = db.department;

// Reusable attributes
const departmentAttributes = ["id", "title"];

exports.login = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      return res.status(400).json({
        success: false,
        msg: "Must provide an email, and a password.",
      });

    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: ["id", "email", "password", "admin", "id_department"],
    });
    if (!user)
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });

    // Validate password
    let token = false;
    if (user.verifyPassword(req.body.password, user.password)) {
      // sign the given payload (user ID, admin and department id) into a JWT payload – builds JWT token, using secret key
      token = jwt.sign(
        { id: user.id, admin: user.admin, department: user.id_department },
        config.SECRET,
        {
          expiresIn: "24h",
        }
      );
    }
    if (!token)
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });

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
    let user = await User.findOne({
      attributes: ["id", "name", "email", "admin"],
      where: {
        id: req.params.userId,
      },
      include: [{ model: Department, attributes: departmentAttributes }],
    });

    if (!user)
      res.status(404).json({ error: `User Id ${req.params.userId} not found` });

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
    if (req.loggedUser.admin == false)
      return res.status(403).json({ error: "You do not have permission" });

    if (!req.body.name && typeof req.body.name != "string") {
      res
        .status(400)
        .json({ success: false, msg: "Name must be a valid string" });
      return;
    }
    if (!req.body.email && typeof req.body.email != "string") {
      res
        .status(400)
        .json({ success: false, msg: "Email must be a valid string" });
      return;
    }

    if (!req.body.id_department && typeof req.body.id_department != "integer") {
      res
        .status(400)
        .json({ success: false, msg: "id_department must be a valid integer" });
      return;
    }
    // check if id department exists
    const department = await Department.findByPk(req.body.id_department);
    if (!department) {
      return res.status(400).json({
        success: false,
        msg: "id_department must be a valid Department",
      });
    }

    if (!req.body.password && typeof req.body.password != "string") {
      res
        .status(400)
        .json({ success: false, msg: "password must be a valid string" });
      return;
    }

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
    if (req.loggedUser.admin == false || req.loggedUser.id != req.params.userId)
      return res.status(403).json({ error: "You do not have permission" });

    let user = await User.findByPk(req.params.userId);
    if (user == undefined) {
      res.status(404).json({
        sucess: false,
        msg: `User Id ${req.params.userId} not found`,
      });
      return;
    }

    if (req.body.name) user.name = req.body.name;

    if (req.body.email) user.email = req.body.email;

    if (req.body.password)
      user.password = bcrypt.hashSync(req.body.password, 10);

    if (req.body.id_department) {
      const department = await Department.findByPk(req.body.id_department);
      if (!department) {
        return res.status(404).json({
          success: false,
          msg: `Department Id ${req.body.id_department} not found`,
        });
      }
      user.id_department = req.body.id_department;
    }

    await user.save();

    res.status(202).json({
      succes: true,
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
    if (req.loggedUser.admin == false)
      res.status(403).json({ error: "You do not have permission" });

    let user = await User.findByPk(req.params.userId);
    if (user == undefined || user == null) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`,
      });
    }

    User.destroy({
      where: { id: req.params.userId },
    });

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
