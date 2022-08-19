'use strict';

const Express = require('express');
const path = require('path');
const fs = require('fs');
var multer = require('multer');
const oembed = require('oembed-parser');
const request = require('request');
const _ = require('lodash');
const Joi = require('joi');
// const validator = require('express-joi-validation').createValidator({});

const CoursesCtrl = require('../controllers/courses_ctrl');
const db = require('../db');
const AcceessControl = require('../middlewares/AccessControl');
const Utils = require('../utils');
const StepFeedBack = require('./stepfeedback');
const StepQuiz = require('./stepquiz');
const customCourseBodySchema = require('../middlewares/customCourseValidators');

const Router = Express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'dist/upload/course_img');
  },
  filename: function (req, file, cb) {
      // remove whitespaces
      let fname = file.originalname.replace(/\s/g, '')
    cb(null, Date.now() + '-' +fname )
  }
});

var upload = multer({ storage: storage }).single('file');

Router.post('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    if(Object.keys(req.body).length > 0) {
        // normal scenario

        let schemaError = Joi.validate(req.body, customCourseBodySchema);
        
        if(schemaError.error != null) {
            return res.status(422).json({success:false, message:schemaError.error.message});
        }

        let checkDuplicateStep = Utils.checkDuplicateStep(req.body.steps);
        console.log("checkDuplicateStep without image", checkDuplicateStep);
        if(checkDuplicateStep) {
            res.status(422).json({success:false, message:"Please add only one step of type video"});
            return;
        }
        
        CoursesCtrl.InsertCustomCourses(req.payload._id, req.body, '', req.payload, function(err, data){
            if (err) {
                console.log("insert courses 500 error: ");
                res.status(500).json({success:false, message:err});
                return;
            }
    
            res.status(200).json({success:true, result:data});
        });
    } else {
        // multipart form data
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({success:false, message:err})
            } else if (err) {
                return res.status(500).json({success:false, message:err})
            }

            let courseData = JSON.parse(req.body.courseData);

            let schemaError = Joi.validate(courseData, customCourseBodySchema);
            
            if(schemaError.error != null) {
                return res.status(422).json({success:false, message:schemaError.error.message});
            }

            let checkDuplicateStep = Utils.checkDuplicateStep(courseData.steps);
            console.log("checkDuplicateStep", checkDuplicateStep);
            if(checkDuplicateStep) {
                res.status(422).json({success:false, message:"Please add only one step of type video"});
                return;
            }

            CoursesCtrl.InsertCustomCourses(req.payload._id, courseData, req.file.path, req.payload, function(err, data){
                if (err) {
                    console.log("insert courses 500 error: ");
                    res.status(500).json({success:false, message:err});
                    return;
                }
        
                res.status(200).json({success:true, result:data});
            });
        })
    }     
  
});

//Temp APIs to update iframeUrl

