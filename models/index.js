const User = require('./User');
const Checkpoint = require('./Checkpoint');
const Report = require('./Report');
const ReportVote = require('./ReportVote');
const StatusHistory = require('./StatusHistory');
const Subscription = require('./Subscription');
const RefreshToken = require('./RefreshToken');
const VerifiedIncident = require('./VerifiedIncident');


User.hasMany(Report, { foreignKey: 'user_id' });
Report.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ReportVote, { foreignKey: 'user_id' });
ReportVote.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(RefreshToken, { foreignKey: 'userid' });
RefreshToken.belongsTo(User, { foreignKey: 'userid' });


Report.hasMany(ReportVote, { foreignKey: 'report_id' });
ReportVote.belongsTo(Report, { foreignKey: 'report_id' });


Checkpoint.hasMany(StatusHistory, { foreignKey: 'checkpoint_id' });
StatusHistory.belongsTo(Checkpoint, { foreignKey: 'checkpoint_id' });


User.hasMany(StatusHistory, { foreignKey: 'changed_by' });
StatusHistory.belongsTo(User, { foreignKey: 'changed_by' });

module.exports = {
  User,
  Checkpoint,
  Report,
  ReportVote,
  StatusHistory,
  Subscription,
  RefreshToken,
  VerifiedIncident
};