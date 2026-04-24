const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  region_name: { type: DataTypes.STRING(100), allowNull: false },
  category_interest: { type: DataTypes.STRING(50) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'subscriptions',
  timestamps: false
});

module.exports = Subscription;