Router.get('/update-iframe-url', function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    CoursesCtrl.UpdateCustomCourseSteps(function(err, data) {
        if (err) {
            console.log("update custom course 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    })
})

Router.get('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    let roleID = Utils.getCourseAccessID(req.payload.role)
    CoursesCtrl.GetCustomCourses(req.payload._id, roleID, function(err, data) {
        if (err) {
            console.log("get courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:data});
    });    
});

Router.get('/assign', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
   
    CoursesCtrl.GetAssignCourses(req.payload._id, function(err, data){
        if (err) {
            console.log("insert courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.get('/library', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    let roleID = Utils.getCourseAccessID(req.payload.role);
    
    CoursesCtrl.GetCoursesLibrary(req.payload._id, roleID, function(err, data) {
        if (err) {
            console.log("get courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:data});
    });    
});

Router.get('/assign/complete/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.GetAssignCompleteCourseById(req.payload._id, req.params.c_id, function(err, data){
        if (err) {
            console.log("get assign by id courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(data.length) {
            let steps = [];
            let quizStep = [];

            for(let i=0; i<data.length; i++) {
                if(data[i].step_type == 'TaskToComplete_RecordedVideo' || data[i].step_type == 'TaskToComplete_Video') {
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].customstepurl, step_id: data[i].step_id, step_complete: data[i].step_complete, step_video_title: data[i].video_title, is_quiz_started: data[i].is_quiz_started, step_iframeurl: data[i].iframe_url});
                } else if(data[i].step_type === 'TaskToComplete_Quiz') {
                    quizStep.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, is_quiz_started: data[i].is_quiz_started, assign_step_id: data[i].assign_step_id, assign_c_id: data[i].assign_c_id, quiz_result: data[i].quiz_result, step_iframeurl: data[i].iframe_url});
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_complete: data[i].step_complete, is_quiz_started: data[i].is_quiz_started, quiz_result: data[i].quiz_result, step_iframeurl: data[i].iframe_url});
                } else {
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_complete: data[i].step_complete, is_quiz_started: data[0].is_quiz_started, step_iframeurl: data[i].iframe_url});
                }
            }

            let stepOptionPromise = [];
    
            for(let q=0; q<quizStep.length; q++) {
                if(quizStep[q].is_quiz_started === 'Completed' && quizStep[q].quiz_result >= 80) {
                    stepOptionPromise.push(stepQuestionOptionWithResult(req.payload._id, quizStep[q].assign_c_id, quizStep[q].assign_step_id, steps, quizStep[q].step_id))
                } else {
                    stepOptionPromise.push(stepQuestionOptionPromise(req.params.c_id, quizStep[q].step_id, steps, true, false))
                }
            }

            Promise.all(stepOptionPromise).then((value => {
                let stepWithquiz = value[value.length - 1];
                //console.log("stepWithquiz", stepWithquiz)
                db.GetCourseRating(req.params.c_id, function(err, rating) {
                    if (err) {
                        console.log("err: " + err);
                        return res.status(400).json({status:false, result:"Something went wrong"});
                    }

                    db.GetAssignCourseCount(req.params.c_id, function(err, assignData) {
                        if(err) {
                            res.status(500).json({success:false, message:err.message});
                        }
                        
                        let json = {
                            "c_id": data[0].c_id,
                            "c_title": data[0].c_title,
                            "c_description": data[0].c_description,
                            "c_duration": data[0].c_duration,
                            "c_tag": data[0].c_tag,
                            "c_state": data[0].c_state,
                            "c_image": data[0].c_image,
                            "c_isManagerSign":data[0].c_is_manager_sign,  
                            "c_isStepInOrder":data[0].c_is_step_in_order,
                            "start_time": data[0].start_time,
                            "assigned_by": data[0].assigned_by,
                            "customStepUrl": data[0].customstepurl,
                            "c_type": data[0].c_type,
                            "steps": stepWithquiz ? value[value.length - 1] : steps,
                            "course_count" : assignData.assigcoursecount,
                            "course_rating": rating.avg_rating,
                            "rating_count": rating.rating_count,
                        }
                        
                        res.status(200).json({success:true, result:json});
                    });
                });
            })).catch(err => {
                res.status(500).json({success:true, result:err});
            });
        } else {
            res.status(200).json({success:true, result:data});
        }
    });     
  
});

