module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define("department", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: `Please provide a title!` },
      },
    },
  });
  return department;
};
