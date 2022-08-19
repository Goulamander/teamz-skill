'use strict';
const Utils = require('../utils');

function AddExpTopics(topicsArray) {
  this.topics = topicsArray;
}


AddExpTopics.prototype.GetTopicName = function() {
  let ret = [];
  for (let i = 0; i < this.topics.length; ++i) {
    ret.push(this.topics[i].topic_name);
  }
  return ret;
}
  
AddExpTopics.prototype.GetTopicBgColor = function() {
    let ret = [];
    for (let i = 0; i < this.topics.length; ++i) {
      ret.push(this.topics[i].topic_bgcolor);
    }
    return ret;
}

AddExpTopics.prototype.GetTopicTextColor = function() {
    let ret = [];
    for (let i = 0; i < this.topics.length; ++i) {
      ret.push(this.topics[i].topic_text_color);
    }
    return ret;
}

AddExpTopics.prototype.GetTopicLink = function() {
    let ret = [];
    for (let i = 0; i < this.topics.length; ++i) {
      ret.push(this.topics[i].topic_link);
    }
    return ret;
}

AddExpTopics.prototype.GetTopicLinkType = function() {
    let ret = [];
    for (let i = 0; i < this.topics.length; ++i) {
      ret.push(this.topics[i].topic_link_type);
    }
    return ret;
}

module.exports = AddExpTopics;