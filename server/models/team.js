'use strict';
const Utils = require('../utils');

function AddTeam(teamArray) {
  this.team = teamArray;
}


AddTeam.prototype.GetTeamName = function() {
  let ret = [];
  for (let i = 0; i < this.team.length; ++i) {
    ret.push(this.team[i].team_name.toLowerCase());
  }
  return ret;
}
  
AddTeam.prototype.GetTeamDes = function() {
  let ret = [];
  for (let i = 0; i < this.team.length; ++i) {
    ret.push(this.team[i].team_des);
  }
  return ret;
} 

AddTeam.prototype.GetInitialLetter = function() {
  let ret = [];
  for (let i = 0; i < this.team.length; ++i) {
    let initial_letter = this.team[i].team_name.split("")[0];
    ret.push(initial_letter.toUpperCase());
  }
  return ret;
}

AddTeam.prototype.GetColor = function() {
    let ret = [];
    for (let i = 0; i < this.team.length; ++i) {
      let color = Utils.getRandomColor();
      ret.push(color);
    }
    return ret;
}

module.exports = AddTeam;