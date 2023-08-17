'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Place', {
      place_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tour_site_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TourSite',
          key: 'tour_site_id',
        },
      },
      plan_date_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'PlanDate',
          key: 'plan_date_id',
        },
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
    await queryInterface.dropTable('Place');
  },
};
