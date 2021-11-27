require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { save, get, clear, deleteImage } = require('./database/index.js');
const imgbbUploader = require('imgbb-uploader');
const port = process.env.PORT || 8000;

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.VISION_KEY_FILEPATH //
});

const upload = multer();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/images', (req, res) => {
  get(images => {
    res.send(images);
  })
});

app.post('/images', upload.any(), async (req, res) => {
    let file = req.files[0];
    let base64string = file.buffer.toString('base64');

    let options = {
      apiKey: process.env.IMG_API_KEY,
      base64string,
    };

    let url = await imgbbUploader(options);
    url = url.image.url;

    client
      .labelDetection(url)
      .then(results => {
        const labels = results[0].labelAnnotations;
        let labelsArray = [];

        labels.forEach((label) => labelsArray.push(label.description + '\n'));

        save([url, labelsArray.join('').toLowerCase()], () => {
          res.send([req.file, labelsArray.join('').toLowerCase()]);
        });

      })
      .catch(err => {
        console.error(err);
      });
});

app.put('/images', (req, res) => {
  const imageId = req.body.imageId;

  deleteImage(imageId)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/clear', (req, res) => {
  clear()
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
