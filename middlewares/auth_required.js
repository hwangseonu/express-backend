const jwt = require('jsonwebtoken');
const {secret} = require('../config').jwt;
const User = require('../models/user');

const UnprocessableEntityError = require('../errors/UnprocessableEntityError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (type) => async function (req, res, next) {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    next(new UnauthorizedError('please authorization to access this resources'));
    return
  }
  try {
    token = await token.replace('Bearer', '').trim();
    const decoded = await jwt.verify(token, secret, {subject: type});
    const user = await User.findOne({username: decoded.username});
    if (!user) {
      throw new UnprocessableEntityError('Token is invalid');
    }
    req.user = user;
    if (type === 'refresh') {
      req.token_exp = decoded.exp;
    }
  } catch (error) {
    error = new UnprocessableEntityError(error.message);
    next(error);
  }
};
