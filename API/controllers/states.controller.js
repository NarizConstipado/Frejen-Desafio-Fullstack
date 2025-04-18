const db = require("../models/index");
const State = db.state;
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
  try {
    let result = await State.findAll();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while finding states.",
    });
  }
};

exports.findOneById = async (req, res) => {
  try {
    let state = await State.findByPk(req.params.stateId);
    if (!state)
      res
        .status(404)
        .json({ error: `State Id ${req.params.stateId} not found` });
    res.status(200).json(state);
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

exports.create = async (req, res) => {
  try {
    if (req.loggedUser.admin == false)
      return res.status(403).json({ error: "You do not have permission" });

    if (!req.body.title) res.status(400).json({ error: "title is required" });
    else if (typeof req.body.title != "string")
      res.status(400).json({ error: "title must be a string" });

    let newState = await State.create(req.body);
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
    if (req.loggedUser.admin == false)
      res.status(403).json({ error: "You do not have permission" });

    let state = await State.findByPk(req.params.stateId);
    if (!state)
      res
        .status(404)
        .json({ error: `State Id ${req.params.stateId} not found` });

    if (req.body.title && typeof req.body.title != "string")
      res.status(400).json({ error: "title must be a string" });

    await State.update(req.body, { where: { id: state.id } });
    res
      .status(200)
      .json({ msg: `State ${state.id} updated successfully` });
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
    if (req.loggedUser.admin == false)
      res.status(403).json({ error: "You do not have permission" });

    const state = await State.findOne({
      where: { id: req.params.stateId },
    });
    await state.destroy({ where: { id: req.params.stateId } });
    res.status(200).json({
      msg: `State ${req.params.stateId} deleted successfully`,
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