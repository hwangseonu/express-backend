const jwt = require('jsonwebtoken');
const User = require('../models/user');

const middleware = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'please authorize to access resources'
    })
  }

  token = token.replace('Bearer ', '');

  new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    })
  })
    .then(decoded => {
      User.findOne({username: decoded.username})
        .then(user => {
          if (!user) throw Error("Could not find user");
          else {
            req.user = user;
            next();
          }
        })
    })
    .catch(error => {
      return res.status(401).json({
        message: error.message
      })
    })
};

module.exports = middleware;