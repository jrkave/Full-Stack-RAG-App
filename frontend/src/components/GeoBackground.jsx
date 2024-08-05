import React from 'react';

function GeoBackground() {
    return (
        <div className="geo-background fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 space stars1"></div>
                <div className="absolute inset-0 space stars2"></div>
                <div className="absolute inset-0 space stars3"></div>
            </div>
        </div>
    );
}

export default GeoBackground;
