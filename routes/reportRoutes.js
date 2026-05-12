const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// 1. مسار إنشاء بلاغ جديد
router.post('/', reportController.createReport);

// 2. مسار التصويت (أضيفيه هنا)
// الرابط سيكون: POST /api/v1/reports/5/vote
router.post('/:report_id/vote', reportController.voteReport);

// 3. مسار جلب كل البلاغات
router.get('/', reportController.getAllReports);

module.exports = router;