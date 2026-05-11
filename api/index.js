const { app, ensureDb } = require("../server/index");

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
