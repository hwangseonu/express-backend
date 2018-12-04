const ApplicationError = require('../errors/ApplicationError');

module.exports = class ConflictError extends ApplicationError {
  constructor(message) {
    super(message || 'Conflict', 409);
  }
};
