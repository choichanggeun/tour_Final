'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.PlanDate, {
        targetKey: 'id',
        foreignKey: 'plan_date_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.TourSite, {
        targetKey: 'id',
        foreignKey: 'tour_site_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Place.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tour_site_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'TourSite',
          key: 'id',
        },
      },
      plan_date_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'PlanDate',
          key: 'id',
        },
      },
      start_time: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      end_time: {
        allowNull: true,
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
      modelName: 'Place',
    }
  );
  return Place;
};
