'use strict';

const Express = require('express');
const Router = Express.Router();
const SettingsCtrl = require('../controllers/settings_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    SettingsCtrl.insertWorkHighlights(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("work highlights 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    SettingsCtrl.getWorkHighlights(req.payload._id, function(err, data) {
    if (err) {
        console.log("work highlights 500 error: ");
        res.status(500).json({success:false, message:err});
        return;
    }

    res.status(200).json({success:true, result:data});
  });     
  
});

module.exports = Router;