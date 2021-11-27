const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error: '));
db.once('open', () => {
  console.log('mongoDB successfully connected');
});

const schema = new mongoose.Schema({
  imagePath: String,
  labels: String
});

const ImageModel = mongoose.model('ImageModel', schema);

const save = (data, cb) => {
  const image = new ImageModel({
    imagePath: data[0],
    labels: data[1]
  });

  ImageModel.findOne({imagePath: data[0]}, (err, savedImage) => {
    if (err) {
      return console.error(err);
    }
    if (!savedImage) {
      image.save((err, image) => {
        if (err) {
          return console.error(err);
        }
        cb();
      });
    }
  });
};

const get = (cb) => {
  ImageModel.find({}, (err, images) => {
    if (err) {
      console.error(err);
    }
    cb(images);
  });
}

const clear = () => {
  return ImageModel.deleteMany({});
}

module.exports = {
  save,
  get,
  clear
};