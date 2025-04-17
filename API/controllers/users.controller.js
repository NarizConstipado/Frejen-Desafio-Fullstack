const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config");
const db = require("../models/index.js");
const User = db.user;
const Department = db.department;
const { Op } = require("sequelize");

exports.login = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      return res.status(400).json({
        success: false,
        msg: "Must provide an email, and a password.",
      });

    const token = await User.findOne({
      where: { email: req.body.email },
    }).then((user) => {
      if (user.verifyPassword(req.body.password, user.password)) {
        return jwt.sign(
          { id: user.id, admin: user.admin, department: user.id_department },
          config.SECRET,
          {
            expiresIn: "24h", // 24 hours
          }
        );
      }
      return false;
    });

    if (!token)
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });
    // sign the given payload (user ID, admin and department) into a JWT payload – builds JWT token, using secret key
    res.status(200).json({ success: true, accessToken: token });
  } catch (err) {
    if (err instanceof ValidationError)
      res
        .status(400)
        .json({ success: false, msg: err.errors.map((e) => e.message) });
    else
      res.status(500).json({
        success: false,
        msg: err.message || "Some error occurred at login.",
      });
  }
};

exports.create = async (req, res) => {
  try {
    // if (req.loggedUser.role != "admin")
    //   return res.status(403).json({ error: "You do not have permission" });

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

exports.findAll = async (req, res) => {
  try {
    let users = await User.findAll({
      attributes: ["id", "name", "email", "admin"],
      include: [
        {
          model: Department,
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

// exports.delete = async (req, res, next) => {
//   try {
//     let user = await User.findByPk(req.params.userId)

//     if (user == undefined || user == null) {
//       res.status(404).json({
//         sucess: false,
//         msg: `User not found`
//       })
//     } else {

//       if (req.loggedUser.role == 'admin') {

//         User.destroy({
//           where: { id: req.params.userId }
//         })

//         res.status(200).json({
//           sucess: true,
//           msg: `User ${user.username} deleted successfully`
//         })
//         next()

//       } else {
//         res.status(403).json({
//           success: false,
//           msg: `You do not have permission to delete this user.`
//         })
//       }

//     }

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       msg: err.message || 'Some error occurred while creating a new user.'
//     })
//   }
// }

// exports.edit = async (req, res, next) => {
//   try {
//     let user = await User.findByPk(req.params.userId)
//     if (user == undefined) {
//       res.status(404).json({
//         sucess: false,
//         msg: `User not found`
//       })
//     } else {

//       if (req.loggedUser.id == req.params.userId) {
//         if (req.body.username && typeof req.body.username != "string") { res.status(400).json(messages.errorBadRequest(0, "username", "string")); return }
//         else if (req.body.username) {
//           if (await User.findOne({ where: { username: req.body.username } })) {
//             res.status(400).json({ success: false, message: `Username already in use.` });
//           } else user.username = req.body.username
//         } else user.username = user.username

//         if (req.body.email && typeof req.body.email != "string") { res.status(400).json(messages.errorBadRequest(0, "email", "string")); return }
//         else if (req.body.email) {
//           if (await User.findOne({ where: { email: req.body.email } })) {
//             res.status(400).json({ success: false, message: `Email already in use.` });
//           } else user.email = req.body.email
//         } else user.email = user.email

//         if (req.body.password && typeof req.body.password != "string") { res.status(400).json(messages.errorBadRequest(0, "password", "string")); return }
//         else if (req.body.password) { user.password = bcrypt.hashSync(req.body.password, 10) }
//         else user.password = user.password

//         if (req.body.schoolId && !School.findOne({ where: { id: req.body.schoolId } })) { res.status(400).json(messages.errorBadRequest(2, "schoolId")); return }
//         else if (req.body.schoolId) {
//           user.schoolId = req.body.schoolId
//         } else { user.schoolId = user.schoolId }

//         if ((req.body.contact && typeof req.body.contact != "number")) { res.status(400).json(messages.errorBadRequest(0, "contact", "number")); return }
//         if (req.body.contact) {
//           if (await User.findOne({ where: { contact: req.body.contact } })) {
//             res.status(400).json({ success: false, message: `Phone Number already in use.` }); return
//           } else user.contact = req.body.contact
//         } else user.contact = user.contact

//         if ((req.body.genreDesc && typeof req.body.genreDesc != "string")) { res.status(400).json(messages.errorBadRequest(0, "genreDesc", "string")); return }
//         if (req.body.genreDesc) {
//           if (req.body.genreDesc != "M" && req.body.genreDesc != "F" && req.body.genreDesc != "OTHER") res.status(400).json(messages.errorBadRequest(0, "genreDesc", "M, F or Other"))
//           else user.genreDesc = req.body.genreDesc;
//         } else user.genreDesc = user.genreDesc

//         if ((req.body.birthDate && typeof req.body.birthDate != "string")) { res.status(400).json(messages.errorBadRequest(0, "birthDate", "string")); return }
//         if (req.body.birthDate) {
//           if (validation.validationDates(req.body.birthDate)) { res.status(400).json(messages.errorBadRequest(0, "birthday", "instace of Date")); return }
//         } else user.birthDate = user.birthDate

//         await User.update(
//           {
//             username: user.username,
//             email: user.email,
//             password: user.password,
//             schoolId: user.schoolId,
//             contact: user.contact,
//             genreDesc: user.genreDesc,
//             birthDate: user.birthDate
//           },
//           {
//             where: { id: req.params.userId }
//           }
//         )

//         res.status(202).json({
//           succes: true,
//           msg: `User ${user.username} updated successfully`
//         })
//         next()

//       } else {
//         res.status(401).json({
//           succes: false,
//           msg: `You are not allowed to update this user`
//         })

//       }
//     }

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       msg: err.message || 'Some error occurred while creating a new user.'
//     })
//   }
// }
