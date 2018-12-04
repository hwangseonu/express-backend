const express = require('express');
const auth_required = require('../middlewares/auth_required');
const User = require('../models/user');
const router = express.Router();

const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

const json_required = require('../middlewares/json_required');

router.post('/verify/:key', async function (req, res, next) {
  const key = req.params.key;
  const value = req.body[key];
  const q = {};
  q[key] = value;

  if (['username', 'nickname', 'email'].indexOf(key) === -1) {
    next(new BadRequestError());
    return;
  }

  const user = await User.findOne(q);
  if (user) {
    next(new ConflictError(key + ' already exists'));
    return;
  } else {
    res.status(204).send()
  }
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
    res.status(201).json({
      username: result.username,
      nickname: result.nickname,
      email: result.email,
    });
  } catch (error) {
    next(new ConflictError('user already exists'));
    return;
  }
  next()
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
