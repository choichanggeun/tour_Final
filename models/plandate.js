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
        targetKey: 'tour_id',
        foreignKey: 'tour_id',
      });

      this.hasMany(models.Place, {
        foreignKey: 'plan_date_id',
      });
    }
  }
  PlanDate.init(
    {
      plan_date_id: {
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
          key: 'tour_id',
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
      modelName: 'PlanDate',
    }
  );
  return PlanDate;
};
