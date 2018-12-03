const express = require('express');
const auth_required = require('../middlewares/auth_required');
const User = require('../models/user');
const router = express.Router();

const json_required = require('../middlewares/json_required');

router.post('/verify/:key', async function (req, res, next) {
  const key = req.params.key;
  const value = req.body[key];
  const q = {};
  q[key] = value;
  const user = await User.findOne(q);
  res.status(user ? 409 : 200).send();
  next()
});

router.post('/', json_required({username: 'string', password: 'string', nickname: 'string', email: 'string'}));
router.post('/', async function (req, res, next) {
  const {username, password, nickname, email} = req.body;
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
    next()
  } catch (error) {
    res.status(409).json(error)
  }
});

router.get('/', auth_required('access'));
router.get('/', function (req, res, next) {
  res.json({
    username: req.user.username,
    nickname: req.user.nickname,
    email: req.user.email
  });
  next();
});

module.exports = router;
