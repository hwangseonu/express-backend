const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwt;
const User = require('../models/user');

module.exports = (type) => async function (req, res, next) {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({message: 'please authorize to access this resource'});
  }

  try {
    token = await token.replace('Bearer', '').trim();
    const decoded = await jwt.verify(token, secret, {subject: type});
    const user = await User.findOne({username: decoded.username});
    if (!user) {
      throw new Error('Could not find user');
    }
    req.user = user;
    if (type === 'refresh') {
      req.token_exp = decoded.exp;
    }
    next();
  } catch (error) {
    res.status(422).json(error);
  }
};
