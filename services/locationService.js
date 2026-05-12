const axios = require('axios');

const getCoordinates = async (placeName) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: placeName,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'WasselProject/1.0' // ضروري جداً لهذا الـ API
            }
        });

        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                lat: location.lat,
                lon: location.lon,
                displayName: location.display_name
            };
        } else {
            throw new Error('الموقع غير موجود');
        }
    } catch (error) {
        console.error('خطأ في جلب الإحداثيات:', error.message);
        throw error;
    }
};

module.exports = { getCoordinates };