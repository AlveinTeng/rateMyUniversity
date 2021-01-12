'use strict'
const log = console.log;

//Express
const express = require('express');
const app = express();
const path = require('path');

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { Rating } = require("./models/rating");
const { Comment } = require("./models/comment");
const { University } = require("./models/university");
const { User } = require("./models/user");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
  return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
      log('Issue with mongoose connection')
      res.status(500).send('Internal server error')
      return;
  } else {
      next()  
  }   
}

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.user) {
      User.findById(req.session.user).then((user) => {
          if (!user) {
              return Promise.reject()
          } else {
              req.user = user
              next()
          }
      }).catch((error) => {
          res.status(401).send("Unauthorized")
      })
  } else {
      res.status(401).send("Unauthorized")
  }
}

// Middleware for admin authentication of resources
const authenticateAdmin = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user).then((user) => {
        if (!user) {
          return Promise.reject()
        } else if (!user.admin) {
          return Promise.reject()
        } else {
          req.user = user
          next()
        }
    }).catch((error) => {
      res.status(401).send("Unauthorized")
    })
  } else {
    res.status(401).send("Unauthorized")
  }
}

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
  session({
      secret: "our hardcoded secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
          // expires: 60000,
          httpOnly: true
      }
  })
);

// A route to login and create a session
app.post("/users/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  // log(name, password);
  // Use the static method on the User model to find a user
  // by their name and password
  User.findByNamePassword(name, password)
      .then(user => {
          // Add the user's id to the session.
          // We can check later if this exists to ensure we are logged in.
          req.session.user = user._id;
          req.session.name = user.name; // we will later send the name to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
          req.session.admin = (name === 'admin');
          res.send({ currentUser: user.name, adminStatus: req.session.admin });
      })
      .catch(error => {
          res.status(400).send()
      });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy(error => {
      if (error) {
          res.status(500).send(error);
      } else {
          res.send()
      }
  });
});

// A route to check if a user is logged & it's admin statusin on the session
app.get("/users/check-session", (req, res) => {

  if (req.session.user) {
    const name = req.session.name;
    const admin = req.session.admin;
      res.send({ currentUser: name, adminStatus: admin});
  } else {
      res.send({ currentUser: null, adminStatus: null});
      // res.status(401).send();
  }
});

/*********************************************************/

/*** API Routes below ************************************/
// User API Route
app.post('/api/users', mongoChecker, (req, res) => {
  // log(req.body)

  // Create a new user
  let user;
  if (req.body.name === 'admin') {
    user = new User({
        name: req.body.name,
        password: req.body.password,
        admin: true
    });
  } else {
    user = new User({
        name: req.body.name,
        password: req.body.password
    });
  }

  user
    .save()
    .then(
      result => {
        res.send({ result });
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
      }
    )
});

// a GET route to get all users
app.get('/api/users', mongoChecker, (req, res) => {

  User
    .find()
    .then(
      users => {
        res.send({ users })
      }
    )
    .catch( 
      error => {
        res.status(500).send("Internal Server Error")
      }
    )
})

// a GET route to get user by id
app.get('/api/users/:id', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          res.send({ user })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a POST route to get user by id
app.post('/api/users/:id/password', mongoChecker, (req, res) => {
  const id = req.params.id
  const password = req.body.password

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  User
    .checkPassword(id, password)
    .then(
      re => {
        if (!re.result) {
          res.send({ check: false });
        } else {
          res.send({ check: true });
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a POST route to change user's password by id
app.post('/api/users/password', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  User
    .updatePassword(id, oldPassword, newPassword)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          user
            .save()
            .then(
              user => {
                if (!user) {
                  res.status(404).send('Resource not found')  // could not find this restaurant
                } else {
                  res.send({ currentUser: user.name })
                }
              }
            )
            .catch(
              error => {
                res.status(500).send('Internal Server Error')  // server error
              }
            )
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a PATCH route to change user's image in profile by id
app.patch('/api/users/profile/image', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  const image = req.body.image

  User
    .findById(id)
    .then( 
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {

          const newProfile = {
            ...user.profile,
            image: image
          }

          User
            .findOneAndUpdate(
              {_id: id},
              {$set: { profile: newProfile }},
              {new: true, useFindAndModify: false}
            )
            .then(
              user => {
                if (!user) {
                  res.status(404).send('Resource not found')
                } else {   
                  res.send({ image, user })
                }
              }
            )
            .catch(
              error => {
                if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                  res.status(500).send('Internal server error')
                } else {
                  res.status(400).send('Bad Request') // bad request for changing the university.
                }
              }
            )
        }
      }
    )
})

// a PATCH route to change user's school & year in profile by id
app.patch('/api/users/profile', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  const school = req.body.school
  const year = req.body.year

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {

          const newProfile = {
            ...user.profile,
            school: school,
            year: year
          }

          User
            .findOneAndUpdate(
              {_id: id},
              {$set: { profile: newProfile }},
              {new: true, useFindAndModify: false}
            )
            .then(
              user => {
                if (!user) {
                  res.status(404).send('Resource not found')
                } else {   
                  res.send({ school, year, user })
                }
              }
            )
            .catch(
              error => {
                if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                  res.status(500).send('Internal server error')
                } else {
                  res.status(400).send('Bad Request') // bad request for changing the university.
                }
              }
            )
        }
      }
    )
})

