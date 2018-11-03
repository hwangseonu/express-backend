const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, require: true, ref: 'User'},
  content:  { type: String, require: true },
  createAt: { type: Date, require: true, default: Date.now },
  updateAt: { type: Date, require: true, default: Date.now }
}, {versionKey: false});

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
  title:  { type: String, require: true },
  content:  { type: String, require: true },
  createAt: { type: Date, require: true, default: Date.now },
  updateAt: { type: Date, require: true, default: Date.now },
  comments: [ commentSchema ]
}, {versionKey: false});

postSchema.plugin(autoIncrement.plugin, 'Post');
commentSchema.plugin(autoIncrement.plugin, 'Comment');

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;