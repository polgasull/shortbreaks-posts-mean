require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// models
const Post = require('./models/post')

// controllers
const posts = require('./routes/posts');
const users = require('./routes/users');

if ( process.env.NODE_ENV === 'development' ) {
  mongoose.connect(process.env.LOCALDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to local db!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });
} else {
  mongoose.connect("mongodb+srv://db_escapadas:" + process.env.MONGODB_URI + "@cluster0-f72fw.mongodb.net/escapadas", 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to production db!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if ( process.env.NODE_ENV === 'development' ) {
  app.use("/images", express.static(path.join("./backend/images")));
} else {
  app.use("/images", express.static(path.join("images")));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//routes

app.use('/api/posts', posts)
app.use('/api/users', users)

module.exports = app;