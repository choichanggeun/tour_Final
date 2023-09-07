'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tour_site_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'TourSites',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      plan_date_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'PlanDates',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Places');
  },
};
