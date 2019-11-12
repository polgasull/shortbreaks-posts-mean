const express = require('express');
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
});

module.exports = router;