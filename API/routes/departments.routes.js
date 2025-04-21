const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller.js");
const authController = require("../controllers/auth.controller.js");

router
  .route("/")
  .get(authController.verifyToken, departmentController.findAll)
  .post(authController.verifyToken, departmentController.create);

router
  .route("/:departmentId")
  .get(authController.verifyToken, departmentController.findOneById)
  .delete(authController.verifyToken, departmentController.delete)
  .put(authController.verifyToken, departmentController.edit);

module.exports = router;
