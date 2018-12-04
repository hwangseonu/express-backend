const ApplicationError = require('./ApplicationError');

module.exports = class UnprocessableEntityError extends ApplicationError {
  constructor(message) {
    super(message || 'This entity is unprocessable', 422);
  }

};
