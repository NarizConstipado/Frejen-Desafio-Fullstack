const db = require("../models/index.js");
const Ticket = db.ticket;
const User = db.user;
const Department = db.department;
const State = db.state;
const { Op } = require("sequelize");

// tem que ter filtro no findByUser, pelo estado e texto

exports.findAll = async (req, res) => {
  try {
    let tickets = await Ticket.findAll({
      include: [Department, State, User],
    });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while finding all tickets.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.loggedUser.role != "admin")
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
        .json({ success: false, msg: "Department must be a valid integer" });
      return;
    }

    if (!req.body.password && typeof req.body.password != "string") {
      res
        .status(400)
        .json({ success: false, msg: "Password must be a valid string" });
      return;
    }

    // Find all departments, check if value is valid
    const department = await Department.findByPk(req.body.id_department);

    if (!department) {
      return res
        .status(400)
        .json({ success: false, msg: "Department not found" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let newUser = await User.create(req.body);
    res.status(201).json({
      sucess: true,
      msg: `User created successfully`,
      URL: `/users/${newUser.id}`,
    });
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      res.status(409).json({
        success: false,
        msg: `${err.errors[0].path} already exist`,
      });
    } else {
      res.status(500).json({
        success: false,
        msg: err.message || "Some error occurred while creating a new user.",
      });
    }
  }
};

exports.edit = async (req, res) => {
  try {
    // if (req.loggedUser.role != "admin")
    //   return res.status(403).json({ error: "You do not have permission" });

    // if (req.loggedUser.id == req.params.userId) {
    //   res.status(401).json({
    //     succes: false,
    //     msg: `You are not allowed to update this user`,
    //   });
    // }

    let user = await User.findByPk(req.params.userId);
    if (user == undefined) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`,
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
        return res
          .status(400)
          .json({ success: false, msg: "Department not found" });
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

exports.findOneById = async (req, res) => {
  try {
    let user = await User.findOne({
      attributes: ["id", "name", "email", "admin"],
      where: {
        id: req.params.userId,
      },
      include: [{ model: Department }],
    });

    if (!user) {
      res.status(404).json({ error: `User Id ${req.params.userId} not found` });
    } else res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.userId);

    if (user == undefined || user == null) {
      res.status(404).json({
        sucess: false,
        msg: `User not found`,
      });
    } else {
      if (req.loggedUser.role == "admin") {
        User.destroy({
          where: { id: req.params.userId },
        });

        res.status(200).json({
          sucess: true,
          msg: `User ${user.username} deleted successfully`,
        });
      } else {
        res.status(403).json({
          success: false,
          msg: `You do not have permission to delete this user.`,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new user.",
    });
  }
};
