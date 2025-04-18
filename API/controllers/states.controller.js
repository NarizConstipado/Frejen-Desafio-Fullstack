const db = require("../models/index");
const State = db.state;
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
  try {
    let result = await State.findAll({ order: [["createdAt"]] });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while finding states.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.loggedUser.role != "admin")
      return res.status(403).json({ error: "You do not have permission" });

    let state = {};
    if (!req.body.title) res.status(400).json({ error: "Title is required" });
    else if (typeof req.body.title != "string")
      res.status(400).json({ error: "name must be a string" });
    else state.title = req.body.title;

    let newState = await State.create(state);
    res.status(201).json({
      sucess: true,
      msg: `State created successfully`,
      URL: `/states/${newState.id}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while creating a new state.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    if (req.loggedUser.role != "admin")
      res.status(403).json({ error: "You do not have permission" });

    let state = await State.findByPk(req.params.stateId);
    if (!state)
      res
        .status(404)
        .json({ error: `State Id ${req.params.stateId} not found` });

    let updateState = {};
    if (req.body.title && typeof req.body.title != "string")
      res.status(400).json({ error: "title must be a string" });
    else updateState.title = req.body.title;

    await State.update(updateState, { where: { id: state.id } });
    res
      .status(200)
      .json({ msg: `State ${state.id} was successfully changed!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while updating state ${req.params.stateId}.`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.loggedUser.role != "admin")
      res.status(403).json({ error: "You do not have permission" });

    const state = await State.findOne({
      where: { id: req.params.stateId },
    });
    await state.destroy({ where: { id: req.params.stateId } });
    res.status(200).json({
      msg: `State ${req.params.stateId} was successfully deleted!`,
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while deleting state ${req.params.stateId}.`,
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let state = await State.findByPk(req.params.stateId);
    if (!state) {
      res
        .status(404)
        .json({ error: `State Id ${req.params.stateId} not found` });
    } else res.status(200).json(state);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      sucess: false,
      msg:
        err.message ||
        `Some error occurred while finding state ${req.params.stateId}.`,
    });
  }
};
