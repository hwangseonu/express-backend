module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'my-secret',
    access_expiration: '2h',
    refresh_expiration: '30d'
  }
};
