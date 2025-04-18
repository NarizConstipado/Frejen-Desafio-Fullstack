const express = require('express');
const router = express.Router();
const stateController = require('../controllers/states.controller.js')
const authController = require('../controllers/auth.controller.js')

router.route('/')
        .get(authController.verifyToken, stateController.findAll)
        .post(authController.verifyToken, stateController.create)
        
router.route('/:stateId')
        .get(authController.verifyToken, stateController.findOneById)
        .delete(authController.verifyToken, stateController.delete)
        .put(authController.verifyToken, stateController.edit)

//export this router
module.exports = router;