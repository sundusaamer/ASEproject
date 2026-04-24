const express = require('express');
const router = express.Router();

const cpController = require('../controllers/checkpointController');
const authMiddleware = require('../middleware/authMiddleware');

// GET all checkpoints
router.get('/', cpController.getAllCheckpoints);

// CREATE checkpoint
router.post('/', cpController.createCheckpoint);

// UPDATE checkpoint status (Protected)
router.patch(
  '/:id/status',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  cpController.updateCheckpointStatus
);

module.exports = router;