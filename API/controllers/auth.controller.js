const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

exports.verifyToken = (req, res, next) => {
  // search token in headers most commonly used for authorization
  const header = req.headers["x-access-token"] || req.headers.authorization;
  if (typeof header == "undefined")
    return res.status(401).json({ success: false, msg: "No token provided!" });
  try {
    let decoded = jwt.verify(header, config.SECRET);
    req.loggedUser = {
      id: decoded.id,
      admin: decoded.admin,
      id_department: decoded.id_department,
    }; // save user ID, admin status and user's department ID into request object
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: err.message || "Failed to authenticate token.",
    });
  }
};
