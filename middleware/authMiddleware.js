const jwt = require('jsonwebtoken');
const User = require('../models/user');

// ================= PROTECT =================
exports.protect = async (req, res, next) => {
  try {
    let token;

    // قراءة التوكن
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // إذا لا يوجد توكن
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no token'
      });
    }

    // فك التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب المستخدم من قاعدة البيانات
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists'
      });
    }

    // تخزين المستخدم داخل الطلب
    req.user = currentUser;

    next();

  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }
};

// ================= ADMIN / ROLE CHECK =================
exports.restrictTo = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission'
      });
    }

    next();
  };
};