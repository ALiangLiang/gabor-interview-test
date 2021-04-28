
const { sequelize } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await sequelize.sync({ force: true })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
