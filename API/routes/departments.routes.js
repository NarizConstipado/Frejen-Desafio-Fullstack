const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller.js')
const authController = require('../controllers/auth.controller.js')

// authController.verifyToken, 

router.route('/')
        .get(departmentController.findAll)
        .post(departmentController.create)
        
router.route('/:departmentId')
        .get(departmentController.findOneById)
        .delete(departmentController.delete)
        .put(departmentController.edit)

//export this router
module.exports = router;