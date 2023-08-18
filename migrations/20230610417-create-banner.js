'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', {
<<<<<<< HEAD
      banner_id: {
=======
      id: {
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      admin_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
<<<<<<< HEAD
          key: 'admin_id',
        },
        img: {
          allowNull: false,
          type: Sequelize.STRING,
        },
      },
=======
          key: 'id',
        },
      },
      img: {
        allowNull: false,
        type: Sequelize.STRING,
      },

>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
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
    await queryInterface.dropTable('Banners');
  },
};
