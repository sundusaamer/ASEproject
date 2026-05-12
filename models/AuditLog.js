const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  details: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: 'audit_logs',
  timestamps: true
});

module.exports = AuditLog;