// a PATCH route to change user's school in profile by id
app.patch('/api/users/profile/school', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  const school = req.body.school

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {

          const newProfile = {
            ...user.profile,
            school: school
          }

          User
            .findOneAndUpdate(
              {_id: id},
              {$set: { profile: newProfile }},
              {new: true, useFindAndModify: false}
            )
            .then(
              user => {
                if (!user) {
                  res.status(404).send('Resource not found')
                } else {   
                  res.send({ school, user })
                }
              }
            )
            .catch(
              error => {
                if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                  res.status(500).send('Internal server error')
                } else {
                  res.status(400).send('Bad Request') // bad request for changing the university.
                }
              }
            )
        }
      }
    )
})

// a PATCH route to change user's year in profile by id
app.patch('/api/users/profile/year', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  const year = req.body.year

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {

          const newProfile = {
            ...user.profile,
            year: year
          }

          User
            .findOneAndUpdate(
              {_id: id},
              {$set: { profile: newProfile }},
              {new: true, useFindAndModify: false}
            )
            .then(
              user => {
                if (!user) {
                  res.status(404).send('Resource not found')
                } else {   
                  res.send({ year, user })
                }
              }
            )
            .catch(
              error => {
                if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                  res.status(500).send('Internal server error')
                } else {
                  res.status(400).send('Bad Request') // bad request for changing the university.
                }
              }
            )
        }
      }
    )
})

