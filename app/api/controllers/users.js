const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function(req, res){
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, function(err, result){
            if (err)
                next(err);
            else {
                res.json({
                    status: "success",
                    message: "user added successfully",
                    data: null,
                });
            }
        });
    },

    authenticate: function(req, res){
        userModel.findOne({email: req.body.email}, function(err, userInfo){
            if (err) {
                next(err);
            }else {
              if (bcrypt.compareSync(req.body.password, userInfo.password)){
                  const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'),
                  {expiresIn: '1h'});
                  res.json({status: "success", message: 'user found!!', token: token, data: {user: userInfo}})
              } else {
                  res.json({status: 'error', message: 'Invalid email/password.', data: null});
              }
            }
        });
    },

    list: function(req, res) {
        userModel.find({}, function(err, users){
            if(err)
            res.json({status:"error"})

            res.json({data: users});
        })
    }
};