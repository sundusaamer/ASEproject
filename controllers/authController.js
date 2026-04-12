const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق إذا الإيميل موجود
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already exists'
      });
    }

    // تشفير الباسورد
  

const user = await User.create({
  username: name,
  email: email,
  password_hash: password
});

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التأكد من المستخدم
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid password'
      });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};