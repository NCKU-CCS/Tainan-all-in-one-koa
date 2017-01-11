'use strict';
module.exports = function(sequelize, DataTypes) {
  var Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.TEXT,
    address: DataTypes.TEXT,
    link: DataTypes.TEXT,
    category: DataTypes.ARRAY(DataTypes.TEXT),
    lng: DataTypes.FLOAT,
    lat: DataTypes.FLOAT,
    location: DataTypes.GEOMETRY('POINT', 4326)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Restaurant;
};
