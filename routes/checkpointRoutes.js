const express = require('express');
const router = express.Router();
const cpController = require('../controllers/checkpointController');

// GET /api/v1/checkpoints
router.get('/', cpController.getAllCheckpoints);

// PATCH /api/v1/checkpoints/:id/status
router.patch('/:id/status', cpController.updateCheckpointStatus);

module.exports = router;