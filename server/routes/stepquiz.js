'use strict';

const Express = require('express');
const Router = Express.Router();
const StepQuizCtrl = require('../controllers/step_quiz_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/get', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false ||  
        !!req.body.c_id === false || 
        !!req.body.step_id === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }

    StepQuizCtrl.GetStepQuizAnswers(req.payload._id, req, function(err, data) {

        if (err) {
            console.log("get step-quiz answers data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.post('/', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false ||  
        !!req.body.c_id === false || 
        !!req.body.step_id === false ||
        !!req.body.quiz_status === false || 
        req.body.answers.length < 1) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }

    StepQuizCtrl.InsertStepQuizAnswers(req.payload._id, req, function(err, data) {

        if (err) {
            console.log("get step-quiz answers data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

module.exports = Router;