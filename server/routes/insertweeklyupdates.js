'use strict';

const Express = require('express');
const Router = Express.Router();

const SettingCtrl = require('../controllers/settings_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    SettingCtrl.InsertWeeklyUpdate(req.payload._id, req.body, function(err, data) {
        if (err) {
            console.log("insert weekly update 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
    
        res.status(200).json({success:true, message:data});
    })
});

module.exports = Router;