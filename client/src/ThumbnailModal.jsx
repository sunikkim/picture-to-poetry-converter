import React from 'react';

const ThumbnailModal = ({ photo }) => {
  return (
    <div className="modal-thumbnail">
      <div className="thumbnail-content">
        <span className="close-btn">&times;</span>
        <img src={photo}></img>
      </div>
    </div>
  );
};

export default ThumbnailModal;