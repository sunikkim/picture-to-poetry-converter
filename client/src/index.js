import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ThumbnailModal from './ThumbnailModal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import './style.css';

const randomPoetry = ['the', 'and', 'which', 'is', 'suddenly', 'almost', 'into', 'finally', 'intense', 'not', 'all', 'much', 'very', 'this', 'sleeps', 'talks', '...', '...?', '—', 'then', 'we', "don't", 'but', "can't", 'tells', 'unless', 'one', 'with', 'or', 'but', 'did', '...!', 'then', 'also', 'to', 'towards', 'went', 'wants', 'until', 'and', 'and', 'a', 'a', 'an', 'is', 'between', 'is like', 'decides', 'cannot wait until', 'certainly', 'is unlikely to', 'turns into', 'becomes', 'mimics', 'increases', 'gathers', 'predicts', '—', '-', 'is very', 'is like', 'hates', 'loves', 'silently', 'cautiously', 'quickly', 'slowly', 'like it was', 'almost as if', 'and suddenly', 'it was miraculous', 'dancing like', 'and then', 'I stopped before', 'I found myself', 'you were', 'immense', 'one by one', 'made a sound', 'carefully', 'a delightful', 'messily', 'leapt', 'ran over', 'the sun', 'the moon', 'hushed', 'force'];

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [labels, setLabels] = useState([]);
  const [displayedImage, setDisplayedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [stanzaLength, setStanzaLength] = useState(200);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    axios.get('/images')
      .then(res => {
        let imagePathArr = [];
        let labelsArr = [];

        res.data.forEach(image => {
          imagePathArr.push(image);
          labelsArr.push(image.labels);
        });

        let poetryLabelArr = [];

        labelsArr.forEach((label) => {
          let splitLabel = label.split('\n');
          let randomStep = Math.floor(Math.random() * 10) + 1;
          let newLabel = [];

          for (let i = 1; i < stanzaLength; i += randomStep) {
            let randomIndex = Math.floor(Math.random() * randomPoetry.length);
            let labelIndex = Math.floor(Math.random() * splitLabel.length);

            if (i % 2 === 0) {
               newLabel.push(splitLabel[labelIndex]);
            } else {
               newLabel.push(randomPoetry[randomIndex]);
            }

            randomStep = Math.floor(Math.random() * 5) + 1;
          }

          newLabel = newLabel.join(' ');
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

    if (!e.target.files[0]) {
      return;
    }

    setLoading(true);

    axios.post('/images', data)
      .then((response) => {
        setLoading(false);

        if (response.data === 'You may only upload images!') {
          alert(response.data);
          return;
        }
        getImages();
      })
      .catch(err => {
        console.error(err);
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

  const deleteImage = (e) => {
    const imageId = e.target.id;

    axios.put('/images', { imageId })
      .then(() => {
        getImages();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleStanzaLength = (e) => {
    const length = e.target.value;
    setStanzaLength(length);
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      getImages();
    }
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
      <label id="stanza-length">
        <div id="stanza-label">Set stanza length (1 - ∞):</div>
        <input id="stanza-input" name="stanza-input" type="number" onChange={handleStanzaLength} onKeyPress={handleEnterPress}/>
      </label>
      <div></div>
      {loading && <div id="generating">Generating poetry...</div>}
      <div id="display">
        <div id="image-wrapper">
          {photos.map((photo, i) => (
            <img key={photo._id + i} id={photo._id} src={photo.imagePath} width="150px" height="150px" onClick={deleteImage} className="gallery-image"/>
          ))}
        </div>
        {labels.map((label, i) => (
          <div key={label + i} className="text">{label}</div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));