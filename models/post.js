const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  writer: { type: Schema.Types.username, ref: 'User'},
  content: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
  writer: { type: Schema.Types.username, ref: 'User' },
  title: String,
  content: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  comments: [commentSchema]
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;