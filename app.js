const express = require('express');
const logger = require('morgan');
const connect = require('./models');

const userRouter = require('./routes/users');

const app = express();
connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);

module.exports = app;
