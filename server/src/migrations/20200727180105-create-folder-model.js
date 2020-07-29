'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable('Folders', {
        name: Sequelize.DataTypes.STRING,
        size: {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0
        },
        relativePath: Sequelize.DataTypes.STRING,
        isRoot: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false
        }
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('Folders');
    })
  }
};