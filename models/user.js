const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  nickname: String,
  email: String
}, {
  versionKey: false
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;