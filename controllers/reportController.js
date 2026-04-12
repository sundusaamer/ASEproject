// استدعاء الموديلات من ملف index لضمان عمل العلاقات (Associations)
const { Report, ReportVote, User } = require('../models');

// 1. إنشاء بلاغ جديد
exports.createReport = async (req, res) => {
  try {
    const { category, description, latitude, longitude, severity, user_id } = req.body;

    const newReport = await Report.create({
      user_id: user_id || 1, // سيتم استبداله بـ req.user.id بعد ربط الـ Auth
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

// 2. جلب كل البلاغات (سنضيف الـ Filtering والـ Pagination في الخطوة القادمة)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: User, attributes: ['username', 'trust_score'] }, // جلب معلومات صاحب البلاغ
        { model: ReportVote } // جلب التصويتات المرتبطة
      ]
    });
    res.status(200).json({ status: 'success', data: reports });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. نظام التصويت والتحقق التلقائي (Core Logic)
exports.voteReport = async (req, res) => {
  try {
    const { report_id } = req.params;
    const { user_id, vote_type } = req.body;

    const report = await Report.findByPk(report_id);
    if (!report) {
      return res.status(404).json({ status: 'fail', message: 'Report not found' });
    }

    // التحقق من وجود تصويت سابق
    const existingVote = await ReportVote.findOne({
      where: { report_id, user_id }
    });

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        await existingVote.destroy();
      } else {
        existingVote.vote_type = vote_type;
        await existingVote.save();
      }
    } else {
      await ReportVote.create({ report_id, user_id, vote_type });
    }

    // --- منطق التحقق التلقائي (Auto-Verification Logic) ---
    // نحسب عدد الـ upvotes الحالية للبلاغ
    const upvotesCount = await ReportVote.count({
      where: { report_id, vote_type: 'upvote' }
    });

    // إذا وصل لـ 5 أصوات إيجابية مثلاً، نغير الحالة لـ verified
    if (upvotesCount >= 5 && report.status === 'pending') {
      report.status = 'verified';
      await report.save();
    }

    res.status(200).json({ 
      status: 'success', 
      message: 'Vote processed',
      currentStatus: report.status 
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};