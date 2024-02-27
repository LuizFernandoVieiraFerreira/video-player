'use client';

import React, { useState, Fragment } from 'react';

import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import Playlist from './components/Playlist';

export default function Home() {
  const videos = [
    { name: 'Big Buck Bunny [HD] Animation Short Film [HLS]', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { name: 'Kids Football Training Session (South Korea) [HLS]', url: 'https://storage.googleapis.com/bepro-server-storage/videos/tmp/stitching/69598-012400/playlist.m3u8' },
    { name: 'Kids Football Training Session (South Korea) [MP4]', url: 'https://storage.googleapis.com/bepro-server-storage/videos/stitching/2022-09-21/69598-012400.mp4' },
  ];

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const handleSelectVideo = (videoIndex) => {
    setSelectedVideoIndex(videoIndex);
  };

  const handleVideoEnd = () => {
    setSelectedVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <Fragment>
      <div className="grid">
        <header>
          <h1 className="title">Bepro</h1>
          <Playlist
            videos={videos}
            selectedVideoIndex={selectedVideoIndex}
            onSelectVideo={handleSelectVideo}
          />
        </header>
        <main>
          <VideoPlayer videoUrl={videos[selectedVideoIndex].url} onEnded={handleVideoEnd} />
        </main>
      </div>
      <aside>
        <p>Custom Video Player ⚽️</p>
      </aside>
    </Fragment>
  );
}
