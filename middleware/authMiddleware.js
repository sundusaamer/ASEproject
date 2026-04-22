const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  try {
    let token;

    // قراءة التوكن من Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // إذا ما في توكن
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no token'
      });
    }

    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // حفظ بيانات المستخدم داخل req
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }
};