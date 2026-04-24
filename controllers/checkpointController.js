// 1. Import models from the index file to ensure associations are properly loaded
// We use StatusHistory as per our architected database schema
const { Checkpoint, StatusHistory } = require('../models');

/**
 * @desc    Get all checkpoints with Pagination
 * @route   GET /api/v1/checkpoints
 */
exports.getAllCheckpoints = async (req, res) => {
  try {
    // Pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch data with total count for frontend pagination support
    const { count, rows } = await Checkpoint.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']] // Show most recently added checkpoints first
    });

    res.status(200).json({
      status: 'success',
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
 * @desc    Create a new checkpoint (Standard operation)
 */
exports.createCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.create(req.body);
    res.status(201).json({
      status: 'success',
      data: checkpoint
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Update checkpoint status and log history (Auditing)
 * @route   PATCH /api/v1/checkpoints/:id
 */
exports.updateCheckpointStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, changed_by } = req.body; 

    const checkpoint = await Checkpoint.findByPk(id);
    if (!checkpoint) {
      return res.status(404).json({ status: 'fail', message: 'Checkpoint not found' });
    }

    // 1. Update the main Checkpoint record
    checkpoint.current_status = status;
    checkpoint.last_updated_at = new Date();
    await checkpoint.save();

    // 2. Automatically create a Status History record (Auditing Logic)
    // We stick to StatusHistory to maintain traceability for each checkpoint
    await StatusHistory.create({
      checkpoint_id: id,
      status: status,
      changed_by: changed_by || 1, // Will be replaced by req.user.id after Auth integration
      reason: reason || 'Routine update',
      timestamp: new Date()
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Status updated and history logged successfully',
      data: checkpoint 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};