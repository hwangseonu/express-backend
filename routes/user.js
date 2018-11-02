const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const config = require('../config');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', (req, res) => {
  const { username, password, nickname, email } = req.body;
  const encrypted = crypto.createHmac('sha512', config["password-secret"]).update(password).digest('base64');

  User.findOne({username: username})
    .then(user => {
      if (user) {
        throw new Error('username already exists!');
      }
      else {
        new User({
          username: username,
          password: encrypted,
          nickname: nickname,
          email: email
        }).save();
      }
    })
    .then(() => {
      res.status(201).json({message: 'Signed Up Successfully!'})
    })
    .catch(error => {
      res.status(409).json({
        message: error.message
      })
    })
});

router.get('/', authMiddleware('access'));
router.get('/', (req, res) => {
  res.json({
    username: req.user.username,
    nickname: req.user.nickname,
    email: req.user.email
  })
});

module.exports = router;

