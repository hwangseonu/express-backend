const express = require('express');
const logger = require('morgan');
const connect = require('./models');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/auth', authRouter);

module.exports = app;
