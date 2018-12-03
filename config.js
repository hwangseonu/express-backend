module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'my-secret',
    access_exp: '2h',
    refresh_exp: '30d'
  }
};