Router.get('/assign/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.GetAssignCourseByCourseId(req.payload._id, req.params.c_id, function(err, data){
        if (err) {
            console.log("get assign by id courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(data.length) {
            let steps = [];
            let quizStep = [];
            //console.log("data", data);
            for(let i=0; i<data.length; i++) {
                if(data[i].step_type == 'TaskToComplete_RecordedVideo' || data[i].step_type == 'TaskToComplete_Video') {
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].customstepurl, step_id: data[i].step_id, step_complete: data[i].step_complete, step_video_title: data[i].video_title, is_quiz_started: data[i].is_quiz_started, step_iframeurl: data[i].iframe_url});
                } else if(data[i].step_type === 'TaskToComplete_Quiz') {
                    quizStep.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, is_quiz_started: data[i].is_quiz_started, assign_step_id: data[i].assign_step_id, assign_c_id: data[i].assign_c_id, quiz_result: data[i].quiz_result, step_iframeurl: data[i].iframe_url, quiz_attempts: data[i].quiz_attempts});
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_complete: data[i].step_complete, is_quiz_started: data[i].is_quiz_started, quiz_result: data[i].quiz_result, step_iframeurl: data[i].iframe_url, quiz_attempts: data[i].quiz_attempts});
                } else {
                    steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_complete: data[i].step_complete, is_quiz_started: data[0].is_quiz_started, step_iframeurl: data[i].iframe_url});
                }
            }

            let stepOptionPromise = [];
    
            for(let q=0; q<quizStep.length; q++) {
                if(quizStep[q].is_quiz_started === 'Completed' && (quizStep[q].quiz_result >= 80 || quizStep[q].quiz_attempts === 3)) {
                    stepOptionPromise.push(stepQuestionOptionWithResult(req.payload._id, quizStep[q].assign_c_id, quizStep[q].assign_step_id, steps, quizStep[q].step_id))
                } else {
                    stepOptionPromise.push(stepQuestionOptionPromise(req.params.c_id, quizStep[q].step_id, steps, true, false))
                }
            }

            Promise.all(stepOptionPromise).then((value => {
                let stepWithquiz = value[value.length - 1];
                //console.log("stepWithquiz", stepWithquiz)
                db.GetCourseRating(req.params.c_id, function(err, rating) {
                    if (err) {
                        console.log("err: " + err);
                        return res.status(400).json({status:false, result:"Something went wrong"});
                    }
                    let json = {
                        "c_id": data[0].c_id,
                        "c_title": data[0].c_title,
                        "c_description": data[0].c_description,
                        "c_duration": data[0].c_duration,
                        "c_tag": data[0].c_tag,
                        "c_state": data[0].c_state,
                        "c_image": data[0].c_image,
                        "c_isManagerSign":data[0].c_is_manager_sign,  
                        "c_isStepInOrder":data[0].c_is_step_in_order,
                        "is_default_course": data[0].is_default_course,
                        "start_time": data[0].start_time,
                        "assigned_by": data[0].assigned_by,
                        "customStepUrl": data[0].customstepurl,
                        "c_type": data[0].c_type,
                        "course_rating": rating.avg_rating,
                        "rating_count": rating.rating_count,
                        "steps": stepWithquiz ? value[value.length - 1] : steps
                    }

                    res.status(200).json({success:true, result:json});
                })
            })).catch(err => {
                res.status(500).json({success:true, result:err});
            })    
        } else {
            res.status(200).json({success:true, result:data});
        }
    });     
  
});

Router.get('/isassign/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.CheckCourseIsAssign(req.params.c_id, function(err, data){
        if (err) {
            console.log("check isassign course 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
        
    });     
  
});

Router.get('/oembed', function(req, res) {
    let { url } = req.query
    if( !!url === false ) {
        res.json({error: "No url found!"})
    }
    oembed.extract(url).then((oembed) => {
        // console.log(oembed);
        res.json(oembed)
    }).catch((err) => {
        // console.trace(err);
        res.json({error: err.message})
    });
})

Router.get('/oembed-bak', function(req, res) {
    let { url } = req.query
    if( !!url === false ) {
        res.json({error: "No url found!"})
    }
    // check response headers
    let options = {
        uri: url,
        method: 'GET'
    }
    request(options, (error, response, body) => {
        if(error) {
            return res.status(405).json(error)
        }
        let xFrameOpt = response.headers['x-frame-options'];
        console.log("x-frame-options", xFrameOpt)

        if(!!xFrameOpt === false) { // x-frame-options not set
            return res.json({iframeSrc: url})    
        }

        if( typeof xFrameOpt === 'string' && xFrameOpt.toLowerCase() === 'deny' || xFrameOpt.toLowerCase() === 'sameorigin') { // Check embed code
            // get embed url
            oembed.extract(url).then((oembed) => {
                console.log(oembed);
                res.json(oembed)
            }).catch((err) => {
                // console.trace(err);
                
                // embed manual conversion
                // google drive file link
                if(url.indexOf('https://drive.google.com/open?id=') != -1) {
                    let fileId = Utils.getQueryParams('id', url) || ''
                    let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
                    return res.json({iframeSrc: driveEmbedUrl})
                } else if(url.indexOf('https://drive.google.com/file/d/') != -1) {
                    let fileId = url.substr(url.indexOf('file/d/')+7).split("/")[0] || ''
                    let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
                    return res.json({iframeSrc: driveEmbedUrl})
                }

                res.json({error: err.message})
            });
        } else {
            res.json({iframeSrc: url})
        }
    })

})

