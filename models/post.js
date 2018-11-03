const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  writer: { type: Schema.Types.ObjectId, ref: 'User'},
  content: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
}, {versionKey: false});

const postSchema = new Schema({
  writer: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  comments: [commentSchema]
}, {versionKey: false});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;