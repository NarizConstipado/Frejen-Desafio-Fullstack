module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define("ticket", {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Please provide a title!` },
      },
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Please provide a description!` },
      },
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Please provide a description!` },
      },
      allowNull: false,
    },
  });
  return ticket;
};
