'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Tour, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'user_id',
      });

      this.hasMany(models.Comment, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'user_id',
      });

      this.hasMany(models.Invite, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'user_id',
      });

      this.hasMany(models.Like, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
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
      modelName: 'User',
    }
  );
  return User;
};
