'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        targetKey: 'id',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Diary, {
        targetKey: 'id',
        foreignKey: 'diary_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      diary_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Diary',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      content: {
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
      modelName: 'Comment',
    }
  );
  return Comment;
};
