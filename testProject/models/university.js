/* University Model */

const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  rating: {
    type: String,
    required: true
  },

  comments: [String]
});

const University = mongoose.model('University', UniversitySchema);

module.exports = { University };