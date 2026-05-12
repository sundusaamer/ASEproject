const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

// استدعاء الخدمات
const { getCoordinates } = require('./services/locationService');
const { getWeather } = require('./services/weatherService');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 2. Import Routes
const checkpointRoutes = require('./routes/checkpointRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const externalRoutes = require('./routes/externalRoutes');

// 3. Use Routes
app.use('/api/v1/checkpoints', checkpointRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/external', externalRoutes);

// 4. Base Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API 🇵🇸" });
});

app.get('/test', (req, res) => {
  res.send('Server is working perfectly!');
});

// 5. Database Connection and Server Start
const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await sequelize.authenticate();
    console.log(' Connected to MySQL successfully!');

    // مزامنة الموديلات
    await sequelize.sync({ force: false });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
      console.log(' System is clean and ready for integration.');
    });

  } catch (error) {
    console.error(' Unable to connect to the database:', error);
  }
};

startServer();