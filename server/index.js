const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const save = require('../database/index.js').save;
const get = require('../database/index.js').get;
const multer = require('multer');
require('dotenv').config();

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.VISION_KEY_FILEPATH
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/photos');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage}).single('file');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/images', (req, res) => {
  get((images) => {
    res.send(images);
  })
});

app.post('/images', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    client
      .labelDetection(path.join(__dirname, '../', req.file.path))
      .then((results) => {
        const labels = results[0].labelAnnotations;
        let labelsArray = [];

        labels.forEach((label) => labelsArray.push(label.description + '\n'));

        save([req.file.filename, labelsArray.join('').toLowerCase()], () => {
          res.send([req.file, labelsArray.join('').toLowerCase()]);
        });

      })
      .catch((err) => {
        console.error(err);
      })
  });
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});