Router.get('/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    let isQueryParamInteger = /^\d+$/.test(req.params.c_id);

    if(isQueryParamInteger === false) {
        res.status(422).json({success:false, message:"Invalid course ID"});
        return;
    }

    let roleID = Utils.getCourseAccessID(req.payload.role);
   
    CoursesCtrl.GetCustomCoursesById(req.payload._id, roleID, req.params.c_id, function(err, data) {
        if (err) {
            console.log("get courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(data.length) {
            db.GetCourseRating(req.params.c_id, function(err, rating) {
                if (err) {
                    console.log("err: " + err);
                    return res.status(400).json({status:false, result:"Something went wrong"});
                }
                if(data[0].c_is_deleted) {
                    res.status(400).json({status:false, result:"Course no longer available"})
                } else {
                    let steps = [];
                    let quizStep = [];

                    for(let i=0; i<data.length; i++) {
                        steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_iframeurl: data[i].iframe_url});
                        if(data[i].step_type === 'TaskToComplete_Quiz') {
                            quizStep.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id, step_iframeurl: data[i].iframe_url});
                        }
                    } 
                    //console.log("steps", steps);
                    let stepOptionPromise = [];
                    let showQues = data[0].c_state === "Draft" ? true : false;
                    let showCorrectAns = showQues

                    for(let q=0; q<quizStep.length; q++) {
                        stepOptionPromise.push(stepQuestionOptionPromise(req.params.c_id, quizStep[q].step_id, steps, showQues, showCorrectAns))
                    }

                    Promise.all(stepOptionPromise).then((value => {
                        let stepWithquiz = value[value.length - 1];
                        //console.log("stepWithquiz", stepWithquiz)
                        let json = {
                            "c_id": data[0].c_id,
                            "c_title": data[0].c_title,
                            "c_description": data[0].c_description,
                            "c_duration": data[0].c_duration,
                            "c_tag": data[0].c_tag,
                            "c_state": data[0].c_state,
                            "c_image": data[0].c_image,                                                                         
                            "c_isManagerSign":data[0].c_ismanagersign,  
                            "c_isStepInOrder":data[0].c_isstepinorder,
                            "c_is_deleted":data[0].c_is_deleted,
                            "steps": stepWithquiz ? value[value.length - 1] : steps,
                            "course_count": data[0].course_count === null ? 0 : data[0].course_count,
                            "c_type": data[0].c_type,
                            "course_rating": rating.avg_rating,
                            "rating_count": rating.rating_count,
                        }
            
                        res.status(200).json({success:true, result:json});
                    })).catch(err => {
                        res.status(500).json({success:false, message:err});
                    })
                }
            })
        } else {
            res.status(200).json({success:true, result:data});
        }
    });    
});

function stepQuestionOptionWithResult(userId, assign_c_id, assign_step_id, steps, step_id) {
    return new Promise((resolve, reject) => {
        Utils.GetQuizAnswers(userId, assign_c_id, assign_step_id, true, function(err, answers) {
            if (err) {
                console.log("err: " + err);
                return reject(err)
            }

            steps.forEach(val=> {
                console.log(answers);
                let json = {
                    welcome_text : answers[0].welcome_text !== null ? answers[0].welcome_text : '',
                    questions: answers
                }
                //console.log("step", val)
                if(val.step_id === step_id) {
                    val.step_quiz = json
                }
            });
            resolve(steps);
        });
    })
}

function stepQuestionOptionPromise(course_id, step_id, steps, showQuestions, showCorrectAns) {
    return new Promise((resolve, reject) => {
        db.GetQuizWelcomeText(step_id, function(err, welcomeText) {
            if (err) {
                console.log("get Welocme_text 500 error: ");
                reject(err);
                return;
            }
            db.GetStepQuizQuestions(course_id, step_id, function(err, questions) {
                if (err) {
                    console.log("get courses 500 error: ");
                    reject(err);
                    return;
                }
                let questionOptions = _.chain(questions)
                // Group the elements of Array based on `color` property
                .groupBy("id")
                // `key` is group's name (color), `value` is the array of objects
                .map((value, key) => ({ 
                k_id: value[0].id,
                question_type:value[0].question_type,
                ques: value[0].ques,
                ques_order: value[0].question_order,
                options: Utils.mapArray(value, showCorrectAns)
                }))
                .orderBy(val => Number(val.ques_order))
                .value()

                steps.forEach(val=> {
                    console.log(questionOptions);
                    let json = {
                        welcome_text : questions.length ? questions[0].welcome_text !== null ? questions[0].welcome_text : '' : showQuestions === true ? welcomeText.welcome_text : '',
                        questions: showQuestions ? questionOptions : []
                    }
                    //console.log("step", val)
                    if(val.step_id === step_id) {
                        val.step_quiz = json
                    }
                });
                resolve(steps);
                
            });
        })    
    })
}

