'use strict';

const Express = require('express');
const Router = Express.Router();
const StepFeedBackCtrl = require('../controllers/step_feedback_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.get('/requested', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    StepFeedBackCtrl.GetStepFeedBackRequests(req.payload._id, function(err, data) {

        if (err) {
            console.log("get feedback-requested data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.post('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
 
    if (!!req.body === false || !!req.body.what_went === false || !!req.body.what_improve === false || req.body.acpp == undefined || req.body.cvp  == undefined || req.body.hd  == undefined || req.body.spp  == undefined || req.body.cs  == undefined || req.body.ccca  == undefined || req.body.bca  == undefined || req.body.ae  == undefined || req.body.storytelling  == undefined || req.body.cp  == undefined || req.body.cqh  == undefined || req.body.caat  == undefined || !!req.body.course_id === false || !!req.body.assign_to === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }
    
    if (isNaN(req.body.acpp) || parseInt(req.body.acpp) > 5 || isNaN(req.body.cvp) || parseInt(req.body.cvp) > 5 || isNaN(req.body.hd) || parseInt(req.body.hd) > 5 || isNaN(req.body.spp) || parseInt(req.body.spp) > 5 || isNaN(req.body.cs) || parseInt(req.body.cs) > 5 || isNaN(req.body.ccca) || parseInt(req.body.ccca) > 5 || isNaN(req.body.bca) || parseInt(req.body.bcp) > 5 || isNaN(req.body.ae) || parseInt(req.body.ae) > 5 || isNaN(req.body.storytelling) || parseInt(req.body.storytelling) > 5 || isNaN(req.body.cp) || parseInt(req.body.cp) > 5 || isNaN(req.body.cqh) || parseInt(req.body.cqh) > 5 || isNaN(req.body.caat) || parseInt(req.body.caat) > 5) {
        res.status(422).json({success:false, message:"Check rating fields it could be a number and not greater than 5"});
        return;
    }

    if(isNaN(req.body.course_id)) {
        res.status(422).json({success:false, message:"CourseId must be a number"});
        return;
    }

    StepFeedBackCtrl.InsertStepFeedback(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("insert step feedback 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    }); 
});

Router.get('/forme', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    StepFeedBackCtrl.GetStepFeedBackForMe(req.payload._id, function(err, data) {

        if (err) {
            console.log("get feedback-requested data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

module.exports = Router;