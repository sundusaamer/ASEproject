// استيراد الموديلات من ملف index لضمان تفعيل العلاقات
const { Checkpoint, StatusHistory } = require('../models');

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
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateCheckpointStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, changed_by } = req.body; 

    const checkpoint = await Checkpoint.findByPk(id);
    if (!checkpoint) {
      return res.status(404).json({ status: 'fail', message: 'Checkpoint not found' });
    }

    // 1. تحديث الجدول الأساسي (Checkpoints)
    checkpoint.current_status = status;
    checkpoint.last_apdated_at = new Date();
    await checkpoint.save();

    // 2. إضافة سجل التاريخ تلقائياً (Status History)
    // هذا الجزء هو اللي بيحقق مطلب الـ Auditing في مشروعكم
    await StatusHistory.create({
      checkpoint_id: id,
      status: status,
      changed_by: changed_by || 1, // سيتم استبدال 1 بـ req.user.id لاحقاً بعد ربط الـ Auth
      reason: reason || 'Routine update',
      timestamp: new Date()
    });

    res.status(200).json({ 
      status: 'success', 
      message: 'Status updated and history logged',
      data: checkpoint 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};