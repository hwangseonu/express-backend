const ApplicationError = require('../errors/ApplicationError');

module.exports = class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
};
