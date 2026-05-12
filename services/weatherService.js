const axios = require('axios');

// استبدلي 'YOUR_API_KEY' بالكود الذي نسختِه من الموقع
const API_KEY = 'b978164685f94aee8518502364e5ae0c'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeather = async (city) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,       // اسم المدينة (مثلاً: Ramallah)
                appid: API_KEY,
                units: 'metric', // لكي تظهر درجة الحرارة مئوية
                lang: 'en'       // لكي يظهر وصف الطقس بالعربي
            }
        });

        // سنعيد فقط البيانات المهمة لمشروعنا
        return {
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            city: response.data.name
        };
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw new Error("فشل في جلب بيانات الطقس");
    }
};

module.exports = { getWeather };