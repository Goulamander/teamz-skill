'use strict';

const Express = require('express');
const Router = Express.Router();
const OnboardingCtrl = require('../controllers/onboading_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.get('/', function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    OnboardingCtrl.GetUser(req.payload._id, function(err, data) {

        if (err) {
            console.log("get user data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.post('/send-invites', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    OnboardingCtrl.SendInvites(req.payload._id, req.payload.name, req.body, req.payload, function(err, data) {
        if (err) {
            console.log("send invites 500 error: ");
            res.status(500).json(err);
            return;
        }

        res.status(200).json(data);
    });     
  
});

module.exports = Router;