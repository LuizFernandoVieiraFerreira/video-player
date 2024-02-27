import React from 'react';

import './Playlist.css';

const Playlist = ({ videos, selectedVideoIndex, onSelectVideo }) => {
  return (
    <div className="playlist-wrapper">
      <ul className="playlist">
        {videos.map((video, index) => (
          <li
            key={index}
            onClick={() => onSelectVideo(index)}
            className="playlist-item"
          >
            <div className="thumb">
              <div className="fluid-ratio-wrap">
                <div className="fluid-ratio-inner"></div>
              </div>
            </div>
            <div className={`details ${index === selectedVideoIndex ? 'selected' : ''}`}>
              {video.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
