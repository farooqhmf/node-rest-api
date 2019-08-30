const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const movies = require('./app/api/routes/movies');
const users = require('./app/api/routes/users');

const mongoose = require('./app/api/config/database');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('secretKey', 'nodeRestApi'); //jwt secret token

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//public routes 
app.use('/users', users);

//private routes 
app.use('/movies', validateUser, movies);

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next){
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
        if(err) {
            res.json({status: "error token", message: err.message, data: null});
        } else {
            //add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
       err.status = 404;
       next(err);
});

// handle errors
app.use(function(err, req, res, next) {
    console.log(err);
    
     if(err.status === 404)
      res.status(404).json({message: "Not found"});
     else 
       res.status(500).json({message: "Something looks wrong :( !!!"});
});

app.listen(PORT, function(){
    console.log(`Node server is listening on port ${PORT}`);
});
