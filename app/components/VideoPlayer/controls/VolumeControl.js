import React from 'react';

const VolumeControl = ({ isMuted, volume, toggleMute, handleVolumeChange }) => {
  return (
    <div className="volume-control">
      <button onClick={toggleMute} data-testid="volume-button">
        <img src={isMuted ? "/muted.svg" : "/volume.svg"} alt="Volume Icon" />
      </button>
      <div className="volume-bar">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(e.target.value)}
          style={{ background: `linear-gradient(to right, #796fc1 0%, #796fc1 ${volume * 100}%, rgba(0, 0, 0, 0.1) ${volume * 100}%, rgba(0, 0, 0, 0.1) 100%)` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
