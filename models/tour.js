'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
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

      this.belongsTo(models.TourSite, {
        targetKey: 'id',
        foreignKey: 'tour_site_id',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.Diary, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'tour_id',
      });

      this.hasMany(models.PlanDate, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'tour_id',
      });

      this.hasMany(models.Like, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'tour_id',
      });

      this.hasMany(models.Invite, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'tour_id',
      });
    }
  }
  Tour.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      tour_site_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      start_date: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      end_date: {
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
      modelName: 'Tour',
    }
  );
  return Tour;
};