Router.delete('/delete/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    CoursesCtrl.DeleteCustomCourse(req.payload._id, req.params.c_id, function(err, data) {
        if (err) {
            console.log("delete custom courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:data});
    });    
});

Router.delete('/:c_id', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    CoursesCtrl.DeleteDraftCustomCourse(req.payload._id, req.params.c_id, function(err, data) {
        if (err) {
            console.log("get courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        
        res.status(200).json({success:true, result:"Course Deleted Successfully"});
    });    
});

Router.put('/', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    if(Object.keys(req.body).length > 0) {
        // normal scenario
 
        if (!!req.body === false || !!req.body.c_title === false || !!req.body.c_description === false) {
            res.status(422).json({success:false, message:"Invalid form values"});
            return;
        }

        let schemaError = Joi.validate(req.body, customCourseBodySchema);
        
        if(schemaError.error != null) {
            return res.status(422).json({success:false, message:schemaError.error.message});
        }
       
        CoursesCtrl.UpdateCustomCourses(req.payload._id, req.body, req.body.c_image, req.payload, function(err, data){
            if (err) {
                console.log("insert courses 500 error: ", err);
                res.status(500).json({success:false, message:err});
                return;
            }
    
            res.status(200).json({success:true, result:"Course updated successfully"});
        });
    } else {

        // multipart form data
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({success:false, message:err})
            } else if (err) {
                return res.status(500).json({success:false, message:err})
            }

            let courseData = JSON.parse(req.body.courseData);

            let schemaError = Joi.validate(courseData, customCourseBodySchema);
            
            if(schemaError.error != null) {
                return res.status(422).json({success:false, message:schemaError.error.message});
            }

            if(!!courseData.c_image == true) {
               
                fs.unlink(path.join( __dirname, '../', courseData.c_image), (err) => {
                    if (err) {
                      console.error(err);
                      res.status(500).json({success:false, message:err});
                      return
                    }

                    CoursesCtrl.UpdateCustomCourses(req.payload._id, courseData, req.file.path, req.payload, function(err, data){
                        if (err) {
                            console.log("insert courses 500 error: ");
                            res.status(500).json({success:false, message:err});
                            return;
                        }
                
                        res.status(200).json({success:true, result:data});
                    });
                })
            } else {
                CoursesCtrl.UpdateCustomCourses(req.payload._id, courseData, req.file.path, req.payload, function(err, data){
                    if (err) {
                        console.log("insert courses 500 error: ");
                        res.status(500).json({success:false, message:err});
                        return;
                    }
            
                    res.status(200).json({success:true, result:data});
                });
            }
        })
    }     
  
});

Router.post('/assign', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body === false || !!req.body.c_id === false || !!req.body.c_id === false || req.body.c_title === false || req.body.emails.length < 1) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }
    
    CoursesCtrl.InsertAssignCourses(req.payload._id, req.body, req.payload, function(err, data){
        if (err) {
            console.log("insert courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data});
    });     
  
});

Router.post('/assign/startcourse', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.StartAssignCourse(req.payload._id, req.body, function(err, data){
        if (err) {
            console.log("start assign courses 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data[0].func_start_assign_course});
    }); 
});

Router.put('/assign/markcomplete', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.MarkStepComplete(req.payload._id, req.body, req.payload.tenant, function(err, data){
        if (err) {
            console.log("mark complete 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        res.status(200).json({success:true, result:data[0].func_mark_step_complete});
    }); 
});

Router.put('/assign/complete', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    
    CoursesCtrl.AssignCourseComplete(req.payload, req.body, function(err, data){
        if (err) {
            console.log("mark complete 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        res.status(200).json({success:true, result:data});
    }); 
});

Router.post('/assign/step/pitch', AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body === false ||  
        !!req.body.course_id === false || 
        !!req.body.step_id === false || 
        !!req.body.step_link === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }
    
    CoursesCtrl.AssignCourseStepPitch(req.payload, req.body, function(err, data){
        if (err) {
            console.log("assign step pitch 500 error: ");
            res.status(500).json({success:false, message:err});
            return;                                                                         
        }
        res.status(200).json({success:true, result:data});
    }); 
});

Router.use("/step/feedback", StepFeedBack);
Router.use("/step/quiz", StepQuiz);

module.exports = Router;