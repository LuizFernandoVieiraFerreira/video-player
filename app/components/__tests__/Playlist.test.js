import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Playlist from '../Playlist';

const videos = [
  { name: 'Video 1', url: 'http://example.com/video1.mp4' },
  { name: 'Video 2', url: 'http://example.com/video2.mp4' },
];

test('renders Playlist component', () => { 
  const { getByText } = render(
    <Playlist videos={videos} selectedVideoIndex={0} onSelectVideo={() => {}} />
  );

  expect(getByText('Video 1')).toBeInTheDocument();
  expect(getByText('Video 2')).toBeInTheDocument();
});

test('calls onSelectVideo when a playlist item is clicked', () => {
  const onSelectVideo = jest.fn();

  const { getByText } = render(
    <Playlist videos={videos} selectedVideoIndex={0} onSelectVideo={onSelectVideo} />
  );

  fireEvent.click(getByText('Video 2'));

  expect(onSelectVideo).toHaveBeenCalledWith(1);
});
