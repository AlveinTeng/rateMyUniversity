/* Comment Model */
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  rating: {
    type: String,
    default: ""
  },

  author: { // user id
    type: String,
    required: true
  },

  university: { // university id
    type: String,
    default: ""
  },

  respond: { // comment id
    type: String,
    default: ""
  },

  under: { // comment id
    type: String,
    default: ""
  },

  time: {
    type: Date,
    required: true
  },

  like: {
    type: Number,
    default: 0
  },

  content: {
    type: String,
    required: true
  },

  deleted: {
    type: Boolean,
    default: false
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment };