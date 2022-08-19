'use strict';

function Step(link, title, type, questions, welcomeText, iframe_url) {
    this.link = link;
    this.title = title;
    this.type = type;
    this.questions = questions;
    this.welcome_text = welcomeText;
    this.iframe_url = iframe_url;
}

module.exports = Step;