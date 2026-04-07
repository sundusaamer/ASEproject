const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: "Welcome to Wasel Palestine API 🇵🇸" });
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
startServer();