const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userid: { type: DataTypes.INTEGER, allowNull: false },
  token: { type: DataTypes.TEXT, allowNull: false },
  expiry_date: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'refreshtokens',
  timestamps: false
});

module.exports = RefreshToken;