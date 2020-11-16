//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));