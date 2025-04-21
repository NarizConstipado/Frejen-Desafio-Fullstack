function checkAdminPermission(req, res) {
  if (!req.loggedUser?.admin) {
    res.status(403).json({ error: "You do not have permission" });
    return false;
  }
  return true;
}

function notFound(req, res, value, valueId) {
  if (!value) {
    return res.status(404).json({ error: `Id ${valueId} not found` });
  }
}

function badRequest(req, res, value, name, type) {
  if (!value && typeof value != type) {
    return res.status(400).json({ error: `${name} must be a ${type}` });
  }
}

function isValid(req, res, value, name, type) {
  if (value && typeof value != type) {
    return res.status(400).json({ error: `${name} must be a ${type}` });
  }
}

module.exports = {
  checkAdminPermission,
  notFound,
  badRequest,
  isValid,
};
