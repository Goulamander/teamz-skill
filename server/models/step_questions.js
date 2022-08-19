'use strict';

const Options = require('./question_options')
function StepQuestions(courseId, stepId, questionType, question, order) {
    this.course_id = courseId;
    this.step_id = stepId;
    this.question_type = questionType;
    this.question = question;
    this.ques_order = order;
    this.options = [];
}

StepQuestions.prototype.AddOptions = function(key, title, value, isCorrect) {
    let option = new Options(key, title, value, isCorrect);
      
    this.options.push(option);
}

StepQuestions.prototype.GetOptionKey = function() {
    let ret = [];
    for (let i = 0; i < this.options.length; ++i) {
      ret.push(this.options[i].key);
    }
    return ret;
}
  
StepQuestions.prototype.GetOptionTitle = function() {
    let ret = [];
    for (let i = 0; i < this.options.length; ++i) {
      ret.push(this.options[i].title);
    }
    return ret;
}

StepQuestions.prototype.GetOptionValue = function() {
    let ret = [];
    for (let i = 0; i < this.options.length; ++i) {
      ret.push(this.options[i].value);
    }
    return ret;
}

StepQuestions.prototype.GetOptionIsCorrect = function() {
    let ret = [];
    for (let i = 0; i < this.options.length; ++i) {
      ret.push(this.options[i].is_correct);
    }
    return ret;
}

module.exports = StepQuestions;