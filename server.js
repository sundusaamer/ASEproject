const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

// استدعاء الخدمات (سيتم استخدامها داخل الـ Routes لاحقاً)
const { getCoordinates } = require('./services/locationService');
const { getWeather } = require('./services/weatherService');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Basic Welcome Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API 🇵🇸" });
});

// مثال بسيط لكيفية عمل Route مستقبلاً (اختياري)
// app.get('/api/weather', async (req, res) => { ... });

// --- Database & Server Start ---
const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL successfully!');

    // مزامنة الموديلات
    await sequelize.sync({ force: false });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log('📢 System is clean and ready for integration.');
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();