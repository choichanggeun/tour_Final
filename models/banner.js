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
        targetKey: 'admin_id',
        foreignKey: 'admin_id',
      });
    }
  }
  Banner.init(
    {
      banner_id: {
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
          key: 'admin_id',
        },
        img: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
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
