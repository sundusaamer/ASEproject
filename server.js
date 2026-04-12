const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const checkpointRoutes = require('./routes/checkpointRoutes');
const authRoutes = require('./routes/authRoutes');
console.log("AUTH ROUTES LOADED");

app.use('/api/v1/checkpoints', checkpointRoutes);
app.use('/api/v1/auth', authRoutes);

// ================= HOME =================
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API 🇵🇸" });
});

// ================= START SERVER =================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully!');

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