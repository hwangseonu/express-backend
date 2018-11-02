const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');
const jsonMiddleware = require('../middlewares/json');
const crypto = require('crypto');
const config = require('../config');
const User = require('../models/user');

const router = express.Router();

router.post('/', jsonMiddleware({username: 'string', password: 'string'}));
router.post('/', (req, res) => {
  const {username, password} = req.body;
  const encrypted = crypto.createHmac('sha512', config["password-secret"]).update(password).digest('base64');
  const secret = config.jwt.secret;

  User.findOne({username: username})
    .then(user => {
      if (!user) {
        throw new Error('Could not find user')
      } else {
        return new Promise((resolve, reject) => {

          if (user.password !== encrypted) {
            reject(new Error('incorrect password'))
          }

          const access = new Promise((resolve1, reject1) =>  jwt.sign(
            {
              username: user.username,
            },
            secret,
            {
              expiresIn: config.jwt["access-expire"],
              subject: 'access'
            },  (err, token) => {
              if (err) reject1(err);
              resolve1(token);
            }
          ));
          const refresh = new Promise((resolve1, reject1) => jwt.sign(
            {
              username: user.username
            },
            secret,
            {
              expiresIn: config.jwt["refresh-expire"],
              subject: 'refresh'
            },  (err, token) => {
              if (err) reject1(err);
              resolve1(token);
            }
          ));

          Promise.all([access, refresh]).then(values => {
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
  jwt.sign(
    {
      username: req.user.username
    },
    secret,
    {
      expiresIn: config.jwt["access-expire"],
      subject: 'access'
    }, (err, token) => {
      if (err) {
        res.status(422).json({message: err.message})
      } else {
        res.json({
          access: token
        })
      }
    })
});

module.exports = router;