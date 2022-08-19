'use strict';

const Express = require('express');
const Router = Express.Router();
const Learners = require('./learning-analytics/learners');
const Courses = require('./learning-analytics/courses');
const MyLearnings = require('./learning-analytics/my-learning');

const AnalyticsCtrl = require('../controllers/learning_analytics_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.get('/direct-reports', AcceessControl, function(req, res, next) {
   
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    AnalyticsCtrl.GetDirectReports(req.payload._id, function(err, data) {
        if (err) {
            console.log("get direct report 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:data});
    })
});

Router.get('/user-profile/:_id', AcceessControl, function(req, res, next) {
   
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    AnalyticsCtrl.GetUserProfile(req.params._id, function(err, data) {
        if (err) {
            console.log("get direct report 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:data});
    })
});

Router.use('/learners', Learners);
Router.use('/courses', Courses);
Router.use('/my-learning', MyLearnings);

module.exports = Router;