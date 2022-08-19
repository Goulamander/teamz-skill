'use strict';

const Express = require('express');
const Router = Express.Router();
const SettingsCtrl = require('../controllers/settings_ctrl');

Router.get('/alluser', function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    SettingsCtrl.GetAllUser('req.payload._id', function(err, data) {

        if (err) {
            console.log("get All user data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.get('/createSchema', function(req, res, next) {
    
    SettingsCtrl.CreateSchema(function(err, data) {

        if (err) {
            console.log("get All user data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

module.exports = Router;