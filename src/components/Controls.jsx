import React from 'react';

const Controls = ({ addTower, configureFrequency, removeTower, links }) => {
    const [frequency, setFrequency] = React.useState('');

    const handleFrequencyChange = (e) => {
        setFrequency(e.target.value);
    };

    const handleAddTower = () => {
        if (frequency) {
            addTower(frequency);
            setFrequency('');
        }
    };

    return (
        <div className="controls">
            <h2>RF Link Planner Controls</h2>
            <div>
                <input
                    type="number"
                    value={frequency}
                    onChange={handleFrequencyChange}
                    placeholder="Frequency (GHz)"
                />
                <button onClick={handleAddTower}>Add Tower</button>
            </div>
            <div>
                <h3>Existing Links</h3>
                <ul>
                    {links.map((link, index) => (
                        <li key={index}>
                            Tower {link.tower1} ↔ Tower {link.tower2} (Frequency: {link.frequency} GHz)
                            <button onClick={() => removeTower(link)}>Remove Link</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Controls;