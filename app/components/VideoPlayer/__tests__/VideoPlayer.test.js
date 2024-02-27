import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import VideoPlayer from '../VideoPlayer';
import {
  PlayPauseButton,
  ProgressControl,
  VolumeControl,
  SettingsButton,
  FullScreenButton,
 } from '../controls';

 Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  get() {
    const original = jest.fn();
    return original;
  },
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  get() {
    const original = jest.fn();
    return original;
  },
});

test('renders VideoPlayer component', () => { 
  const { getByTestId } = render(
    <VideoPlayer videoUrl="http://example.com/video.mp4" onEnded={() => {}} />
  );

  expect(getByTestId('video-player')).toBeInTheDocument();
});

test('toggles play/pause when play button is clicked', () => {
  const togglePlayPause = jest.fn();

  const { getByTestId, rerender } = render(
    <PlayPauseButton isPlaying={false} togglePlayPause={togglePlayPause} />
  );

  const playButton = getByTestId('play-pause-button');

  expect(playButton).toBeInTheDocument();
  expect(playButton.querySelector('img')).toHaveAttribute('src', '/play.svg');
  
  fireEvent.click(playButton);

  expect(togglePlayPause).toHaveBeenCalledTimes(1);

  rerender(
    <PlayPauseButton isPlaying={true} togglePlayPause={togglePlayPause} />
  );

  expect(playButton.querySelector('img')).toHaveAttribute('src', '/pause.svg');

  fireEvent.click(playButton);

  expect(togglePlayPause).toHaveBeenCalledTimes(2);
});

test('seeks within the video when the progress bar is clicked', () => {
  const handleSeek = jest.fn();

  const { getByTestId } = render(
    <ProgressControl
      currentTime={0}
      duration={100}
      percentageSeen={0}
      handleSeek={handleSeek}
    />
  );

  const progressBar = getByTestId('progress-bar');

  fireEvent.change(progressBar, { target: { value: 50 } });

  expect(handleSeek).toHaveBeenCalledTimes(1);
  expect(handleSeek).toHaveBeenCalledWith('50');
});

test('toggles mute when volume button is clicked', () => {
  const toggleMute = jest.fn();

  const { getByTestId, rerender } = render(
    <VolumeControl isMuted={false} volume={0.5} toggleMute={toggleMute} handleVolumeChange={() => {}} />
  );

  const volumeButton = getByTestId('volume-button');

  expect(volumeButton).toBeInTheDocument();
  expect(volumeButton.querySelector('img')).toHaveAttribute('src', '/volume.svg');

  fireEvent.click(volumeButton);

  expect(toggleMute).toHaveBeenCalledTimes(1);

  rerender(
    <VolumeControl isMuted={true} volume={0} toggleMute={toggleMute} handleVolumeChange={() => {}} />
  );

  expect(volumeButton.querySelector('img')).toHaveAttribute('src', '/muted.svg');

  fireEvent.click(volumeButton);

  expect(toggleMute).toHaveBeenCalledTimes(2);
});

test('toggles settings button when settings button is clicked and type is m3u8', () => {
  const handleQualityChange = jest.fn();
  const toggleSettings = jest.fn();

  const { getByTestId, getByLabelText, rerender } = render(
    <SettingsButton
      isSettingsOpen={false}
      type="m3u8"
      selectedQuality={{ height: '720' }}
      hls={{
        levels: [
          { height: '720' },
          { height: '1080' },
        ],
      }}
      handleQualityChange={handleQualityChange}
      toggleSettings={toggleSettings}
    />
  );

  const settingsButton = getByTestId('settings-button');
  
  fireEvent.click(settingsButton);

  expect(toggleSettings).toHaveBeenCalledTimes(1);

  rerender(
    <SettingsButton
      isSettingsOpen={true}
      type="m3u8"
      selectedQuality={{ height: '720' }}
      hls={{
        levels: [
          { height: '720' },
          { height: '1080' },
        ],
      }}
      handleQualityChange={handleQualityChange}
      toggleSettings={toggleSettings}
    />
  );

  expect(getByLabelText('720p')).toBeInTheDocument();
  expect(getByLabelText('1080p')).toBeInTheDocument();
});

test('toggles settings button when settings button is clicked and type is not m3u8', () => {
  const toggleSettings = jest.fn();
  const { getByTestId, getByText, queryByLabelText } = render(
    <SettingsButton
      isSettingsOpen={true}
      type="mp4"
      selectedQuality={null}
      hls={null}
      handleQualityChange={() => {}}
      toggleSettings={toggleSettings}
    />
  );

  const settingsButton = getByTestId('settings-button');

  fireEvent.click(settingsButton);

  expect(toggleSettings).toHaveBeenCalledTimes(1);
  expect(getByText('Only one resolution available')).toBeInTheDocument();
  expect(queryByLabelText('Quality')).toBeNull();
});

test('changes video quality when a different quality option is selected', () => {
  const handleQualityChange = jest.fn();

  const { getByLabelText } = render(
    <SettingsButton
      isSettingsOpen={true}
      type="m3u8"
      selectedQuality={{ height: '720' }}
      hls={{
        levels: [
          { height: '720' },
          { height: '1080' },
        ],
      }}
      handleQualityChange={handleQualityChange}
      toggleSettings={() => {}}
    />
  );

  const qualityOption1080p = getByLabelText('1080p');

  fireEvent.click(qualityOption1080p);

  expect(handleQualityChange).toHaveBeenCalledTimes(1);
  expect(handleQualityChange).toHaveBeenCalledWith(1);
});

test('toggles fullscreen when fullscreen button is clicked', () => {
  const toggleFullScreen = jest.fn();

  const { getByTestId, rerender } = render(
    <FullScreenButton isFullScreen={false} toggleFullScreen={toggleFullScreen} />
  );

  const fullScreenButton = getByTestId('full-screen-button');

  expect(fullScreenButton).toBeInTheDocument();
  expect(fullScreenButton.querySelector('img')).toHaveAttribute('src', '/enter-fullscreen.svg');

  fireEvent.click(fullScreenButton);

  expect(toggleFullScreen).toHaveBeenCalledTimes(1);

  rerender(
    <FullScreenButton isFullScreen={true} toggleFullScreen={toggleFullScreen} />
  );

  expect(fullScreenButton.querySelector('img')).toHaveAttribute('src', '/exit-fullscreen.svg');

  fireEvent.click(fullScreenButton);

  expect(toggleFullScreen).toHaveBeenCalledTimes(2);
});
