//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://farooq:farooq456@cluster0-ckrde.mongodb.net/movies?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

module.exports = mongoose;