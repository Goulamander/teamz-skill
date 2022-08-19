const _ = require('lodash');
const aws = require('aws-sdk');
const urlMetadata = require('url-metadata');
const fetch = require('node-fetch');
const oembed = require('oembed-parser');

const db = require('../db');
const CustomCourse = require('../models/custom_couses');
const StepQuestions = require('../models/step_questions');
const config = require('../config');
const Utils = require('../utils');


function CoursesCtrl() {

}

var sourceEmail = config.SRC_EMAIL;

var ses = new aws.SES({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY,"region":config.SES_REGION});

CoursesCtrl.prototype.InsertCourses = function(userId, coursesData, cb) {
    db.InsertCourses(userId, coursesData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.GetCourses = function(userId, cb) {
    db.GetCourses(userId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.UpdateCourses = function(userId, coursesData, cb) {
    db.UpdateCourses(userId, coursesData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.DeleteCourses = function(userId, coursesData, cb) {
    db.DeleteCourses(userId, coursesData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.GetRecommendCourses = function(userId, payload, cb) {
    db.GetUserSkillsData(userId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        let recommandCourses = [];
        for(let i=0; i<data.length; i++) {
            let parent_skill_name = data[i].parent_skill_name;
            let skill_name = data[i].skill_name;
            // if(parent_skill_name == 'Software Engineering') {
            //     // As per client instructions if skill is data science then course description should not contain 'Biology'
            //     recommandCourses.push(recommendCoursesPromise(parent_skill_name, skill_name, data[i].skill_level));
            // } else {
            //     recommandCourses.push(recommendCoursesPromise(parent_skill_name, skill_name, ''));
            // }
            recommandCourses.push(recommendCoursesPromise(parent_skill_name, skill_name, data[i].skill_level, payload.tenant ? payload.tenant : 'public'));
        }

        Promise.all(recommandCourses).then((data) => { 
            if(data.length) {
                var myNewArray = data.reduce(function(prev, curr) {
                    return prev.concat(curr);
                });

                var courses =  _.chain(myNewArray)
                // Group the elements of Array based on `color` property
                .groupBy("rowindex")
                // `key` is group's name (color), `value` is the array of objects
                .map((value, key) => (value))
                .value();

                cb(null, courses);
            } else {
                cb(null, data);
            }
        }).catch((err) => {
            console.log(err);
            cb(err);
        })
    });
}

function recommendCoursesPromise(args1, args2, skill_level, selectedSchema) {
    return new Promise((resolve, reject) => {
        db.SetSchema(selectedSchema, (err, schemaName) => {
            if(err) {
                return reject(err);
            } 
    
            db.GetRecommendCourses(args1, args2, skill_level, function(err, value){
                if (err) {
                    console.log("err: " + err);
                    reject(err);
                }
                // let json = {
                //     parent_skill_name: args1,
                //     skill_name: args2,
                //     courses: value
                // }

                resolve(value);
            });
        })
    });   
}

CoursesCtrl.prototype.InsertCustomCourses = function(userId, coursesData, imageUrl, payload, cb) {
    let custom = new CustomCourse(coursesData.c_title, coursesData.c_description, coursesData.c_duration, coursesData.user_role, coursesData.c_tag, coursesData.c_state, coursesData.c_isManagerSign, coursesData.c_isStepInOrder, coursesData.c_type, coursesData.steps);

    // for(let i=0; i<coursesData.steps.length; i++) {
    //   custom.AddStep(coursesData.steps[i].step_link, coursesData.steps[i].step_title, coursesData.steps[i].step_type, coursesData.steps[i].step_quiz ? coursesData.steps[i].step_quiz : '')
    // }
    let insertStepIframeUrl = [];
    for(let i=0; i<coursesData.steps.length; i++) {
        insertStepIframeUrl.push(stepIframeUrlFunction(custom, coursesData.steps[i], coursesData.steps[i].index = i))
    }
    
    Promise.all(insertStepIframeUrl).then(data => {
        db.InsertCustomCourses(userId, custom, imageUrl, function(err, cdata) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }
            
            console.log("cdata", cdata.func_insert_custom_courses);
            let roleID = Utils.getCourseAccessID(payload.role);
    
            db.GetCustomCourseByCourseId(userId, roleID, cdata.func_insert_custom_courses, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }
                
                if(data.length) {
                    let steps = [];
                    let customSteps = custom.GetQuizQuestionStep();
    
                    for(let i=0; i<data.length; i++) {
                        if(data[i].step_type === 'TaskToComplete_Quiz')
                        steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id});
                    }
    
                    if(steps.length) {
                        if(steps.length === customSteps.length) {
                            let insertQuestions = [];
                            for(let k=0; k<steps.length; k++) {
                                insertQuestions.push(insertQuestionsPromise(userId, cdata.func_insert_custom_courses, steps[k].step_id, customSteps[k].questions, customSteps[k].welcome_text ? customSteps[k].welcome_text : '', payload.tenant ? payload.tenant : 'public'));
                            }
    
                            Promise.all(insertQuestions).then((value) => { 
                                console.log("value", value);
                                cb(null, cdata)
                            }).catch((err) => {
                                console.log(err);
                                cb(err);
                            })
    
                        } else {
                            cb("There is error in insertion of steps")
                        }
                    } else {
                        cb(null, cdata);
                    }
                
                    
                } else {
                    cb("no step found for this course")
                }
            })
        });
    }).catch(err=>{
        cb("something went wrong")
    })
}

function stepIframeUrlFunction(custom, steps, courseIndex) {
    return new Promise((resolve, reject) => {
        
        if(steps.step_type === 'InternalContent' || steps.step_type === 'ExternalContent') {
            let promise = Utils.iframeyStepLinks(steps.step_link)
            promise.then(data => {
                console.log("data", data)
                if(data) {
                    custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', data, courseIndex)
                    resolve()
                } else {
                    // custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', '')
                    // resolve()
                    let embedUrl = steps.step_link;
                    if(embedUrl != '') {
                        oembed.extract(embedUrl).then((res) => {
                            console.log("res",res)
                            console.log("_get_oembed", !!res.html)
                            if(!!res.html === true) {
                                let ombedUrl = res.html.split('src=')[1].split(/[ >]/)[0].replace('"', '').replace('"', '');
                                custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', ombedUrl, courseIndex)
                                resolve()
                            } else {
                                custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', '', courseIndex)
                                resolve() 
                            }
                        }).catch((err) => {
                            custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', '', courseIndex)
                            resolve()
                        });
                    } else {
                        custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', '', courseIndex)
                        resolve() 
                    }
                }
            })
        } else {
            custom.AddStep(steps.step_link, steps.step_title, steps.step_type, steps.step_quiz ? steps.step_quiz : '', '', courseIndex)
            resolve()
        }
    })
}

function insertQuestionsPromise(userId, courseId, stepId, question, welcomeText, selectedSchema) {
    return new Promise((resolve, reject) => {
        let Question = question.questions;
        let insertQuesOptions= [];
        var quizQuestions;

        if(welcomeText != '') {
            console.log("welcomeText", welcomeText);
            db.insertQuizWelcomeText(stepId, welcomeText, function(err, text) {
                if(err) {
                    return reject(err);
                }

                for(let i=0; i< Question.length; i++) {

                    quizQuestions = new StepQuestions(courseId, stepId, Question[i].question_type, Question[i].ques, i+1);
        
                    let options = Question[i].options;
                    //console.log("option", options);
                    if(options != undefined) {
                        for(let j=0; j<options.length; j++) {
                            quizQuestions.AddOptions(options[j].option_key, options[j].option_title, options[j].option_value, options[j].is_correct)
                        }
                    }
                    //console.log("quizQuestions", quizQuestions);
                    insertQuesOptions.push(insertQuesOptionsPromise(userId, quizQuestions, selectedSchema));
                }
            })
        } else {
            for(let i=0; i< Question.length; i++) {

                quizQuestions = new StepQuestions(courseId, stepId, Question[i].question_type, Question[i].ques, i+1);
    
                let options = Question[i].options;
                //console.log("option", options);
                if(options != undefined) {
                    for(let j=0; j<options.length; j++) {
                        quizQuestions.AddOptions(options[j].option_key, options[j].option_title, options[j].option_value, options[j].is_correct)
                    }
                }
                //console.log("quizQuestions", quizQuestions);
                insertQuesOptions.push(insertQuesOptionsPromise(userId, quizQuestions, selectedSchema));
            }
        }      

        Promise.all(insertQuesOptions).then((value1) => { 
            resolve(value1);
        }).catch((err) => {
            console.log(err);
            return reject(err);
        })
    });   
}

function insertQuesOptionsPromise(userId, quizQuestions, selectedSchema) {
    return new Promise((resolve, reject) => {
        db.SetSchema(selectedSchema, (err, schemaName) => {
            if(err) {
                reject(err);
            } 
    
            db.InsertStepQuizQuestions(userId, quizQuestions, function(err, insertedData) {
                if(err) {
                    return reject(err);
                }

                resolve(insertedData);
            })
        })
    });   
}

CoursesCtrl.prototype.GetCustomCourses = function(userId, roleId, cb) {
    db.GetCustomCourses(userId, roleId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

//Temp function to update iframeUrl
CoursesCtrl.prototype.UpdateCustomCourseSteps = function(cb) {
    db.GetNullableIframeUrlCourseSteps(function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        let insertStepIframeUrl = [];
        for(let i=0; i<data.length; i++) {
            insertStepIframeUrl.push(updateStepIframeUrlFunction(data[i]))
        }

        Promise.all(insertStepIframeUrl).then(val => {
            cb(null, data);
        }).catch(err => {
            cb(err);
        })
    });
}

function updateStepIframeUrlFunction(steps) {
    return new Promise((resolve, reject) => {
        
        if(steps.e_type === 'InternalContent' || steps.e_type === 'ExternalContent') {
            let promise = Utils.iframeyStepLinks(steps.s_link)
            promise.then(data => {
                if(data) {
                    db.UpdateCustomCourseSteps(steps, data, function(err, update) {
                        if(err) {
                            return reject(err)
                        }

                        resolve(data)
                    })
                } else {
                    let embedUrl = steps.s_link;
                    if(embedUrl != '') {
                        oembed.extract(embedUrl).then((res) => {
                            if(!!res.html === true) {
                                let ombedUrl = res.html.split('src=')[1].split(/[ >]/)[0].replace('"', '').replace('"', '');
                                db.UpdateCustomCourseSteps(steps, ombedUrl, function(err, update) {
                                    if(err) {
                                        return reject(err)
                                    }
            
                                    resolve(ombedUrl)
                                })
                            } else {
                                db.UpdateCustomCourseSteps(steps, '', function(err, update) {
                                    if(err) {
                                        return reject(err)
                                    }
            
                                    resolve('')
                                }) 
                            }
                        }).catch((err) => {
                            console.log("catch", err);
                            db.UpdateCustomCourseSteps(steps, '', function(err, update) {
                                if(err) {
                                    return reject(err)
                                }
        
                                resolve('')
                            })
                        });
                    } else {
                        db.UpdateCustomCourseSteps(steps, '', function(err, update) {
                            if(err) {
                                return reject(err)
                            }
    
                            resolve('')
                        }) 
                    }
                }
            })
        } else {
            db.UpdateCustomCourseSteps(steps, '', function(err, update) {
                if(err) {
                    return reject(err)
                }

                resolve('')
            })
        }
    })
}

// End of temp

CoursesCtrl.prototype.GetCustomCoursesById = function(userId, roleID, courseId, cb) {
    if(roleID === '2') {
        db.CheckAssignCourseExist(userId, courseId, function(err, isFound, assigndata){
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }
            
            if (isFound && assigndata) {
                GetAssignCourseByIdCommonFunction(userId, 1, courseId, cb)
            } else {
                GetAssignCourseByIdCommonFunction(userId, roleID, courseId, cb)
            }

            
        })
    } else {
        GetAssignCourseByIdCommonFunction(userId, roleID, courseId, cb)
    }
}

function GetAssignCourseByIdCommonFunction(userId, roleID, courseId, cb) {
    db.GetCustomCourseByCourseId(userId, roleID, courseId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.GetAssignCourseByCourseId = function(userId, courseId, cb) {
    db.GetAssignCourseByCourseId(userId, courseId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.GetAssignCompleteCourseById = function(userId, courseId, cb) {
    db.GetAssignCompleteCourseById(userId, courseId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.UpdateCustomCourses = function(userId, coursesData, imageUrl, payload, cb) {
    let custom = new CustomCourse(coursesData.c_title, coursesData.c_description, coursesData.c_duration, coursesData.user_role, coursesData.c_tag, coursesData.c_state, coursesData.c_isManagerSign, coursesData.c_isStepInOrder, coursesData.c_type, coursesData.steps);

    // for(let i=0; i<coursesData.steps.length; i++) {
    //   custom.AddStep(coursesData.steps[i].step_link, coursesData.steps[i].step_title, coursesData.steps[i].step_type, coursesData.steps[i].step_quiz ? coursesData.steps[i].step_quiz : '')
    // }

    let insertStepIframeUrl = [];
    for(let i=0; i<coursesData.steps.length; i++) {
        insertStepIframeUrl.push(stepIframeUrlFunction(custom, coursesData.steps[i], coursesData.steps[i].index = i))
    }

    Promise.all(insertStepIframeUrl).then(data => {

        db.UpdateCustomCourses(userId, coursesData.c_id, custom, imageUrl, function(err, data) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }
                
            console.log(coursesData.c_id);
            let roleID = Utils.getCourseAccessID(payload.role);
        
            db.GetCustomCourseByCourseId(userId, roleID, coursesData.c_id, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }
                
                if(data.length) {
                    let steps = [];
                    let customSteps = custom.GetQuizQuestionStep();

                    for(let i=0; i<data.length; i++) {
                        if(data[i].step_type === 'TaskToComplete_Quiz')
                        steps.push({step_title:data[i].step_title, step_type:data[i].step_type, step_link: data[i].step_link, step_id: data[i].step_id});
                    }

                    if(steps.length) {
                        if(steps.length === customSteps.length) {
                            let insertQuestions = [];
                            for(let k=0; k<steps.length; k++) {
                                insertQuestions.push(insertQuestionsPromise(userId, coursesData.c_id, steps[k].step_id, customSteps[k].questions, customSteps[k].welcome_text ? customSteps[k].welcome_text : '', payload.tenant ? payload.tenant : 'public'));
                            }

                            Promise.all(insertQuestions).then((value) => { 
                                console.log("value", value);
                                cb(null, coursesData.c_id)
                            }).catch((err) => {
                                console.log(err);
                                cb(err);
                            })

                        } else {
                            cb("There is error in insertion of steps")
                        }
                    } else {
                        cb(null, coursesData.c_id);
                    }
                
                    
                } else {
                    cb("no step found for this course")
                }
            })
            
        })
    }).catch(err=>{
        cb("something went wrong")
    })
}

CoursesCtrl.prototype.DeleteDraftCustomCourse = function(userId, courseId, cb) {
    db.DeleteDraftCustomCourse(userId, courseId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.InsertAssignCourses = function(userId, coursesData, payload, cb) {

    db.GetCustomCourseByCourseId(userId, 1, coursesData.c_id, function(err, courses) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        if(courses[0].c_state === 'Draft') {
            return cb("you can't assign draft course to any user")
        }
        
        let stepIds = [];
        let stepTypes = [];
        for (let i = 0; i < courses.length; ++i) {
            stepIds.push(courses[i].step_id);
            stepTypes.push(courses[i].step_type);
        }
        let emails = [...new Set(coursesData.emails)];

        console.log("stepIds", stepIds);
        console.log("stepTypes", stepTypes);
        
        if(emails.length > 0) {
            var insertRecordPromise = [];
            for(let i=0; i<emails.length; i++) {
                let user_email = emails[i].trim().toLowerCase();
                insertRecordPromise.push(insertAssignCourses(user_email, userId, coursesData, stepIds, stepTypes, payload.tenant ? payload.tenant : 'public', payload))
            }

            Promise.all(insertRecordPromise).then(result => {
                console.log("result", result);
                if(emails.length === 1) {
                    if(result[0] === 'duplicate entry') {
                        cb("This course has already been assigned to the individual");
                    } else {
                        cb(null, "Courses Assigned Successfully");
                    }
                } else {
                    const isCourseAssignedToAllUser = [...new Set(result)];
                    console.log("isCourseAssignedToAllUser", isCourseAssignedToAllUser);
                    if(isCourseAssignedToAllUser.length === 1 && isCourseAssignedToAllUser[0] === 'duplicate entry') {
                        cb("This course has already been assigned to the individuals");
                    } else {
                        cb(null, "Courses Assigned Successfully");
                    }
                }
            }).catch(error => {
                cb(error);
            })

        } else {
            cb("Invalid courses payload");
        }   
    }) 
}

function insertAssignCourses(email, userId, coursesData, stepIds, stepTypes, selectedSchema, payload) {

    let insertErr = false;
   
    return new Promise((resolve, reject) => {
        db.SetSchema(selectedSchema, (err, schemaName) => {
            if(err) {
                return reject(err);
            }   
            
            db.GetUser(email, function(err, found, data){
                if (err) {
                    console.log("err: " + err);
                    return reject({message:"Something went wrong"})
                }
                
                if (found && data) {
                    db.CheckAssignCourseExist(data.uuid, coursesData.c_id, function(err, isFound, assigndata){
                        if (err) {
                            console.log("err: " + err);
                            return reject({message:"Something went wrong"})
                        }
                        
                        if (isFound && assigndata) {
                            return resolve("duplicate entry");
                        }

                        if(isFound == false) {
                            if(data.uuid === userId) {
                                resolve("Please assign course to different account. Course do not assign to existing login user.")
                            } else {
                                let tenant =  '';
                                tenant = selectedSchema === 'public' ? 'app' : selectedSchema;
                                db.InsertAssignCourses(userId, coursesData, stepIds, data.uuid, stepTypes, function(err, coursedata) {
                                    if (err) {
                                        console.log("err: " + err);
                                        reject({message:"Something went wrong"});
                                        insertErr = true;
                                    }

                                    console.log("insertEr", insertErr)
                                    
                                    if(!insertErr && !!coursesData.default_course === false) {

                                        db.GetProfileData(userId, function(err, currentUser) {

                                            if (err) {
                                                console.log("err: " + err);
                                                reject("error");
                                            }

                                            const params = {    
                                                "Source": `TeamzSkill <${sourceEmail}>`,
                                                "Template": "CourseAssignmentTemplate",
                                                "ConfigurationSetName": "TeamzSkillSignUp",
                                                "Destination": {
                                                "ToAddresses": [email]
                                                },
                                                "TemplateData": `{ \"userName\":\"${currentUser[0].first_name}\", \"userEmail\": \"${currentUser[0].email}\", \"tenant\":\"${tenant}\", \"baseUrl\":\"${config.HOST_NAME}\", \"recipientName\":\"${data.first_name}\"}`
                                            }
                        
                                            // send mail with ses
                                            ses.sendTemplatedEmail(params, (err, sesdata) => {
                                                if(err) {
                                                    console.log(err);
                                                    reject(err);
                                                }
                                                else {
                                                    console.log(sesdata.MessageId);
                                                    resolve(coursedata);
                                                }
                                            });
                                        })
                                    } else {
                                        resolve(coursedata);
                                    }
                                });
                            }
                        }
                    });
                }

                if(found == false) {
                    resolve("not found");
                }
            });
        })
    })
}

CoursesCtrl.prototype.GetAssignCourses = function(userId, cb) {
    db.GetAssignCourses(userId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        cb(null, data);
    });
}

CoursesCtrl.prototype.StartAssignCourse = function(userId, coursesData, cb) {
    
    db.StartAssignCourse(userId, coursesData.c_id, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

CoursesCtrl.prototype.MarkStepComplete = function(userId, coursesData, tenant, cb) {
    
    db.GetAssignStepData(userId, coursesData.c_id, coursesData.step_id, function(err, stepData) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        // db functions to check rating question for mark submit
        db.GetStepQuizQuestions(coursesData.c_id, coursesData.step_id, function(err, questions) {

            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }
            if(stepData.step_type === 'TaskToComplete_Quiz'){
                if(stepData.quiz_tracker !== 'Completed') {
                    return cb("Please submit quiz first"); 
                }
                
                else if(stepData.quiz_attempts < 3 && stepData.quiz_result < 80) {
                    if(questions.length === 1 && questions[0].question_type === 'RATING') {

                    } else {
                        return cb("You need 80% to pass the quiz");
                    }
                }
        
            }
        
            db.SetSchema(tenant, function(err, val) {
                db.MarkStepComplete(userId, coursesData.c_id, coursesData.step_id, function(err, data) {
                    if (err) {
                        console.log("err: " + err);
                        return cb({message:"Something went wrong"})
                    }
                    
                    cb(null, data);
                });
            })
        })
    });
}

CoursesCtrl.prototype.AssignCourseComplete = function(payload, coursesData, cb) {
    
    db.GetCustomCourseByCourseId(payload._id, 1, coursesData.c_id, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        if(data[0].c_ismanagersign) {
            
            db.AssignCourseComplete(payload._id, coursesData.c_id, function(err, updateddata) {
                if (err) {
                    console.log("err B: " + err);
                    return cb({message:"Something went wrong"})
                }
                
                cb(null, updateddata);
            });
            
        } else {
            db.AssignCourseComplete(payload._id, coursesData.c_id, function(err, data) {
                if (err) {
                    console.log("err C: " + err);
                    return cb({message:"Something went wrong"})
                }
                
                cb(null, data);
            });
        }
    });
}

// Insert step pitch external link provided by user 
CoursesCtrl.prototype.AssignCourseStepPitch = function(payload, courseData, cb) {
    
    let { course_id, step_id, step_link, step_title } = courseData;

    let promise = new Promise(function(resolve, reject) {
        
        // Hard-code few links
        if(Utils.msStreamRegx(step_link)) {

            // 1. microsoft stream links
            // example https://web.microsoftstream.com/video/f36603ec-7acc-4b95-94a6-8acd8d4890db
            let encodedUrl = encodeURIComponent(step_link)
            let embedUrl = `https://web.microsoftstream.com/oembed?url=${encodedUrl}`
            
            let options = {
                uri: embedUrl,
                method: 'GET'
            }
        
            request(options, (error, response, body) => {
                if(error) {
                    reject("Error in msStream link");
                }
                let JSONresponse = JSON.parse(body);
                // conditional if thumbnail_url not exist?
                JSONresponse.thumbnail_url ? resolve(JSONresponse.thumbnail_url) : resolve('') ;
            })
        } else {
            
            // google drive file link or Getting thumbnail from other links
            urlMetadata(step_link).then(data => {
                console.log("res",data);

                // Logic to get useful data
                let result = {
                    image: ''
                }
                
                //try get image
                try {
                    if(!!data.image) {
                        result.image = data.image;
                    }
                    if(!!result.image == false) {
                        if(!!data['og:image'])
                            result.image = data['og:image'];
                    }
                } catch(error) {
                    console.log(error);
                }

                resolve(result.image);
            }).catch(err => {
                console.log("err",err);
                resolve('')
            })
        }
    });

    promise.then(function(video_thumbnail) {
        console.log("video_thumbnail", video_thumbnail);
        db.GetAssignCourseByCourseId(payload._id, course_id, function(err, assign) {
            db.InsertStepPitch(payload._id, course_id, step_id, step_link, step_title, assign[0].assign_by_id, video_thumbnail, function(err, insertedData){
                if (err) {
                    console.log("insert step pitch 500 error: ", err);
                    cb({success:false, ...err});
                    return;
                }
        
                return cb(null, {success:true, result: "record inserted"})
            });
        })
    }).catch(function(err) {
        return cb({success:false, message: err})
    })
}

// ------Code below removed intentionally------