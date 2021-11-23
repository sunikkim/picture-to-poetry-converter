import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import ThumbnailModal from './ThumbnailModal';

const port = process.env.PORT || 5000;

const randomPoetry = ['the', 'and', 'which', 'is', 'suddenly', 'almost', 'into', 'finally', 'intense', 'not', 'all', 'much', 'very', 'this', 'sleeps', 'talks', '...', '...?', '—', '(', ')', 'then', 'we', "don't", 'but', "can't", 'tells', 'unless', 'one', 'with', 'or', 'but', 'did', '...!', 'then', 'also', 'to', 'towards', 'went', 'wants', 'until', 'and', 'and', 'a', 'a', 'an', 'is', 'between', 'is like', 'decides', 'cannot wait until', 'certainly', 'is unlikely to', 'turns into', 'becomes', 'mimics', 'increases', 'gathers', 'predicts', '—', '-', 'is very', 'is like', 'hates', 'loves'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      labels: [],
      displayedImage: ''
    };

    this.uploadHandler = this.uploadHandler.bind(this);
    this.getImages = this.getImages.bind(this);
    this.openThumbnail = this.openThumbnail.bind(this);
  }

  componentDidMount() {
    this.getImages();
  }

  getImages() {
    axios.get(`http://localhost:${port}/images`)
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

        this.setState({
          photos: imagePathArr,
          labels: poetryLabelArr
        });
      });
  }

  uploadHandler(e) {
    const data = new FormData();
    data.append('file', e.target.files[0]);

    axios.post(`http://localhost:${port}/images`, data)
      .then((res) => {
        this.getImages();
      });
  }

  openThumbnail(e) {
    const displayedImage = e.target.getAttribute('src');

    document.getElementsByTagName('body')[0].setAttribute('style', 'overflow-y: hidden');

    this.setState({
      displayedImage
    });

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
  }

  render(){
    return(
      <div id="wrapper">
        <h1 id="title">Picture to Poetry Converter</h1>
        <div id="upload-image-here">Upload an image here:</div>
        <input type="file" name="file" onChange={this.uploadHandler}/>
        <div id="display">
          <div id="image-wrapper">
            {this.state.photos.map(photo => (
              <img key={photo} src={`http://localhost:${port}/photos/${photo}`} width="120px" height="120px" onClick={this.openThumbnail} className="gallery-image"/>
            ))}
          </div>
        {this.state.labels.map(label => (
          <div key={label} className="text">{label}</div>
        ))}
        </div>
        <ThumbnailModal photo={this.state.displayedImage}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));