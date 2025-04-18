const db = require("../models/index.js");
const Ticket = db.ticket;
const User = db.user;
const Department = db.department;
const State = db.state;
const { Op } = require("sequelize");

// tem que ter filtro no findByUser, pelo estado e texto

exports.findAll = async (req, res) => {
  try {
    let tickets = await Ticket.findAll({
      include: [Department, State, User],
    });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while finding all tickets.",
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let ticket = await Ticket.findOne({
      include: [Department, State, User],
    });
    if (!ticket)
      res.status(404).json({ error: `User Id ${req.params.ticketId} not found` });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || `Some error occurred while finding ticket ${req.params.ticketId}.`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.loggedUser.admin == false)
      return res.status(403).json({ error: "You do not have permission" });

    if (!req.body.title && typeof req.body.title != "string") {
      res
        .status(400)
        .json({ success: false, msg: "title must be a valid string" });
      return;
    }
    if (!req.body.description && typeof req.body.description != "string") {
      res
        .status(400)
        .json({ success: false, msg: "description must be a valid string" });
      return;
    }

    // check if user exists
    if (!req.body.created_by && typeof req.body.created_by != "integer") {
      res
        .status(400)
        .json({ success: false, msg: "created_by must be a valid integer" });
      return;
    }
    const user = await User.findByPk(req.body.created_by);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "created_by must be a valid User" });
    }

    // check id department exists
    if (!req.body.id_department && typeof req.body.id_department != "integer") {
      res
        .status(400)
        .json({ success: false, msg: "id_department must be a valid integer" });
      return;
    }
    const department = await Department.findByPk(req.body.id_department);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, msg: "id_department must be a valid integer" });
    }

    // check id state exists
    if (!req.body.id_state && typeof req.body.id_state != "integer") {
      res
        .status(400)
        .json({ success: false, msg: "id_state must be a valid integer" });
      return;
    }
    const state = await State.findByPk(req.body.id_state);
    if (!state) {
      return res
        .status(400)
        .json({ success: false, msg: "id_state must be a valid State" });
    }

    let newTicket = await Ticket.create(req.body);
    res.status(201).json({
      sucess: true,
      msg: `Ticket created successfully`,
      URL: `/tickets/${newTicket.id}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while creating a new ticket.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    let ticket = await ticket.findByPk(req.params.ticketId);
    if (ticket == undefined) {
      res.status(404).json({
        sucess: false,
        msg: `Ticket ${req.params.ticketId} not found`,
      });
      return;
    }

    // If ticket state is "Recusado" or "Finished"
    if (ticket.state == "Recusado" || "Finished")
      res.status(400).json({
        succes: false,
        msg: `This ticket cannot be edited`
      })

    if (req.body.title) ticket.title = req.body.title;

    if (req.body.description) ticket.description = req.body.description;
    
    // If "Recusado" then, the "obeservacoes" needs to be filled
    if (!req.body.observacoes && req.body.state == "Recusado")
    if (req.body.observacoes)
      ticket.observacoes = req.body.observacoes;

    // id_department
    if (req.body.id_department) {
      const department = await Department.findByPk(req.body.id_department);
      if (!department) {
        return res
          .status(400)
          .json({ success: false, msg: `Department ${req.body.id_department} not found` });
      }
      ticket.id_department = req.body.id_department;
    }

    // id_state
    if (req.body.id_state) {
      const state = await State.findByPk(req.body.id_state);
      if (!state) {
        return res
          .status(400)
          .json({ success: false, msg: `State ${req.body.id_state} not found` });
      }
      ticket.id_state = req.body.id_state;
    }

    // updated_by
    ticket.updated_by = req.loggedUser.id;

    await ticket.save();

    res.status(202).json({
      succes: true,
      msg: `Ticket ${ticket.id} updated successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while updating a ticket.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.loggedUser.admin == false)
      res.status(403).json({ error: "You do not have permission" });

    let ticket = await Ticket.findByPk(req.params.ticketId);
    if (ticket == undefined || ticket == null) {
      res.status(404).json({
        sucess: false,
        msg: `Ticket ${req.params.ticketId} not found`,
      });
    }

    Ticket.destroy({
      where: { id: req.params.ticketId },
    });

    res.status(200).json({
      sucess: true,
      msg: `Ticket ${req.params.ticketId} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || "Some error occurred while deleting a ticket.",
    });
  }
};