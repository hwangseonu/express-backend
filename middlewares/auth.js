const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

module.exports = (type) => {
  return (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({message: 'please authorize to access resources'})
    }

    token = token.replace('Bearer ', '');

    jwt.verify(token, config.jwt.secret, {subject: type}, (error, decoded) => {
      if (error) {
        return res.status(422).json({message: error.message})
      } else {
        User.findByUsername(decoded.username)
          .then((user) => {
            if (!user) {
              throw new Error('Could not find user')
            } else {
              req.user = user;
              next();
            }
          })
          .catch((error) => {
            return res.status(422).json({message: error.message})
          })
      }
    })
  }
};