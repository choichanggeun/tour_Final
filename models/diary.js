'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tour, {
        targetKey: 'id',
        foreignKey: 'tour_id',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.Comment, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'diary_id',
      });

      this.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Diary.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tour_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Tour',
          key: 'id',
        },
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
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
      modelName: 'Diary',
    }
  );
  return Diary;
};
