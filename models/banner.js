'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Admin, {
        targetKey: 'id',
        foreignKey: 'admin_id',
      });
    }
  }
  Banner.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      admin_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Admin',
          key: 'id',
        },
      },
<<<<<<< HEAD
=======
      img: {
        allowNull: false,
        type: DataTypes.STRING,
      },
>>>>>>> 3b72e45d82d722243e43d9d1d522e89fbc3668a8
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },

    {
      sequelize,
      modelName: 'Banner',
    }
  );
  return Banner;
};
