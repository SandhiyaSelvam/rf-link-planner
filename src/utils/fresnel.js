const SPEED_OF_LIGHT = 3e8; // Speed of light in m/s

export function calculateFresnelZoneRadius(frequency, distance1, distance2) {
    const wavelength = SPEED_OF_LIGHT / (frequency * 1e9); // Convert GHz to Hz
    const radius = Math.sqrt((wavelength * distance1 * distance2) / (distance1 + distance2));
    return radius;
}