const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const config = require("../config/config.js");

exports.verifyToken = (req, res, next) => {
  // search token in headers most commonly used for authorization
  const header = req.headers["x-access-token"] || req.headers.authorization;
  if (typeof header == "undefined")
    return res.status(401).json({ success: false, msg: "No token provided!" });
  try {
    let decoded = jwt.verify(header, config.SECRET);
    req.loggedUser = { id: decoded.id, admin: decoded.admin }; // save user ID and role into request object
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Failed to authenticate token." });
  }
};

exports.autheticationNotNeeded = (req, res, next) => {
  try {
    const header = req.headers["x-access-token"] || req.headers.authorization;
    if (!!header) {
      let decoded = jwt.verify(header, config.SECRET);
      req.loggedUser = { id: decoded.id, admin: decoded.admin }; // save user ID and role into request object
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Failed to authenticate token." });
  }
};
