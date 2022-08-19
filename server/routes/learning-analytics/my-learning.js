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
        res.status(422).json({success:false, message:"interval or course type or user id is missing"});
        return;
    }

    let interval = Utils.GetSearchInterval(req.body.interval);
    let course_type = Utils.GetSearchCourseType(req.body.c_type);

    LearningAnalyticsCtrl.GetMyLearning(req.payload._id, interval, course_type, function(err, data){
        if (err) {
            console.log("get analytics my-learning courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    LearningAnalyticsCtrl.GetMyLearningCourse(req.params.c_id, function(err, data){
        if (err) {
            console.log("get analytics my-learning course 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

module.exports = Router;