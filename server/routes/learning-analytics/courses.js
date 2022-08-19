const Express = require('express');
const Router = Express.Router();
const LearningAnalyticsCtrl = require('../../controllers/learning_analytics_ctrl');
const AcceessControl = require('../../middlewares/AccessControl');
const Utils = require('../../utils');

Router.post('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if(!!req.body.interval === false || !!req.body.c_type === false) {
        res.status(422).json({success:false, message:"interval or course type is missing"});
        return;
    }
    
    let interval = Utils.GetSearchInterval(req.body.interval);
    let course_type = Utils.GetSearchCourseType(req.body.c_type);

    LearningAnalyticsCtrl.GetAnalyticCourses(req.query._id, interval, course_type, function(err, data){
        if (err) {
            console.log("get analytics learners 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/course/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    LearningAnalyticsCtrl.GetAnalyticsIndividualCourse(req.params.c_id, function(err, data){
        if (err) {
            console.log("get analytics learners 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/course/:c_id/:user_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    LearningAnalyticsCtrl.GetAnalyticsIndividualUserCourse(req.params.user_id, req.params.c_id, function(err, data){
        if (err) {
            console.log("get analytics learners 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.delete('/delete', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body.course_ids === false) {
        res.status(422).json({ error: "Insufficient data to process" });
        return;
    }

    LearningAnalyticsCtrl.DeleteCustomCourse(req.payload._id, req.body.course_ids, function(err, data) {
        if (err) {
            console.log("delete custom courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:"Courses deleted"});
    });    
});

module.exports = Router;