const db = require("../models/index.js");
const Ticket = db.ticket;
const User = db.user;
const Department = db.department;
const State = db.state;
const { Op } = require("sequelize");

// Array of States that cannot be edited (3-Recusado, 5-Finalizado)
const statesNotEditable = [3, 5];

// Reusable attributes
const excludeAttributes = [
  "id_state",
  "id_department",
  "created_by",
  "updated_by",
  "createdAt",
  "updatedAt",
];
const departmentAttributes = ["id", "title"];
const stateAttributes = ["id", "title"];
const userAttributes = ["id", "name", "email"];

exports.findByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search?.trim() || null;
    const state = req.query.id_state || null;

    const whereClause = {};

    // Admin users have no restrictions, but non-admin users need filters
    if (!req.loggedUser.admin) {
      whereClause[Op.or] = [
        { created_by: req.loggedUser.id },
        { updated_by: req.loggedUser.id },
        { id_department: req.loggedUser.id_department },
      ];
    }

    // Only include search if it's not empty
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Only include state if it's defined
    if (state) {
      const stateIds = state.split(",").map(Number);
      whereClause.id_state = { [Op.in]: stateIds };
    }

    const tickets = await Ticket.findAll({
      where: whereClause,
      offset: page * limit,
      limit,
      attributes: {
        exclude: excludeAttributes,
      },
      include: [
        { model: Department, attributes: departmentAttributes },
        { model: State, attributes: stateAttributes },
        { model: User, as: "createdBy", attributes: userAttributes },
        { model: User, as: "updatedBy", attributes: userAttributes },
      ],
    });

    res.status(200).json(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    let tickets = await Ticket.findAll({
      attributes: {
        exclude: excludeAttributes,
      },
      include: [
        { model: Department, attributes: departmentAttributes },
        { model: State, attributes: stateAttributes },
        { model: User, as: "createdBy", attributes: userAttributes },
        { model: User, as: "updatedBy", attributes: userAttributes },
      ],
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
      attributes: {
        exclude: excludeAttributes,
      },
      include: [
        { model: Department, attributes: departmentAttributes },
        { model: State, attributes: stateAttributes },
        { model: User, as: "createdBy", attributes: userAttributes },
        { model: User, as: "updatedBy", attributes: userAttributes },
      ],
    });
    if (!ticket)
      res
        .status(404)
        .json({ error: `User Id ${req.params.ticketId} not found` });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({
      success: false,
      msg:
        err.message ||
        `Some error occurred while finding ticket ${req.params.ticketId}.`,
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

    if (
      req.body.observacoes != null &&
      typeof req.body.description != "string"
    ) {
      res
        .status(400)
        .json({ success: false, msg: "observacoes must be a valid string" });
      return;
    }

    // check if user exists
    const user = await User.findByPk(req.loggedUser.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "created_by must be a valid User" });
    }
    req.body.created_by = user.id;

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
    let ticket = await Ticket.findByPk(req.params.ticketId);
    if (ticket == undefined) {
      res.status(404).json({
        sucess: false,
        msg: `Ticket ${req.params.ticketId} not found`,
      });
      return;
    }

    // If ticket state is "Recusado" or "Finished"
    if (statesNotEditable.includes(ticket.id_state))
      res.status(400).json({
        succes: false,
        msg: `This ticket cannot be edited`,
      });

    // If "Recusado", id 3, then, the "obeservacoes" needs to be filled
    if (!req.body.observacoes && ticket.id_state == 3)
      res.status(400).json({
        success: false,
        msg: `If new state is "Recusado", Observacoes must be filled`,
      });

    if (req.body.title) ticket.title = req.body.title;

    if (req.body.description) ticket.description = req.body.description;

    if (req.body.observacoes) ticket.observacoes = req.body.observacoes;

    // id_department
    if (req.body.id_department) {
      const department = await Department.findByPk(req.body.id_department);
      if (!department) {
        return res.status(400).json({
          success: false,
          msg: `Department ${req.body.id_department} not found`,
        });
      }
      ticket.id_department = req.body.id_department;
    }

    // id_state
    if (req.body.id_state) {
      const state = await State.findByPk(req.body.id_state);
      if (!state) {
        return res.status(400).json({
          success: false,
          msg: `State ${req.body.id_state} not found`,
        });
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

    let ticket = await Ticket.findByPk(req.params.ticketId, {
      attributes: {
        exclude: excludeAttributes,
      },
    });
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
