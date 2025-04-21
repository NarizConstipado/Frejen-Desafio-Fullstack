console.clear();
require("dotenv").config();

const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/db.config.js");
const db = {};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: "mysql",
});

db.sequelize = sequelize;
db.user = require("./users.model.js")(sequelize, DataTypes);
db.state = require("./states.model.js")(sequelize, DataTypes);
db.department = require("./departments.model.js")(sequelize, DataTypes);
db.ticket = require("./tickets.model.js")(sequelize, DataTypes);

//1:M
db.department.hasMany(db.user, { foreignKey: "id_department" });
db.user.belongsTo(db.department, { foreignKey: "id_department" });

db.state.hasMany(db.ticket, { foreignKey: "id_state" });
db.ticket.belongsTo(db.state, { foreignKey: "id_state" });

db.department.hasMany(db.ticket, { foreignKey: "id_department" });
db.ticket.belongsTo(db.department, { foreignKey: "id_department" });

//alias
db.ticket.belongsTo(db.user, { foreignKey: "created_by", as: "createdBy" });

db.ticket.belongsTo(db.user, { foreignKey: "updated_by", as: "updatedBy" });

// (async () => {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("DB is successfully synchronized");
//   } catch (error) {
//     console.log(error);
//   }
// })();

module.exports = db;
