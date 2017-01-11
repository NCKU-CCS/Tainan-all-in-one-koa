'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      link: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      lng: {
        type: Sequelize.FLOAT
      },
      lat: {
        type: Sequelize.FLOAT
      },
      location: {
        type: Sequelize.GEOMETRY('POINT', 4326)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Restaurants');
  }
};
