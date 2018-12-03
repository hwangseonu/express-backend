const mongoose = require('mongoose');
const autoInrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

autoInrement.initialize(mongoose.connection);

const postSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  create_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  update_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

postSchema.plugin(autoInrement.plugin, 'Post');

module.exports = mongoose.model('Post', postSchema);
