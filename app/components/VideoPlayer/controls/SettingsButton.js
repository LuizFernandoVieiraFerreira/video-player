import React from 'react';

const SettingsButton = ({ isSettingsOpen, type, selectedQuality, hls, handleQualityChange, toggleSettings }) => {
  const renderSettingsMenu = () => {
    if (isSettingsOpen) {
      if (type === 'm3u8' && selectedQuality && hls.levels.length > 1) {
        const selectedQualityIndex = hls.levels.findIndex(level => level.height === selectedQuality.height);
        return (
          <div className="settings-menu">
            <p>Quality</p>
            <hr />
            {hls && hls.levels.map((quality, index) => (
              <div key={index} className="menu-row">
                <input
                  type="radio"
                  id={`quality${index}`}
                  name="quality"
                  value={index}
                  checked={index === selectedQualityIndex}
                  onChange={() => handleQualityChange(index)}
                />
                <label htmlFor={`quality${index}`}>{`${quality.height}p`}</label>
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="settings-menu">
          <p>Only one resolution available</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="settings-control">
      <button onClick={toggleSettings} data-testid="settings-button">
        <img src="/settings.svg" alt="Settings Icon" />
      </button>
      {renderSettingsMenu()}
    </div>
  );
};

export default SettingsButton;
