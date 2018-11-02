const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', (req, res) => {
  const { username, password, nickname, email } = req.body;

  User.findOne({username: username})
    .then(user => {
      if (user) {
        throw new Error('username already exists!');
      }
      else {
        new User({
          username: username,
          password: password,
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

router.get('/', authMiddleware);
router.get('/', (req, res) => {
  res.json({
    username: req.user.username,
    nickname: req.user.nickname,
    email: req.user.email
  })
});

module.exports = router;

