import React from 'react';

const ThumbnailModal = (props) => {
  return (
    <div className="modal-thumbnail">
      <div className="thumbnail-content">
        <span className="close-btn">&times;</span>
        <img src={props.photo}></img>
      </div>
    </div>
  );
};

export default ThumbnailModal;