import React from 'react';

const FresnelEllipse = ({ link, onClick }) => {
    const { start, end } = link;

    const calculateFresnelZone = (frequency, distance) => {
        const c = 3e8; // speed of light in m/s
        const wavelength = c / (frequency * 1e9); // frequency in Hz
        const d1 = distance / 2; // distance from transmitter to midpoint
        const d2 = distance / 2; // distance from receiver to midpoint
        const radius = Math.sqrt((wavelength * d1 * d2) / (d1 + d2));
        return radius;
    };

    const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    const fresnelRadius = calculateFresnelZone(start.frequency, distance);

    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;

    return (
        <svg onClick={onClick}>
            <ellipse
                cx={centerX}
                cy={centerY}
                rx={fresnelRadius}
                ry={fresnelRadius / 2}
                fill="rgba(255, 165, 0, 0.5)"
                stroke="orange"
                strokeWidth="2"
            />
        </svg>
    );
};

export default FresnelEllipse;