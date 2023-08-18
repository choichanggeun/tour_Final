'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Diaries', {
<<<<<<< HEAD
      diary_id: {
=======
      id: {
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tour_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Tours',
<<<<<<< HEAD
          key: 'tour_id',
=======
          key: 'id',
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        },
      },

      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      diary_img: {
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
    await queryInterface.dropTable('Diaries');
  },
};
