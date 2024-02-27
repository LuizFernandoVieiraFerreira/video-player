import React from 'react';

const FullScreenButton = ({ isFullScreen, toggleFullScreen }) => {
  return (
    <button onClick={toggleFullScreen} data-testid="full-screen-button">
      <img
        src={isFullScreen ? "/exit-fullscreen.svg" : "/enter-fullscreen.svg"}
        alt={isFullScreen ? "Exit Fullscreen Icon" : "Enter Fullscreen Icon"}
      />
    </button>
  );
};

export default FullScreenButton;
