'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tour, {
        targetKey: 'id',
        foreignKey: 'tour_id',
      });

      this.hasMany(models.Place, {
        foreignKey: 'plan_date_id',
      });
    }
  }
  PlanDate.init(
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
      modelName: 'PlanDate',
    }
  );
  return PlanDate;
};
