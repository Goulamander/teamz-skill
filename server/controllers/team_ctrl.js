const db = require('../db');
const Utils = require('../utils');
const Team = require('../models/team');
const TeamMember = require('../models/team_members');

function TeamCtrl() {

}

TeamCtrl.prototype.CreateTeam = function(userId, teamDetails, cb) {
    let team = new Team(teamDetails);

    db.CheckTeamNameExist(team.GetTeamName(), function(err, found, teamData) {
        if(err) {
            return cb(err);
        }

        if(found) {
            return cb(`${teamData[0].s_name} Team name exists and courses have been assigned to this team.`)
        } else {
            db.CreateTeam(userId, team, function(err, data) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, "team created successfully");
            })
        }
    })
}

TeamCtrl.prototype.GetTeam = function(userId, roleId, cb) {

    let role = Utils.getUserRoleName(roleId);
    role = Utils.getUserRole(role);

    db.GetTeam(userId, role, function(err, data) {
        if(err) {
            return cb(err);
        }
        
        cb(null, data);
    })
}

TeamCtrl.prototype.UpdateTeam = function(userId, teamDetails, intialLetter, cb) {
    db.CheckTeamNameExist([teamDetails.team_name], function(err, found, teamData) {
        if(err) {
            return cb(err);
        }

        if(found) {
            return cb(`${teamData[0].s_name} team name already exists.`)
        } else {
            db.UpdateTeam(userId, teamDetails, intialLetter.toUpperCase(), function(err, data) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, "team updated successfully");
            })
        }
    })
}

TeamCtrl.prototype.DeleteTeam = function(userId, teamDetails, roleId, cb) {

    let role = Utils.getUserRoleName(roleId);
    role = Utils.getUserRole(role);
    
    let teams = [];
    teams.push(teamDetails.team_id);
    db.GetTeamsHasNotAssignedCourse(teams, null, function(err, teamsData) {
        if(err) {
            return cb(err);
        }
      
        if(teamsData === null) {
            console.log("teamsData", teamsData);
            db.DeleteTeamFromDb(userId, teamDetails.team_id, role, function(err, data) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, data);
            })
        } else {
            console.log("else part", teamsData);
            db.DeleteTeam(userId, teamDetails.team_id, role, function(err, data) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, data);
            })
        }
    })
}

TeamCtrl.prototype.AddTeamMemebrs = function(userId, teamMembers, cb) {

    let addTeamMebers = new TeamMember(teamMembers);
    let teamId= teamMembers[0].team_id;

    db.CheckTeamMemberExist(addTeamMebers.GetTeamMemberId(), teamId, function(err, found, teamMemberData) {
        if(err) {
            return cb(err);
        }

        if(found) {
            return cb(`${teamMemberData[0].s_first_name} ${teamMemberData[0].s_last_name} team member already exist in team.`)
        } else {
            db.AddTeamMembers(userId, addTeamMebers.GetTeamMemberId(), addTeamMebers.GetTeamId(), teamId, function(err, data) {
                if(err) {
                    return cb(err);
                }
                
                cb(null, "team created successfully");
            })
        }
    })
}

TeamCtrl.prototype.GetTeamMembers = function(userId, roleId, teamId, cb) {

    let role = Utils.getUserRoleName(roleId);
    role = Utils.getUserRole(role);

    db.GetTeamMembers(userId, role, teamId, function(err, data) {
        if(err) {
            return cb(err);
        }
        
        cb(null, data);
    })
}

TeamCtrl.prototype.DeleteTeamMembers = function(userId, roleId, teamId, memberId, cb) {

    let role = Utils.getUserRoleName(roleId);
    role = Utils.getUserRole(role);

    db.DeleteTeamMembers(userId, roleId, teamId, memberId, function(err, data) {
        if(err) {
            return cb(err);
        }
        
        cb(null, data);
    })
}

TeamCtrl.prototype.GetAllOrgUsers = function(userId, teamId, cb) {

    db.GetAllOrgUsers(userId, teamId, function(err, data) {
        if(err) {
            return cb(err);
        }
        
        cb(null, data);
    })
    
}

