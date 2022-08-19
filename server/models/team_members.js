'use strict';

function AddTeamMembers(teamMembersArray) {
  this.teamMembers = teamMembersArray;
}

AddTeamMembers.prototype.GetTeamMemberId = function() {
  let ret = [];
  for (let i = 0; i < this.teamMembers.length; ++i) {
    ret.push(this.teamMembers[i].user_id);
  }
  return ret;
}

AddTeamMembers.prototype.GetTeamId = function() {
    let ret = [];
    for (let i = 0; i < this.teamMembers.length; ++i) {
      ret.push(this.teamMembers[i].team_id);
    }
    return ret;
  }

module.exports = AddTeamMembers;