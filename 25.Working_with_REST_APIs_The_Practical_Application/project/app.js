const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;
const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, 'images');
  },
  filename: (req, file, fn) => {
    fn(null, Date.now().toString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

app.use(bodyParser.json());
app.use(multer({
  storage: fileStorage,
  fileFilter,
}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
})

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('CONNECTED!!!');
    app.listen(8080);
  })
  .catch(err => console.log(err));
