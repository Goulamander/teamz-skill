'use strict';

function Options(key, title, value, isCorrect) {
    this.key = key;
    this.title = title;
    this.value = value;
    this.is_correct = isCorrect;
}

module.exports = Options;