import axios from 'axios';

const ELEVATION_API_URL = 'https://api.open-elevation.com/api/v1/lookup';

export const fetchElevation = async (coordinates) => {
    try {
        const response = await axios.post(ELEVATION_API_URL, {
            locations: coordinates,
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching elevation data:', error);
        throw error;
    }
};