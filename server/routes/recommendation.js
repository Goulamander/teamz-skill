'use strict';

const Express = require('express');
const Router = Express.Router();
const CoursesCtrl = require('../controllers/courses_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.get('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    CoursesCtrl.GetRecommendCourses(req.payload._id, req.payload, function(err, data) {
    if (err) {
        console.log("get courses 500 error: ");
        res.status(500).json({success:false, message:err});
        return;
    }

    res.status(200).json({success:true, result:data});
  });     
  
});

module.exports = Router;