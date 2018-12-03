const mongoose = require('mongoose');

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://localhost:27017', {
      dbName: 'express',
      useNewUrlParser: true,
      useCreateIndex: true
    }, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('mongodb connected');
      }
    });
  };
  connect();
  mongoose.connection.on('error', (error) => {
    console.error(error);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('mongodb disconnected');
    connect();
  });
  require('./user');
};
