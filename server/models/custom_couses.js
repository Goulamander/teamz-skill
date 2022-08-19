'use strict';

const Step = require('./step');
 function CustomCourse(address, description, duration, user_role, tag, state, is_manager_sign, is_step_in_order, course_type, steps) {
  this.title = address;
  this.description = description;
  this.duration = duration;
  this.user_role = user_role;
  this.tag = tag;
  this.state = state;
  this.is_manager_sign = is_manager_sign;
  this.is_step_in_order = is_step_in_order;
  this.c_type = course_type;
  this.steps = steps;
}

CustomCourse.prototype.AddStep = function(link, title, type, stepQuestions, iframeyStepLink, courseIndex) {
  let step = new Step(link, title, type, stepQuestions, stepQuestions.welcome_text, iframeyStepLink);
  for(let i = 0; i< this.steps.length; i++) {
    if(courseIndex === i) {
      this.steps[i] = step
    }
  }
}
CustomCourse.prototype.GetStepTitle = function() {
  let ret = [];
  for (let i = 0; i < this.steps.length; ++i) {
    ret.push(this.steps[i].title);
  }
   return ret;
}

CustomCourse.prototype.GetStepType = function() {
  let ret = [];
   for (let i = 0; i < this.steps.length; ++i) {
    ret.push(this.steps[i].type);
  }
   return ret;
}

CustomCourse.prototype.GetStepLink = function() {
  let ret = [];
   for (let i = 0; i < this.steps.length; ++i) {
    ret.push(this.steps[i].link);
  }
   return ret;
}

CustomCourse.prototype.GetQuizQuestionStep = function() {
  let ret = [];
   for (let i = 0; i < this.steps.length; ++i) {
    if(this.steps[i].type === 'TaskToComplete_Quiz') { 
      ret.push({title : this.steps[i].title, welcome_text:this.steps[i].welcome_text , questions: this.steps[i].questions});
    }
  }
   return ret;
}

CustomCourse.prototype.GetStepIframeUrl = function() {
  let ret = [];
   for (let i = 0; i < this.steps.length; ++i) {
    ret.push(this.steps[i].iframe_url);
  }
   return ret;
}

module.exports = CustomCourse;