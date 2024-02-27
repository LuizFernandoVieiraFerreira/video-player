import React from 'react';

const PlayPauseButton = ({ isPlaying, togglePlayPause }) => {
  return (
    <button onClick={togglePlayPause} data-testid="play-pause-button">
      <img
        src={isPlaying ? "/pause.svg" : "/play.svg"}
        alt={isPlaying ? "Pause Icon" : "Play Icon"}
      />
    </button>
  );
};

export default PlayPauseButton;
