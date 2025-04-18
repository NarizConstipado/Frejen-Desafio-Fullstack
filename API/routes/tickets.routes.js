const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/tickets.controller.js')
const authController = require('../controllers/auth.controller.js')

router.route('/')
        .get(authController.verifyToken, ticketController.findByUser)
        .post(authController.verifyToken, ticketController.create)

router.route('/all')
        .get(authController.verifyToken, ticketController.findAll)

router.route('/:stateId')
        .get(authController.verifyToken, ticketController.findOneById)
        .delete(authController.verifyToken, ticketController.delete)
        .put(authController.verifyToken, ticketController.edit)

//export this router
module.exports = router;