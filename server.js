const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API " });
});

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Connected to MySQL via Docker successfully!');


    await sequelize.sync({ force: false });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
  }
};
const checkpointRoutes = require('./routes/checkpointRoutes');

app.use('/api/v1/checkpoints', checkpointRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const reportRoutes = require('./routes/reportRoutes');

app.use('/api/v1/reports', reportRoutes);

app.post('/api/v1/reports', (req, res) => {
  res.send('it works');
});

startServer();