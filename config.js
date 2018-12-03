module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'my-secret',
    access_expiration: 640000,
    refresh_expiration: 640000
  }
};
