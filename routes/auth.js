const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const authMiddleware = require('../middlewares/auth');
const jsonMiddleware = require('../middlewares/json');
const config = require('../config');
const User = require('../models/user');

const router = express.Router();

router.post('/', jsonMiddleware({username: 'string', password: 'string'}));
router.post('/', (req, res) => {
  const { username, password } = req.body;
  const secret = config.jwt.secret;

  User.findOne({username: username})
    .then(user => {
      if (!user) {
        throw new Error('Could not find user')
      } else {
        return new Promise((resolve, reject) => {
          if (!user.verify(password)) {
            reject(new Error('incorrect password'))
          }
          Promise.all([generateToken(username, 'access', secret), generateToken(username, 'refresh', secret)]).then(values => {
            resolve({access: values[0], refresh: values[1]});
          }).catch(error => {
            reject(error)
          })
        });
      }
    })
    .then(tokens => {
      res.json(tokens)
    })
    .catch(error => {
      res.status(401).json({message: error.message})
    });
});

router.get('/refresh', authMiddleware('refresh'));
router.get('/refresh', (req, res) => {
  const secret = config.jwt.secret;
  Promise.all([generateToken(req.user.username, 'access', secret), generateToken(req.user.username, 'refresh', secret)])
    .then(values => {
      let data = {access: values[0]};
      if (req.token_expiration - moment().unix() < 604800) {
        data.refresh = values[1];
      }
      res.json(data);
    })
});

const generateToken = (username, type) => {
  const secret = config.jwt.secret;
  return new Promise((resolve1, reject1) => jwt.sign(
    {
      username: username,
    },
    secret,
    {
      expiresIn: config.jwt[type].expiration,
      subject: type
    }, (err, token) => {
      if (err) reject1(err);
      resolve1(token);
    }
  ));
};

module.exports = router;