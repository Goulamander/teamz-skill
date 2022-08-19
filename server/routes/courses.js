'use strict';

const Express = require('express');
const Router = Express.Router();
const CoursesCtrl = require('../controllers/courses_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
 
    if (!!req.body === false || !!req.body.c_name === false || !!req.body.c_link === false || !!req.body.c_by === false || req.body.c_progress === undefined) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    CoursesCtrl.InsertCourses(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("insert courses 500 error: ");
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
    
    CoursesCtrl.GetCourses(req.payload._id, function(err, courseData) {
    if (err) {
        console.log("get courses 500 error: ");
        res.status(500).json({success:false, message:err});
        return;
    }

    CoursesCtrl.GetInternalRecommendation(req.payload._id, function(err, recommendation){
        if (err) {
            console.log("get recommend courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        let json = {
            courses: courseData,
            recommendations: recommendation
        }

        res.status(200).json({success:true, result:json});
    });
  });     
  
});

Router.put('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body === false || !!req.body.c_name === false || !!req.body.c_link === false || !!req.body.c_by === false || req.body.c_progress === undefined) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }
    
    CoursesCtrl.UpdateCourses(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("update courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:"Updated Successfully"});
    });     
  
});

Router.delete('/',AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
   
    if (!!req.body === false || !!req.body.c_id === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }
    
    CoursesCtrl.DeleteCourses(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("update courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:"Deleted Successfully"});
    });     
  
});

Router.post('/recommendation', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.InsertInternalRecommendation(req.payload._id, req.body, req.payload, function(err, data){
        if (err) {
            console.log("insert recommend courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/recommendation', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    CoursesCtrl.GetInternalRecommendation(req.payload._id, function(err, data){
        if (err) {
            console.log("get recommend courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

module.exports = Router;