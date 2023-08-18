'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
<<<<<<< HEAD
      comment_id: {
=======
      id: {
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
<<<<<<< HEAD
          key: 'user_id',
=======
          key: 'id',
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        },
      },
      diary_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Diaries',
<<<<<<< HEAD
          key: 'diary_id',
=======
          key: 'id',
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        },
      },
      content: {
        allowNull: false,
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
    await queryInterface.dropTable('Comments');
  },
};
