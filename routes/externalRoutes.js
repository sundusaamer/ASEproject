const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');
const { getCoordinates } = require('../services/locationService');

// Route لجلب الطقس والموقع معاً بطلب واحد
router.get('/city-info', async (req, res) => {
    try {
        const { city } = req.query; // استلام اسم المدينة من الرابط
        if (!city) return res.status(400).json({ error: "Please provide a city name" });

        const coords = await getCoordinates(city);
        const weather = await getWeather(city);

        res.json({
            status: "success",
            data: {
                location: coords,
                weather: weather
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;