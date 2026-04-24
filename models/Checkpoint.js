const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Checkpoint = sequelize.define('Checkpoint', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_ar: { type: DataTypes.STRING(145), allowNull: false },
  name_en: { type: DataTypes.STRING(145) },
  latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false }, 
  longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
  current_status: { 
    type: DataTypes.ENUM('Open', 'Closed', 'Congested', 'Restricted'), 
    allowNull: false 
  },
  last_updated_at: { type: DataTypes.DATE, field: 'last_apdated_at' } 
}, {
  tableName: 'checkpoints',
  timestamps: false
});

module.exports = Checkpoint;