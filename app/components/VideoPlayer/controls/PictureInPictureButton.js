import React from 'react';

const PictureInPictureButton = ({ togglePiP }) => {
  return (
    <button onClick={togglePiP} data-testid="pip-button">
      <img src="/pip.svg" alt="PIP Icon" />
    </button>
  );
};

export default PictureInPictureButton;
