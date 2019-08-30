const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slatRounds = 10;

//Define schema 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: true},
    password: {type: String, trim: true, required: true},
});

//hash user password before saving into database
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, slatRounds);
    next();
});

module.exports = mongoose.model('User', UserSchema);