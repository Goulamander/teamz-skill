'use strict';

const Express = require('express');
const Router = Express.Router();
const AcceessControl = require('../middlewares/AccessControl');

const SettingCtrl = require('../controllers/settings_ctrl');

Router.get('/', AcceessControl, function(req, res, next) {
    SettingCtrl.GetUserAccessRole(req.payload._id, function(err, data) {
        if (err) {
            console.log("get user access role 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    })
});

Router.put('/', AcceessControl, function(req, res, next) {
    SettingCtrl.ManageUserAccessRole(req.body, function(err, data) {
        if (err) {
            console.log("get user access role 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    })
});

Router.put('/', AcceessControl, function(req, res, next) {

    if (!!req.body === false ||  
        !!req.body.user_id === false || 
        !!req.body.role === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }

    SettingCtrl.ManageUserAccessRole(req.body, function(err, data) {
        if (err) {
            console.log("get user access role 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    })
});

module.exports = Router;