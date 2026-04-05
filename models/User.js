const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  username: {
    type: DataTypes.STRING(45),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(45),
    unique: true,
    allowNull: false,
    validate: { isEmail: true } 
  },
  password_hash: {
    type: DataTypes.TEXT, 
    allowNull: false
  },
  trust_score: {
    type: DataTypes.DECIMAL(5, 0),
    defaultValue: 0
  },
  role: {
    type: DataTypes.STRING(45),
    allowNull: false,
    defaultValue: 'citizen'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false, 
});

User.beforeCreate(async (user) => {
  if (user.password_hash) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

module.exports = User;