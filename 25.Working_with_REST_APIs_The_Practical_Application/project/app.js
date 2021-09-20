const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/feed', feedRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('CONNECTED!!!');
    app.listen(8080);
  })
  .catch(err => console.log(err));
