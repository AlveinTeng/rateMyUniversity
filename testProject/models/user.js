/* User Model */
'use strict'
const log = console.log


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  profile: {
    image: {
      type: String,
      default: ""
    },

    school: {
      type: String,
      default: ""
    },

    year: {
      type: String,
      default: ""
    }
  },

  followUniversities: [String],
  likecomments: [String],
  dislikecomments: [String],
  comments: [String],

  deleted: {
    type: Boolean,
    default: false
  },

  admin: {
    type: Boolean,
    default: false
  }
});

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre('save', function(next) {
  const user = this; // bind this to User document instance

  // checks to ensure we don't hash password more than once
  if (user.isModified('password')) {
    //generated salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;

        next();
      });
    });
  } else {
    next();
  }
});


// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.updatePassword = function(id, oldPass, newPass) {
  const user = this; // binds this to the User model

  // First find the user by their name
  return user
          .findById(id)
          .then(
            user => {
              if (!user) {
                return Promise.reject(); // a rejected promise
              }

              // if the user exists, make sure their password is correct
              return new Promise((resolve, reject) => {
                bcrypt.compare(oldPass, user.password, (err, result) => {
                  if (result) {
                    user.password = newPass
                    resolve(user);
                  } else {
                    reject();
                  }
                });
              });
            }
          )

}

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.checkPassword = function(id, Pass) {
  const user = this; // binds this to the User model

  // First find the user by their name
  return user
          .findById(id)
          .then(
            user => {
              if (!user) {
                return Promise.reject(); // a rejected promise
              }

              // if the user exists, make sure their password is correct
              return new Promise((resolve, reject) => {
                bcrypt.compare(Pass, user.password, (err, result) => {
                  if (result) {
                    resolve({result: true});
                  } else {
                    resolve({result: false});
                  }
                });
              });
            }
          )

}

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByNamePassword = function(name, password) {
  const user = this; // binds this to the User model

  // First find the user by their name
  return user
          .findOne({ name: name })
          .then(
            user => {
              if (!user) {
                return Promise.reject(); // a rejected promise
              }

              // if the user exists, make sure their password is correct
              return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                  if (result) {
                    resolve(user);
                  } else {
                    reject();
                  }
                });
              });
            }
          );
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }