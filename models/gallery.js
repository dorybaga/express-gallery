module.exports = function(sequelize, DataTypes) {
  var Poke = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Gallery;
};