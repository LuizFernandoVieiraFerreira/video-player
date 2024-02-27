import React from 'react';

const ProgressControl = ({ currentTime, duration, percentageSeen, handleSeek }) => {
  return (
    <div className="progress">
      <input
        type="range"
        min={0}
        max={isNaN(duration) ? 0 : duration}
        value={currentTime}
        onChange={(e) => handleSeek(e.target.value) }
        style={{ background: `linear-gradient(to right, #796fc1 0%, #796fc1 ${percentageSeen}%, rgba(0, 0, 0, 0.1) ${percentageSeen}%, rgba(0, 0, 0, 0.1) 100%)` }}
        data-testid="progress-bar"
      />
    </div>
  );
};

export default ProgressControl;
