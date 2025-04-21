const db = require("../models/index");
const State = db.state;
const {
  checkAdminPermission,
  notFound,
  badRequest,
} = require("../utilities/validation");

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
    notFound(req, res, state, req.params.stateId);

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
    if (!checkAdminPermission(req, res)) return;

    badRequest(req, res, req.body.title, "title", "string");

    let newState = await State.create(req.body);
    res.status(201).json({
      sucess: true,
      msg: `State created successfully`,
      URL: `/states/${newState.id}`,
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      msg: err.message || "Some error occurred while creating a new state.",
    });
  }
};

exports.edit = async (req, res) => {
  try {
    if (!checkAdminPermission(req, res)) return;

    let state = await State.findByPk(req.params.stateId);
    notFound(req, res, state, req.params.stateId);

    isValid(req, res, req.body?.title, "title", "string");

    await State.update(req.body, { where: { id: state.id } });
    res.status(200).json({ msg: `State ${state.id} updated successfully` });
  } catch (err) {
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
    if (!checkAdminPermission(req, res)) return;

    const state = await State.findByPk(req.params.stateId);
    notFound(req, res, state, req.params.stateId);

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