TeamCtrl.prototype.GetTeamMembersList = function(userId, role, teams, c_id, cb) {
    let incomingTeams = teams;

    db.GetTeamsHasNotAssignedCourse(teams, c_id, function(err, teamsData) {
        if(err) {
            return cb(err.message);
        }
        
        if(teamsData) {
            incomingTeams = incomingTeams.filter( function( el ) {
                return teamsData.indexOf( el ) < 0;
            });
            
            if(incomingTeams.length) {
                let combineArray = incomingTeams.concat(teamsData)
                db.GetTeamMembersList(combineArray, function(err, teamsMembers) {
                    if(err) {
                        return cb(err.message);
                    }
                    console.log("teamsMembers my_array", teamsMembers)
                    db.GetTeamMembersHasAssignedCourse(teamsMembers[0].user_ids, c_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        //console.log("membersWithCourse1", membersWithCourse);
                        let membersWithoutCourse = [];
                        membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                            return membersWithCourse.indexOf( el ) < 0;
                        });
                        //console.log("membersWithoutCourse1", membersWithoutCourse);
                        db.InsertTeamAssignCourses(userId, c_id, incomingTeams, function(err, value) {
                            if(err) {
                                return cb(err.message);
                            }
                            if(membersWithoutCourse.length === 0) {
                                return cb("This course has already been assigned to the teams")
                            }
                            cb(null, null, membersWithoutCourse);
                        })
                    })
                })
            } else {
                db.GetTeamMembersList(teamsData, function(err, teamsMembers) {
                    if(err) {
                        return cb(err.message);
                    }
                    
                    db.GetTeamMembersHasAssignedCourse(teamsMembers[0].user_ids, c_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        console.log("membersWithCourse", membersWithCourse);
                        let membersWithoutCourse = [];
                        membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                            return membersWithCourse.indexOf( el ) < 0;
                        });
                        
                        if(membersWithoutCourse.length === 0) {
                            return cb("This course has already been assigned to the team")
                        }

                        cb(null, "alreadyAssign", membersWithoutCourse)
                    })
                })
            }
        } else {
            db.GetTeamMembersList(incomingTeams, function(err, teamsMembers) {
                if(err) {
                    return cb(err.message);
                }
                console.log("teamsMembers", teamsMembers)
                if(teamsMembers[0].team_list != null) {
                    if(teamsMembers[0].team_list.length === 0) {
                        return cb("There are no team members in selected teams")
                    }
                    db.GetTeamMembersHasAssignedCourse(teamsMembers[0].user_ids, c_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        console.log("membersWithCourse", membersWithCourse);
                        if(membersWithCourse != null) {
                            let membersWithoutCourse = [];
                            membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                                return membersWithCourse.indexOf( el ) < 0;
                            });
                            if(membersWithoutCourse.length === 0) {
                                return cb("This course has already been assigned to the team")
                            }
                        }
                        db.InsertTeamAssignCourses(userId, c_id, incomingTeams, function(err, value) {
                            if(err) {
                                return cb(err.message);
                            }
            
                            cb(null, null, teamsMembers[0].team_list);
                        })
                    });
                } else {
                    cb("There are no team members in selected teams")
                }
            })
        }
    })
}

TeamCtrl.prototype.GetTeamMembersForCntRecommends = function(userId, role, teams, doc_id, doc_ser_id, cb) {
    let incomingTeams = teams;

    db.GetTeamsAlreadyRecommendCnt(teams, doc_id, doc_ser_id, function(err, existingTeamsData) {
        if(err) {
            return cb(err.message);
        }
        
        if(existingTeamsData) {
            incomingTeams = incomingTeams.filter( function( el ) {
                return existingTeamsData.indexOf( el ) < 0;
            });
            
            if(incomingTeams.length) {
                let newOldTeamsArray = incomingTeams.concat(existingTeamsData)
                db.GetTeamMembersList(newOldTeamsArray, function(err, teamsMembers) {
                    if(err) {
                        return cb(err.message);
                    }
                    console.log("teamsMembers my_array", teamsMembers)
                    db.GetTeamMembersHasRecommendCnt(teamsMembers[0].user_ids, doc_id, doc_ser_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        //console.log("membersWithCourse1", membersWithCourse);
                        let membersWithoutCourse = [];
                        membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                            return membersWithCourse.indexOf( el ) < 0;
                        });
                        //console.log("membersWithoutCourse1", membersWithoutCourse);
                        db.InsertTeamRecommendCnt(userId, doc_id, doc_ser_id, incomingTeams, function(err, value) {
                            if(err) {
                                return cb(err.message);
                            }
                            if(membersWithoutCourse.length === 0) {
                                return cb("This content has already been recommended to the teams")
                            }
                            cb(null, null, membersWithoutCourse);
                        })
                    })
                })
            } else {
                db.GetTeamMembersList(existingTeamsData, function(err, teamsMembers) {
                    if(err) {
                        return cb(err.message);
                    }
                    
                    db.GetTeamMembersHasRecommendCnt(teamsMembers[0].user_ids, doc_id, doc_ser_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        console.log("membersWithCourse", membersWithCourse);
                        let membersWithoutCourse = [];
                        membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                            return membersWithCourse.indexOf( el ) < 0;
                        });
                        
                        if(membersWithoutCourse.length === 0) {
                            return cb("This content has already been recommended to the team")
                        }

                        cb(null, "alreadyAssign", membersWithoutCourse)
                    })
                })
            }
        } else {
            db.GetTeamMembersList(incomingTeams, function(err, teamsMembers) {
                if(err) {
                    return cb(err.message);
                }
                console.log("teamsMembers", teamsMembers)
                if(teamsMembers[0].team_list != null) {
                    if(teamsMembers[0].team_list.length === 0) {
                        return cb("There are no team members in selected teams")
                    }
                    db.GetTeamMembersHasRecommendCnt(teamsMembers[0].user_ids, doc_id, doc_ser_id, function(err, membersWithCourse) {
                        if(err) {
                            return cb(err.message);
                        }

                        console.log("membersWithCourse", membersWithCourse);
                        if(membersWithCourse != null) {
                            let membersWithoutCourse = [];
                            membersWithoutCourse = teamsMembers[0].team_list.filter( function( el ) {
                                return membersWithCourse.indexOf( el ) < 0;
                            });
                            if(membersWithoutCourse.length === 0) {
                                return cb("This content has already been recommended to the team")
                            }
                        }
                        db.InsertTeamRecommendCnt(userId, doc_id, doc_ser_id, incomingTeams, function(err, value) {
                            if(err) {
                                return cb(err.message);
                            }
            
                            cb(null, null, teamsMembers[0].team_list);
                        })
                    });
                } else {
                    cb("There are no team members in selected teams")
                }
            })
        }
    })
}

module.exports = new TeamCtrl();