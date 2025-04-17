const express = require('express');
const router = express.Router();
const stateController = require('../controllers/states.controller.js')
const authController = require('../controllers/auth.controller.js')
// middleware for all routes related with tutorial

router.route('/')
        .get(stateController.findAll)
        .post(stateController.create)
        
router.route('/:stateId')
        .get(stateController.findOneById)
        .delete(stateController.delete)
        .put( stateController.edit)
        // authController.verifyToken,
        // .patch(authController.verifyToken, stateController.changeRoleOrBlock)

//export this router
module.exports = router;