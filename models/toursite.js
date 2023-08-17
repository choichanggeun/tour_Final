'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourSite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        targetKey: 'user_id',
        foreignKey: 'user_id',
      });

      this.hasMany(models.Tour, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'tour_id',
      });

      this.hasMany(models.Place, {
        // 1:N 관계 설정을 합니다.
        foreignKey: 'place_id',
      });
    }
  }
  TourSite.init(
    {
      tour_site_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      site_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      site_address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      site_img: {
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
      modelName: 'TourSite',
    }
  );
  return TourSite;
};
