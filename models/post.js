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

postSchema.statics.create = function(author, title, content) {
  return new this({
    author: author,
    title: title,
    content: content,
    comments: []
  }).save()
};

postSchema.statics.findById = function(id) {
  return this.findOne({_id: id})
};

postSchema.methods.addComment = function(author, content) {
  this.comments.push({
    author: author,
    content: content
  });
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);