// a POST route to push user's comment
app.post('/api/users/comment/:com_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.comments

          if (comments.includes(com_id)) {
            res.status(409).send('Resource id already exists')  // comment id already exists
          } else {
            comments.push(com_id)

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { comments: comments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ com_id, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the university.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get user's comment
app.get('/api/users/comment/:com_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.comments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const comment = comments[comments.indexOf(com_id)]
            res.send({ comment })
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete user's comment by ADMIN
app.delete('/api/users/:id/comment/:com_id', mongoChecker, authenticateAdmin, (req, res) => {
  const id = req.params.id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.comments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newComments = comments.filter(com => { com !== com_id })

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { comments: newComments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newComments, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete user's comment by USER
app.delete('/api/users/comment/:com_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.comments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newComments = comments.filter(com => { com !== com_id })

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { comments: newComments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newComments, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a POST route to push user's LIKE comment
app.post('/api/users/comment/:com_id/like', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.likecomments

          if (comments.includes(com_id)) {
            res.status(409).send('Resource id already exists')  // comment id already exists
          } else {
            comments.push(com_id)

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { likecomments: comments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ com_id, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the university.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get user's LIKE comment
app.get('/api/users/comment/:com_id/like', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.likecomments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const comment = comments[comments.indexOf(com_id)]
            res.send({ comment })
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete user's LIKE comment
app.delete('/api/users/comment/:com_id/like', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.likecomments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newComments = comments.filter(com => { com !== com_id })

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { likecomments: newComments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newComments, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a POST route to push user's DISLIKE comment
app.post('/api/users/comment/:com_id/dislike', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.dislikecomments

          if (comments.includes(com_id)) {
            res.status(409).send('Resource id already exists')  // comment id already exists
          } else {
            comments.push(com_id)

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { dislikecomments: comments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ com_id, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the university.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get user's DISLIKE comment
app.get('/api/users/comment/:com_id/dislike', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.dislikecomments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const comment = comments[comments.indexOf(com_id)]
            res.send({ comment })
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete user's DISLIKE comment
app.delete('/api/users/comment/:com_id/dislike', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = user.dislikecomments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newComments = comments.filter(com => { com !== com_id })

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { dislikecomments: newComments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newComments, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})


// a POST route to push user's follow university
app.post('/api/users/university/:follow_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const follow_id = req.params.follow_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(follow_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const followUniversities = user.followUniversities

          if (followUniversities.includes(follow_id)) {
            res.status(409).send('Resource id already exists')  // comment id already exists
          } else {
            followUniversities.push(follow_id)

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { followUniversities: followUniversities }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ follow_id, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the university.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get user's follow university by USER
app.get('/api/users/university/:follow_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const follow_id = req.params.follow_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(follow_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const followUniversities = user.followUniversities
          if (!followUniversities.includes(follow_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const followUniversity = followUniversities[followUniversities.indexOf(follow_id)]
            res.send({ followUniversity })
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete user's comment
app.delete('/api/users/university/:follow_id', mongoChecker, authenticate, (req, res) => {
  const id = req.user._id
  const follow_id = req.params.follow_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(follow_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  User
    .findById(id)
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const followUniversities = user.followUniversities
          if (!followUniversities.includes(follow_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newFollowUniversities = followUniversities.filter(follow => { follow !== follow_id })

            User
              .findOneAndUpdate(
                {_id: id},
                {$set: { followUniversities: newFollowUniversities }},
                {new: true, useFindAndModify: false}
              )
              .then(
                user => {
                  if (!user) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newFollowUniversities, user })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a PATCH route to change delete in user by id
app.patch('/api/users/:id/delete', mongoChecker, authenticateAdmin, (req, res) => {
  const id = req.params.id
  const deleted = req.body.deleted

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  User
    .findOneAndUpdate(
      {_id: id},
      {$set: { deleted: deleted }},
      {new: true, useFindAndModify: false}
    )
    .then(
      user => {
        if (!user) {
          res.status(404).send('Resource not found')
        } else {   
          res.send({ deleted, user })
        }
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // bad request for changing the student.
        }
      }
    )
})


/** University resource routes **/
// a POST route to *create* a university
app.post('/api/universities', mongoChecker, authenticateAdmin, (req, res) => {
  // log(`Adding university ${req.body.name}, created by admin ${req.user._id}`)

  // Create a new student using the University mongoose model
  const university = new University({
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      rating: req.body.rating
  });

  university
    .save()
    .then(
      result => {
        res.send({ result });
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
      }
    )
})

// a GET route to get all universities
app.get('/api/universities', mongoChecker, (req, res) => {

  University
    .find()
    .then(
      universities => {
        res.send({ universities })
      }
    )
    .catch( 
      error => {
        res.status(500).send("Internal Server Error")
      }
    )

})

// a GET route to get university by id
app.get('/api/universities/:id', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          res.send({ university })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get university's comments
app.get('/api/universities/:id/comment', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = university.comments
      
          res.send({ comments })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a POST route to push university's comment
app.post('/api/universities/:id/comment/:com_id', mongoChecker, (req, res) => {
  const id = req.params.id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = university.comments

          if (comments.includes(com_id)) {
            res.status(409).send('Resource id already exists')  // comment id already exists
          } else {
            comments.push(com_id)

            University
              .findOneAndUpdate(
                {_id: id},
                {$set: { comments: comments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                university => {
                  if (!university) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ com_id, university })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the university.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get university's comment
app.get('/api/universities/:id/comment/:com_id', mongoChecker, (req, res) => {
  const id = req.params.id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = university.comments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const comment = comments[comments.indexOf(com_id)]
            res.send({ comment })
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a DELETE route to delete university's comment
app.delete('/api/universities/:id/comment/:com_id', mongoChecker, authenticate, (req, res) => {
  const id = req.params.id
  const com_id = req.params.com_id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id) || !ObjectID.isValid(com_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const comments = university.comments
          if (!comments.includes(com_id)) {
            res.status(404).send('Resource not found')  // could not find this comment
          } else {
            const newComments = comments.filter(com => { com !== com_id })

            University
              .findOneAndUpdate(
                {_id: id},
                {$set: { comments: newComments }},
                {new: true, useFindAndModify: false}
              )
              .then(
                university => {
                  if (!university) {
                    res.status(404).send('Resource not found')
                  } else {   
                    res.send({ newComments, university })
                  }
                }
              )
              .catch(
                error => {
                  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                    res.status(500).send('Internal server error')
                  } else {
                    res.status(400).send('Bad Request') // bad request for changing the student.
                  }
                }
              )
          }
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a GET route to get university's rating
app.get('/api/universities/:id/rating', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

  University
    .findById(id)
    .then(
      university => {
        if (!university) {
          res.status(404).send('Resource not found')  // could not find this university
        } else {
          const rating = university.rating
          res.send({ rating })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

/** Comment resource routes **/
// a POST route to *create* a comment
app.post('/api/comments', mongoChecker, authenticate, (req, res) => {

  // Create a new comment using the Comment mongoose model
  const comment = new Comment({
    rating: req.body.rating,
    author: req.user._id,
    university: req.body.university,
    respond: req.body.respond,
    under: req.body.under,
    time: req.body.time,
    content: req.body.content
  })

  comment
    .save()
    .then(
      result => {
        res.send({ result });
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
      }
    )
})

// a GET route to get all comments
app.get('/api/comments', mongoChecker, (req, res) => {

  Comment
    .find()
    .then(
      comments => {
        res.send({ comments })
      }
    )
    .catch( 
      error => {
        res.status(500).send("Internal Server Error")
      }
    )

})

// a GET route to get comment by id
app.get('/api/comments/:id', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Comment
    .findById(id)
    .then(
      comment => {
        if (!comment) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          res.send({ comment })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// // a DELETE route to delete comment by id
app.delete('/api/comments/:id', mongoChecker, authenticateAdmin, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Comment
    .findByIdAndRemove(id)
    .then(
      comment => {
        if (!comment) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          res.send({ comment })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a PATCH route to change likes in comment by id
app.patch('/api/comments/:id/like', mongoChecker, (req, res) => {
  const id = req.params.id
  const like = req.body.like

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Comment
    .findOneAndUpdate(
      {_id: id},
      {$set: { like: like }},
      {new: true, useFindAndModify: false}
    )
    .then(
      comment => {
        if (!comment) {
          res.status(404).send('Resource not found')
        } else {   
          res.send({ like, comment })
        }
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // bad request for changing the student.
        }
      }
    )
})

// a PATCH route to change delete in comment by id
app.patch('/api/comments/:id/delete', mongoChecker, authenticateAdmin, (req, res) => {
  const id = req.params.id
  const deleted = req.body.deleted

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Comment
    .findOneAndUpdate(
      {_id: id},
      {$set: { deleted: deleted }},
      {new: true, useFindAndModify: false}
    )
    .then(
      comment => {
        if (!comment) {
          res.status(404).send('Resource not found')
        } else {   
          res.send({ deleted, comment })
        }
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // bad request for changing the student.
        }
      }
    )
})

/** Rating resource routes **/
// a POST route to *create* a rating
app.post('/api/ratings', mongoChecker, authenticate, (req, res) => {

  // Create a new comment using the Comment mongoose model
  const rating = new Rating();

  rating
    .save()
    .then(
      result => {
        res.send({ result });
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
        }
      }
    )
})

// a GET route to get all ratings
app.get('/api/ratings', mongoChecker, (req, res) => {

  Rating
    .find()
    .then(
      ratings => {
        res.send({ ratings })
      }
    )
    .catch( 
      error => {
        res.status(500).send("Internal Server Error")
      }
    )
})

// a GET route to get rating by id
app.get('/api/ratings/:id', mongoChecker, (req, res) => {
  const id = req.params.id

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Rating
    .findById(id)
    .then(
      rating => {
        if (!rating) {
          res.status(404).send('Resource not found')  // could not find this restaurant
        } else {
          res.send({ rating })
        }
      }
    )
    .catch(
      error => {
        res.status(500).send('Internal Server Error')  // server error
      }
    )
})

// a PATCH route to change category's rating in rating by id
app.patch('/api/ratings/:id/rating', mongoChecker, (req, res) => {
  const id = req.params.id
  const safety = req.body.safety
  const workload = req.body.workload
  const location = req.body.location
  const facilities = req.body.facilities
  const opportunity = req.body.opportunity
  const clubs = req.body.clubs
  const general = req.body.general

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Rating
    .findOneAndUpdate(
      {_id: id},
      {$set: { 
        safety: safety,
        workload: workload,
        location: location,
        facilities: facilities,
        opportunity: opportunity,
        clubs: clubs,
        general: general
      }},
      {new: true, useFindAndModify: false}
    )
    .then(
      rating => {
        if (!rating) {
          res.status(404).send('Resource not found')
        } else {   
          res.send({ rating })
        }
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // bad request for changing the student.
        }
      }
    )
})

// a PATCH route to change delete in rating by id
app.patch('/api/ratings/:id/delete', mongoChecker, authenticateAdmin, (req, res) => {
  const id = req.params.id
  const deleted = req.body.deleted

  // Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }
  
  Rating
    .findOneAndUpdate(
      {_id: id},
      {$set: { deleted: deleted }},
      {new: true, useFindAndModify: false}
    )
    .then(
      rating => {
        if (!rating) {
          res.status(404).send('Resource not found')
        } else {   
          res.send({ deleted, rating })
        }
      }
    )
    .catch(
      error => {
        if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
          res.status(500).send('Internal server error')
        } else {
          res.status(400).send('Bad Request') // bad request for changing the student.
        }
      }
    )
})

// other student API routes can go here...
// ...

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/search?", "/signup", "/login", "/university/:id", "/notification/:id", "/user/:id", "/rate/:id"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
