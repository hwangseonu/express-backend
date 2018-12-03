const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/', async function(req, res, next) {
  const { username, password, nickname, email } = req.body;
  const user = new User({
    username: username,
    password: password,
    nickname: nickname,
    email: email
  });
  try {
    const result = await user.save();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
