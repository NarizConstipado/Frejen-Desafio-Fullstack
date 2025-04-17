module.exports = (sequelize, DataTypes) => {
  const state = sequelize.define("state", {
    title: {
      type: DataTypes.STRING,
      isIn: ["Pendente", "Recusado", "Em tratamento", "Finalizado"],
      defaultValue: "Pendente",
    },
  });
  return state;
};
