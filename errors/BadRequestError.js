const ApplicationError = require('../errors/ApplicationError');

module.exports = class BadRequestError extends ApplicationError {
  constructor(message) {
    super(message || 'Bad Request', 400);
  }
};
