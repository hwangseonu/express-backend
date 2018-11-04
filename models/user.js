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

userSchema.statics.create = function (username, password, nickname, email) {
  return new this({
    username: username,
    password: password,
    nickname: nickname,
    email: email
  }).save()
};

userSchema.statics.findByUsername = function (username) {
  return this.findOne({username: username});
};

userSchema.methods.verify = function (password) {
  return this.password === password;
};

module.exports = mongoose.model('User', userSchema);