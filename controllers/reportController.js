// 1. Import Models and Sequelize Operators
const { Report, ReportVote, User } = require('../models');
const { Op } = require('sequelize'); 

/**
 * @desc    Create a new report
 * @route   POST /api/v1/reports
 */
exports.createReport = async (req, res) => {
  try {
    const { category, description, latitude, longitude, severity, user_id } = req.body;

    const newReport = await Report.create({
      user_id: user_id || 1, // Temporary manual ID until Auth integration
      category,
      description,
      latitude,
      longitude,
      severity,
      status: 'pending' 
    });

    res.status(201).json({
      status: 'success',
      message: 'Report submitted successfully!',
      data: newReport
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Get all reports with Filtering, Pagination, and Search
 * @route   GET /api/v1/reports
 */
exports.getAllReports = async (req, res) => {
  try {
    // Pagination Parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filtering & Search Parameters
    const { category, status, severity, search } = req.query;
    let whereClause = {};

    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (severity) whereClause.severity = severity;
    
    // Logic for partial text search in description
    if (search) {
      whereClause.description = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Report.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']], // Latest reports first
      include: [
        { model: User, attributes: ['username', 'trust_score'] },
        { model: ReportVote }
      ]
    });

    res.status(200).json({
      status: 'success',
      results: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Handle voting and Auto-Verification logic
 * @route   POST /api/v1/reports/:report_id/vote
 */
exports.voteReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    const { user_id, vote_type } = req.body;

    const report = await Report.findByPk(report_id);
    if (!report) {
      return res.status(404).json({ status: 'fail', message: 'Report not found' });
    }

    // Check for existing vote to prevent duplicates (Toggle Logic)
    const existingVote = await ReportVote.findOne({
      where: { report_id, user_id }
    });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        await existingVote.destroy(); // Cancel vote if same button clicked twice
      } else {
        existingVote.vote_type = vote_type; // Update vote type
        await existingVote.save();
      }
    } else {
      await ReportVote.create({ report_id, user_id, vote_type });
    }

    // --- Core Feature: Auto-Verification Logic ---
    const upvotesCount = await ReportVote.count({
      where: { report_id, vote_type: 'upvote' }
    });

    // Automatically verify report if it reaches the confidence threshold (e.g., 5 upvotes)
    if (upvotesCount >= 5 && report.status === 'pending') {
      report.status = 'verified';
      await report.save();
    }

    res.status(200).json({ 
      status: 'success', 
      message: 'Vote processed',
      currentStatus: report.status,
      upvotes: upvotesCount
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};