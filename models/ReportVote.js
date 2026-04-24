const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportVote = sequelize.define('ReportVote', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: { type: DataTypes.INTEGER, allowNull: false },
user_id: { type: DataTypes.INTEGER, allowNull: false },
  vote_type: { 
    type: DataTypes.ENUM('upvote', 'downvote'), 
    allowNull: false 
  }
}, {
  tableName: 'reportvotes',
  timestamps: false
});

module.exports = ReportVote;