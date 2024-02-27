import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

import {
  PlayPauseButton,
  ProgressControl,
  VolumeControl,
  SettingsButton,
  PictureInPictureButton,
  FullScreenButton,
} from './controls';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, onEnded }) => {
  const videoRef = useRef(null);
  const videoPlayerWrapperRef = useRef(null);

  const [hls, setHls] = useState(null);
  const [type, setType] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [percentageSeen, setPercentageSeen] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePlayPause = () => {
    if (!hasPlayed) {
      setHasPlayed(true);
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
    if (newMuteState) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const togglePiP = async () => {
    try {
      if (!isPiP) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current.requestFullscreen) {
        videoPlayerWrapperRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
        videoPlayerWrapperRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
        videoPlayerWrapperRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const videoType = videoUrl.endsWith('.m3u8') ? 'm3u8' : 'other';
    setType(videoType);

    if (videoType === 'm3u8' && Hls.isSupported()) {
      const hlsInstance = new Hls();
      setHls(hlsInstance);
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(videoRef.current);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hlsInstance.levels.map((level) => ({
          height: level.height,
          label: `${level.height}p`,
        }));
        setSelectedQuality(availableQualities[availableQualities.length-1]);
      });
      return () => {
        hlsInstance.destroy();
      };
    } else {
      videoRef.current.src = videoUrl;
    }
  }, [videoUrl]);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setTimeRemaining(video.duration - video.currentTime);
      const newPercentageSeen = (video.currentTime /video.duration) * 100;
      setPercentageSeen(newPercentageSeen);
    };
    video.addEventListener('timeupdate', updateTime);
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
  
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleSeeking = () => {
      setIsSeeking(true);
    };
  
    const handleSeeked = () => {
      setIsSeeking(false);
    };
  
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);
    
    return () => {
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement);
    };

    document.addEventListener('fullscreenchange', handlePiPChange);
    document.addEventListener('webkitfullscreenchange', handlePiPChange);
    document.addEventListener('msfullscreenchange', handlePiPChange);

    return () => {
      document.removeEventListener('fullscreenchange', handlePiPChange);
      document.removeEventListener('webkitfullscreenchange', handlePiPChange);
      document.removeEventListener('msfullscreenchange', handlePiPChange);
    };
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleVideoClick = (e) => {
    if (e.target.nodeName == 'VIDEO') {
      togglePlayPause();
    }
  };

  const handleSeek = (time) => {
    if (hls) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = parseFloat(value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleQualityChange = (index) => {
    setSelectedQuality(hls.levels[index]);
    setIsSettingsOpen(false);
    hls.currentLevel = index;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={videoPlayerWrapperRef}
      className="video-player-wrapper"
      onClick={handleVideoClick}
      data-testid="video-player"
    >
      {(isLoading || isSeeking) && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      <video ref={videoRef} className="video-player" onEnded={onEnded} autoPlay={hasPlayed} />
      <div className="controls">
        <PlayPauseButton isPlaying={isPlaying} togglePlayPause={togglePlayPause} />
        <ProgressControl
          currentTime={currentTime}
          duration={duration}
          percentageSeen={percentageSeen}
          handleSeek={handleSeek}
        />
        <div className="time-remaining">
          -{isNaN(duration) ? "00:00" : formatTime(timeRemaining)}
        </div>
        <VolumeControl
          isMuted={isMuted}
          volume={volume}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
        />
        <SettingsButton
          isSettingsOpen={isSettingsOpen}
          type={type}
          selectedQuality={selectedQuality}
          hls={hls}
          handleQualityChange={handleQualityChange}
          toggleSettings={toggleSettings}
        />
        <PictureInPictureButton togglePiP={togglePiP} />
        <FullScreenButton isFullScreen={isFullScreen} toggleFullScreen={toggleFullScreen} />
      </div>
      {!isPlaying && !isLoading && !isSeeking && (
        <div className="circular-play-button-wrapper" onClick={togglePlayPause}>
          <button className="circular-play-button">
            <img src="/play.svg" alt="Play Icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
