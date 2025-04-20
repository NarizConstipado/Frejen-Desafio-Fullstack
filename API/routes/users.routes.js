const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')
const authController = require('../controllers/auth.controller.js')

router.route('/')
        .get(authController.verifyToken, userController.findAll)
        .post(authController.verifyToken, userController.create)
        
router.route('/:userId')
        .get(authController.verifyToken, userController.findOneById)
        .delete(authController.verifyToken, userController.delete)
        .put(authController.verifyToken, userController.edit)

//export this router
module.exports = router;