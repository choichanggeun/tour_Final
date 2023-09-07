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
      });
      this.belongsTo(models.TourSite, {
        targetKey: 'id',
        foreignKey: 'tour_site_id',
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
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      end_time: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
