const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');
const jsonMiddleware = require('../middlewares/json');

const router = express.Router();

router.post('/', jsonMiddleware({username: 'string', password: 'string', nickname: 'string', email: 'string'}));
router.post('/', (req, res) => {
  const { username, password, nickname, email } = req.body;
  User.findByUsername(username)
    .then((user) => {
      if (user) {
        throw new Error('User already exists')
      } else {
        return User.create(username, password, nickname, email)
      }
    })
    .then(() => {
      res.status(201).json({message: 'Signed up successfully'})
    })
    .catch((error) => {
      res.status(409).json({message: error.message})
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

