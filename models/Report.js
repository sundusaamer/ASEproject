const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  category: { 
    type: DataTypes.ENUM('accident', 'new checkpoint', 'weather', 'closure'), 
    allowNull: false 
  },
  description: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  severity: { type: DataTypes.STRING(45), allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'verified', 'dismissed'), 
    defaultValue: 'pending' 
  }
}, {
  tableName: 'reports',
  timestamps: false
});

module.exports = Report;