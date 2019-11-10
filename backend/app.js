require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// models
const Post = require('./models/post')

// controllers
const posts = require('./routes/posts');

mongoose.connect(
  process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Connected to the db!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//routes

app.use('/api/posts', posts)

module.exports = app;