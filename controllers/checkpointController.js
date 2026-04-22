const Checkpoint = require('../models/Checkpoint');

// ================= GET ALL =================
exports.getAllCheckpoints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Checkpoint.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ================= CREATE =================
exports.createCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.create(req.body);

    res.status(201).json({
      status: 'success',
      data: checkpoint
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ================= UPDATE STATUS =================
exports.updateCheckpointStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const checkpoint = await Checkpoint.findByPk(id);

    if (!checkpoint) {
      return res.status(404).json({
        status: 'fail',
        message: 'Checkpoint not found'
      });
    }

    checkpoint.current_status = status;
    checkpoint.last_updated_at = new Date();

    await checkpoint.save();

    res.status(200).json({
      status: 'success',
      data: checkpoint
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};