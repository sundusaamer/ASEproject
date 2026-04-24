const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// Logger Middleware to track requests in the terminal
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 2. Import Routes
const checkpointRoutes = require('./routes/checkpointRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

// 3. Use Routes
app.use('/api/v1/checkpoints', checkpointRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/auth', authRoutes);

// 4. Base Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API" });
});

app.get('/test', (req, res) => {
  res.send('Server is working perfectly!');
});

// 5. Database Connection and Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully!');

    // Sync models with the database (force: false ensures we don't delete data)
    await sequelize.sync({ force: false });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('DB connection error:', error);
  }
};

startServer();