/* This module will hold our connection to 
   our mongo server through the Mongoose API.
   We will access the connection in our express server. */
   const mongoose = require('mongoose')

   /* Connnect to our database */
   // Get the URI of the local database, or the one specified on deployment.
   const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://VictorS67:csc309fun@cluster0.thtgr.mongodb.net/test'//'mongodb://localhost:27017/UniversityAPI'
   
   mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
   
   module.exports = { mongoose }  // Export the active connection.