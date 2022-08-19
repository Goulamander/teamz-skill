const db = require('../db');
const moment = require('moment');

function LearningAnalyticsCtrl() {

}

LearningAnalyticsCtrl.prototype.GetAnalyticCourses = (guid, interval, c_type, cb) => {
  db.GetAnalyticCourses(guid, interval, c_type, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.GetDirectReports = function(guid, cb) {

  db.GetProfileData(guid, function(err, data) {
    if (err) {
      console.log("err: " + err);
      return cb({message:err})
    }

    if(data[0].employee_number === '') {
      return cb(null, [])
    }

    db.GetDirectReports(data[0].employee_number, function(err, tenantData) {
      if (err) {
          console.log("err: " + err);
          return cb({message:err})
      }

      cb(null, tenantData)
      
    })
  }) 
}

LearningAnalyticsCtrl.prototype.GetUserProfile = function(guid, cb) {

  db.GetProfileData(guid, function(err, profileData) {
    if (err) {
      console.log("err: " + err);
      return cb({message:err})
    }

    db.getWorkHighLights(guid, function(err, found, workHighlights) {
      if (err) {
          console.log("err: " + err);
          return cb({message:err})
      }

      db.GetCourses(guid, function(err, courses) {
        if (err) {
            console.log("err: " + err);
            return cb({message:err})
        }
  
        db.GetAchievements(guid, function(err, achievements) {
          if (err) {
              console.log("err: " + err);
              return cb({message:err})
          }
    
          db.GetAssignCourses(guid, function(err, assignCourses) {
            if (err) {
                console.log("err: " + err);
                return cb({message:err})
            }
            
            let InProgressAssignedCourses = assignCourses.filter((val, index) => {
              return val.c_state === 'Start';
            });

            let json = {
              profileData: profileData,
              workHighlights: workHighlights ? workHighlights.highlights : '',
              courses: courses,
              achievements: achievements,
              assignCourses: InProgressAssignedCourses
            }
      
            cb(null, json);
            
          })
          
        })
        
      })
      
    })
  }) 
}

LearningAnalyticsCtrl.prototype.GetMyLearning = (guid, interval, c_type, cb) => {
  
  let search_string;
  let dbArray = [];
  dbArray.push(guid);

  if(interval == 'all' && c_type != 'all') {
      search_string = `AND tcc.e_c_type = $2`;
      dbArray.push(c_type);
  } else if (interval != 'all' && c_type == 'all') {
      search_string = `AND tac.t_modified > CURRENT_DATE - ($2)::interval`;
      dbArray.push(interval);
  } else if(interval != 'all' && c_type != 'all') {
      search_string = `AND tac.t_modified > CURRENT_DATE - ($2)::interval AND tcc.e_c_type = $3`;
      dbArray.push(interval);
      dbArray.push(c_type);
  } else {
      search_string = "";
  }

  db.GetMyLearningListing(search_string, dbArray, (err, myLearningListing) => {
    
    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }

    db.GetMyLearning(search_string, dbArray, (err, myLearning) => {
    
      if (err) {
        console.log("err: " + err);
        return cb('Something went wrong');
      }

      let json = {
        "assigned_courses": myLearning? myLearning.assigned_courses: 0,
        "course_todo": myLearning? myLearning.course_todo: 0,
        "course_todo_rate": myLearning? myLearning.course_todo_rate: 0,
        "overdue": myLearning? myLearning.overdue: 0,
        "overdue_rate": myLearning? myLearning.overdue_rate: 0,
        "course_completed": myLearning? myLearning.course_completed: 0,
        "total_courses": myLearning? myLearning.total_courses: 0,
        "course_created": myLearning? myLearning.course_created: 0,
        "created_rate": myLearning? myLearning.created_rate: 0,
        "courses": myLearningListing
      }
  
      cb(null, json);
  
    })

  })
}

LearningAnalyticsCtrl.prototype.GetAnalyticsLeaners = (guid, interval, course_type, cb) => {
  db.GetAnalyticLeaners(guid, interval, course_type, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.GetAnalyticsIndividualLeaner = (guid, interval, course_type, cb) => {
  db.GetAnalyticsIndividualLeaner(guid, interval, course_type, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.GetAnalyticsIndividualCourse = (c_id, cb) => {
  db.GetAnalyticsIndividualCourse(c_id, '', (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.GetAnalyticsIndividualUserCourse = (guid,c_id, cb) => {
  db.GetAnalyticsIndividualUserCourse(guid, c_id, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.GetMyLearningCourse = (c_id, cb) => {
  db.GetAnalyticsIndividualCourse(c_id, 'limit 5', (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

LearningAnalyticsCtrl.prototype.DeleteCustomCourse = function(userId, courses, cb) {
  let checkCourseAssignArr = [];
  
  for(let i=0; i<courses.length; i++) {
    checkCourseAssignArr.push(checkCourseAssign(courses[i]))
  }

  Promise.all(checkCourseAssignArr).then(data => {
    console.log("courses", data);
    let deleteCourses = [];
    for(let i=0; i<courses.length; i++) {
      deleteCourses.push(deleteLearningAnalyticCourse(courses[i]))
    }
    Promise.all(deleteCourses).then(deletedCourses => {
      console.log("deletedCourses", deletedCourses);
      cb(null, deletedCourses);
    }, err => {
      console.log("err1", err)
      cb(err);
    }).catch(error => {
      console.log("error1", error)
      cb(error);
    })
  }, err => {
    console.log("check assign err", err)
    cb("You can't delete these courses right now. They are in-progress");
  }).catch(error => {
    console.log("check assign error", error)
    cb(error);
  })
}

function checkCourseAssign(courseId) {
  return new Promise(function(resolve, reject) {
    db.CheckCourseAssign(courseId, function(err, data) {
      if (err) {
        console.log("err: " + err);
        return reject("Something went wrong")
      }
      //console.log(data);
      if(data.length) {
        let completed = true;
        for(let i=0; i<data.length; i++) {
            if(data[i].e_state === 'UnStart' || data[i].e_state === 'Start') {
              completed = false;  
              break;   
            }
        }
        
        if(completed) {
          resolve("Course can be delete");
        } else {
          return reject("Unable to delete course");
        }
      } else {
        resolve("Course can be delete");
      }
    });
  })
}

function deleteLearningAnalyticCourse(courseId) {
  return new Promise(function(resolve, reject) {
    db.DeleteCustomCourse(null, courseId, function(err, data) {
      if (err) {
        console.log("err: " + err);
        return reject("Something went wrong")
      }

      if(data.length) {
        resolve("Course Deleted Successfully");
      } else {
        resolve("you are not created this course. Only author of this course can delete this course");
      }
    });
  })
}

module.exports = new  LearningAnalyticsCtrl();