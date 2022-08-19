'use strict';

const Express = require('express');
const Router = Express.Router();

const AuthCtrl = require('../controllers/auth_ctrl');

Router.post('/', function(req, res, next) {
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];

    AuthCtrl.RegisterUser(req.body, tenant, function(err, data) {
        if (err) {
            console.log("save profile 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
    
        res.status(200).json({success:true, result:data});
    })
});

module.exports = Router;