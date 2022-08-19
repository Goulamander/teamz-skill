const db = require('../db');
const _ = require('lodash');
const Utils = require('../utils');

function StepQuizCtrl() {

}

StepQuizCtrl.prototype.GetStepQuizAnswers = function(userId, req, cb) {

    db.GetAssignCourseByCourseId(userId, req.body.c_id, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        let stepData = getQuizStepData(data, req.body.step_id);

        Utils.GetQuizAnswers(userId, stepData.assign_c_id, stepData.assign_step_id, false, function(err, answers) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }

            // let answersWithOptions = _.chain(answers)
            // // Group the elements of Array based on `color` property
            // .groupBy("id")
            // // `key` is group's name (color), `value` is the array of objects
            // .map((value, key) => ({ 
            // k_id: key, 
            // question_type:value[0].question_type,
            // answer: value[0].answers,
            // ques: value[0].ques,
            // // options: Utils.mapArray(value, true)
            // }))
            // .value() 
            // // console.log("answersWithOptions", answersWithOptions)
            cb(null, answers);
        });
    })
}

StepQuizCtrl.prototype.InsertStepQuizAnswers = function(userId, req, cb) {

    db.GetAssignCourseByCourseId(userId, req.body.c_id, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        let insertAnswers = [];
        let answers = req.body.answers;
        
        let stepData = getQuizStepData(data, req.body.step_id);
        if(stepData.quiz_attempts >= 3 || stepData.quiz_result >= 80) {
            return cb("You don't have access to re-submit the quiz");
        }

        for(let i=0; i<answers.length; i++) {
            insertAnswers.push(insertAnswer(userId, answers[i].k_id, stepData.assign_c_id, stepData.assign_step_id, answers[i].answer, stepData.c_id, stepData.step_id, req.payload.tenant ? req.payload.tenant : 'public'))
        }
        
        Promise.all(insertAnswers).then(value => {
            console.log("value", value);
            if(value != undefined) {
                let quizStatus = req.body.quiz_status === 'Completed' ? 'Completed' : 'Started';
                let attempts = stepData.quiz_attempts;

                Utils.quizResult(userId, quizStatus, req.body.step_id, req.body.c_id, function(error, quizResultData) {
                    let quiz_attempts = quizStatus === 'Completed' ? attempts + 1 : attempts;
                    db.UpdateQuizTraker(stepData.assign_step_id, quizStatus, quizResultData, quiz_attempts, function(err, quizTracker) {
                        if (err) {
                            console.log("err: " + err);
                            return cb({message:err.message})
                        }
                        cb(null, "Quiz saved successfully");
                    })
                });
            } else {
                cb(null, "Quiz not saved successfully");
            }
        }).catch(err => {
            console.log(err);
            cb(err);
        }) 
        
    })
}

function insertAnswer(userId, quesId, courseId, stepId, answers, customCourseId, customCoursStepId, tenant) {
    return new Promise((resolve, reject) => {
        db.SetSchema(tenant, function(err, val) {
            
            db.checkQuestionExist(quesId, customCoursStepId, customCourseId, function(err, exist, data) {
                if (err) {
                    console.log("get check question exist 500 error: ");
                    reject(err);
                    return;
                }
                if(exist) {
                    db.checkAnswerExist(quesId, stepId, courseId, function(err, found, data) {
                        if (err) {
                            console.log("get courses 500 error: ");
                            reject(err);
                            return;
                        }
                        
                        let answer = Utils.sortingAnswerString(answers);
    
                        if(found) {
                            db.UpdateStepQuizAnswers(quesId, courseId, stepId, answer, function(err, questions) {
                                if (err) {
                                    console.log("get courses 500 error: ");
                                    reject(err);
                                    return;
                                }
                                
                                resolve(questions);
                            });
                        } else {
                            db.InsertStepQuizAnswers(quesId, courseId, stepId, answer, function(err, questions) {
                                if (err) {
                                    console.log("get courses 500 error: ");
                                    reject(err);
                                    return;
                                }
                                
                                resolve(questions);
                            });
                        }
                    })
                } else {
                    resolve("question does not exist")
                }
            })
        })
    })
}

function getQuizStepData(data, step_id) {
    for(let j=0; j<data.length; j++) {
        if(data[j].step_id === step_id) {
            return data[j]
        }
    }

    return false;
}

module.exports = new StepQuizCtrl();