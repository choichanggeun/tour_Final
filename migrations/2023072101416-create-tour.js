'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tour', {
      tour_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      tour_site_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TourSite',
          key: 'tour_site_id',
        },
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      start_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      end_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tour');
  },
};
