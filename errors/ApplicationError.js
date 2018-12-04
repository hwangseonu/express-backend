module.exports = class ApplicationError extends Error {
  constructor(message, status) {
    super();
    this.name = this.constructor.name;
    this.message = message || 'something went wrong';
    this.status = status || 500;
  }
};
