const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: "User not found. Auth failed!"
        })
      }
      return bcrypt.compare(req.body.password, req.user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Auth failed"
      })
    });
})

module.exports = router;