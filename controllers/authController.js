const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already exists'
      });
    }

    const user = await User.create({
      username: name,
      email: email,
      password_hash: password,
      role: role || 'citizen'
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

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid password'
      });
    }

    // Access Token
    const accessToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};