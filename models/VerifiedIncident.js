const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerifiedIncident = sequelize.define('VerifiedIncident', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.TEXT },
  latitude: { type: DataTypes.DECIMAL(9, 6) },
  longitude: { type: DataTypes.DECIMAL(9, 6) },
  start_time: { type: DataTypes.DATE, allowNull: false },
  estimated_end_time: { type: DataTypes.DATE },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'verifiedincidents',
  timestamps: false
});

module.exports = VerifiedIncident;