const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StatusHistory = sequelize.define('StatusHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  checkpoint_id: { type: DataTypes.BIGINT, allowNull: false },
  status: { type: DataTypes.STRING(45), allowNull: false },
  changed_by: { type: DataTypes.BIGINT, allowNull: false },
  reason: { type: DataTypes.TEXT },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'statushistory',
  timestamps: false
});

module.exports = StatusHistory;