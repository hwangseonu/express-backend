const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const user = require('./routes/user');
const auth = require('./routes/auth');

const path = require('path');
const config = require('./config');

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const port = process.env.port || 3000;
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('jwt-secret', config["jwt-secret"]);

app.use('/users', user);
app.use('/auth', auth);

const server = http.createServer(app);
server.listen(port, () => console.log(`server is running on port ${port}`));

mongoose.connect(config["mongodb-uri"], {useNewUrlParser: true}).catch(error => console.log(error.message));
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => console.log('connected to mongodb server'));