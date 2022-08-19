'use strict';

const Express = require('express');
const Router = Express.Router();

const AuthCtrl = require('../controllers/auth_ctrl');

Router.post('/', function(req, res, next) {
    AuthCtrl.Login(req.body, function(err, user, data) {
        if (err) {
            console.log("save profile 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(user == false) {
            res.status(401).json({success:false, message:"Invalid crendential"});
            return;
        }
        res.status(200).json({success:true, result:data});
    })
});

module.exports = Router;