const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  nickname: { type: String, require: true },
  email: { type: String, require: true }
}, {
  versionKey: false
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;