'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TourSites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      site_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      site_address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      site_img: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mapx: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mapy: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('TourSites');
  },
};
