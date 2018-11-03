const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  nickname: String,
  email: String
}, {
  versionKey: false
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;