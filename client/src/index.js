import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ThumbnailModal from './ThumbnailModal';

import './style.css';

const randomPoetry = ['the', 'and', 'which', 'is', 'suddenly', 'almost', 'into', 'finally', 'intense', 'not', 'all', 'much', 'very', 'this', 'sleeps', 'talks', '...', '...?', '—', 'then', 'we', "don't", 'but', "can't", 'tells', 'unless', 'one', 'with', 'or', 'but', 'did', '...!', 'then', 'also', 'to', 'towards', 'went', 'wants', 'until', 'and', 'and', 'a', 'a', 'an', 'is', 'between', 'is like', 'decides', 'cannot wait until', 'certainly', 'is unlikely to', 'turns into', 'becomes', 'mimics', 'increases', 'gathers', 'predicts', '—', '-', 'is very', 'is like', 'hates', 'loves'];

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [displayedImage, setDisplayedImage] = useState('');

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    axios.get('/images')
      .then(res => {
        let imagePathArr = [];
        let labelsArr = [];

        res.data.forEach(image => {
          imagePathArr.push(image.imagePath);
          labelsArr.push(image.labels);
        })

        let poetryLabelArr = [];

        labelsArr.forEach((label) => {
          let splitLabel = label.split('\n');

          for (let i = 1; i < splitLabel.length; i += 3) {
            let randomIndex = Math.floor(Math.random() * randomPoetry.length);
            splitLabel.splice(i, 0, randomPoetry[randomIndex]);
          }

          let newLabel = splitLabel.join(' ');
          poetryLabelArr.push(newLabel);
        });

        setPhotos(imagePathArr);
        setLabels(poetryLabelArr);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleUpload = (e) => {
    const data = new FormData();
    data.append('file', e.target.files[0]);

    axios.post('/images', data)
      .then(res => {
        getImages();
      })
      .catch(err => {
        console.error(err)
      });
  };

  const openThumbnail = (e) => {
    const displayedImage = e.target.getAttribute('src');
    document.getElementsByTagName('body')[0].setAttribute('style', 'overflow-y: hidden');

    setDisplayedImage(displayedImage);

    let modal = document.querySelector('.modal-thumbnail');
    modal.style.display = 'block';

    const closeButton = document.querySelector('.modal-thumbnail .close-btn');

    closeButton.onclick = () => {
      modal.style.display = 'none';
      document.getElementsByTagName('body')[0].removeAttribute('style', 'overflow-y: hidden');
    };

    window.onclick = (e) => {
      if (e.target === modal || e.target.className === 'thumbnail-content') {
        modal.style.display = 'none';
      }
    };
  };

  const clearImages = () => {
    axios.get('/clear')
      .then(() => {
        getImages();
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div id="wrapper">
      <h1 id="title">Picture to Poetry Converter</h1>
      <label className="custom-file-upload">
        <input type="file" name="file" onChange={handleUpload}/>
        Click here to upload an image
      </label>
      <button id="make-new-poem" onClick={getImages}>Generate a new poem!</button>
      <button id="clear-images" onClick={clearImages}>Clear all images</button>
      <div id="display">
        <div id="image-wrapper">
          {photos.map(photo => (
            <img key={photo} src={photo} width="130px" height="130px" onClick={openThumbnail} className="gallery-image"/>
          ))}
        </div>
      {labels.map(label => (
        <div key={label} className="text">{label}</div>
      ))}
      </div>
      <ThumbnailModal photo={displayedImage}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));