const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller.js')
const authController = require('../controllers/auth.controller.js')

router.route('/')
        .get(userController.findAll)
        .post(userController.create)

router.route('/login')
        .post(userController.login)

// meter departamento no token
// authController.verifyToken, 
        
router.route('/:userId')
        .get(userController.findOneById)
//         .delete(userController.delete)
        .put(userController.edit)

//export this router
module.exports = router;