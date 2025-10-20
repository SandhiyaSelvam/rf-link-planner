import { useState, useEffect } from 'react';

const useElevation = (tower1, tower2) => {
    const [elevationData, setElevationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElevation = async () => {
            if (!tower1 || !tower2) return;

            setLoading(true);
            setError(null);

            const lat1 = tower1.latitude;
            const lon1 = tower1.longitude;
            const lat2 = tower2.latitude;
            const lon2 = tower2.longitude;

            const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat1},${lon1}|${lat2},${lon2}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch elevation data');
                }
                const data = await response.json();
                setElevationData(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchElevation();
    }, [tower1, tower2]);

    return { elevationData, loading, error };
};

export default useElevation;