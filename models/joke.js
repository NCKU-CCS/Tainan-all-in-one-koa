'use strict';
module.exports = function(sequelize, DataTypes) {
  var Joke = sequelize.define('Joke', {
    title: DataTypes.TEXT,
    context: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Joke;
};