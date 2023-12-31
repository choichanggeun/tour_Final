'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiaryPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Diary, {
        targetKey: 'id',
        foreignKey: 'diary_id',
        onDelete: 'CASCADE',
      });
    }
  }
  DiaryPhoto.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      diary_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Diary',
          key: 'id',
        },
      },
      diary_img: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'DiaryPhoto',
    }
  );
  return DiaryPhoto;
};
