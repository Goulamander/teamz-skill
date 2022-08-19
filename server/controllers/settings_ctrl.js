const db = require('../db');
const moment = require('moment');
const utils = require('../utils');

function SettingsCtrl() {

}

function saveProfileSkills(guid, skills, selectedSchema) {
    return new Promise((resolve, reject) => {
        db.SetSchema(selectedSchema, (err, schemaName) => {
            if(err) {
                reject(err);
            }   
            db.SaveSkills(guid, skills, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    reject("Something went wrong")
                }
                resolve(data);
            })
        })
        
    })
}

SettingsCtrl.prototype.saveProfile = function(payload, userData, cb) {
    console.log(payload._id);
    db.GetUserSkillsData(payload._id, (err, data) => {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        // if users skills already set that means user already submitted onboarding form.
        if(data.length == 0) {
            db.SaveProfileData(payload._id, userData, userData.role, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }
                console.log("updated user table");
    
                let insertProfileDataPromise = [];
                for(let i=0; i<userData.skills.length; i++) {
                    insertProfileDataPromise.push(saveProfileSkills(payload._id, userData.skills[i], payload.tenant ? payload.tenant : 'public'))
                }
    
                Promise.all(insertProfileDataPromise).then(data => {
                    cb(null, "Profile saved successfully.");
                }).catch(err => {
                    cb("Something went wrong");
                });
            });
        } else {
            cb("Invalid request")
        }
    })
}

SettingsCtrl.prototype.updateProfile = function(guid, userData, cb) {
    db.UpdateProfileData(guid, userData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        cb(null, "Profile updated successfully.");
    });
}

SettingsCtrl.prototype.GetProfileData = function(guid, cb) {
    db.GetProfileData(guid, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        db.getWorkHighLights(guid, function(err, found, result) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }
            if(found) {
                let json = {
                    user:data,
                    workHighlights: result.highlights
                } 
                cb(null, json)  
            }
    
            if(found == false) {
                let json = {
                    user:data,
                    workHighlights:''
                } 
                cb(null, json);
            }
            
        });
        
    });
}

SettingsCtrl.prototype.InsertWeeklyUpdate = function(guid, updatesData, cb) {
   
    if(utils.twelveDay(updatesData.start_date)) {
       return  cb("You can only update within a 12 days.");
    } else {
        db.GetLastCreatedWeeklyRecords(guid, updatesData.start_date, function(err, date) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            }

            if(date) {
                /*
                var sevenDay = 24*60*60*1000*7; // hours*minutes*seconds*milliseconds*day
                var firstDate = new Date(date[0].createddate);
                var secondDate = new Date();

                var diffTime = (secondDate.getTime() - firstDate.getTime() );
                */
            //    var currDate = new Date();
            //     var currentWeek = moment(currDate).isoWeek();
                // if(currentWeek > date[0].func_get_last_created_weekly_update) {

                //     db.InsertWeeklyUpdate(guid, updatesData, function(err, data) {
                //         if (err) {
                //             console.log("err: " + err);
                //             return cb({message:"Something went wrong"})
                //         }
                        
                //         cb(null, "weekly updates saved successfully");
                        
                //     });

                // } else {
                //     cb("you can update records after 7 days of last update.");
                // }
                // console.log(date);
                db.UpdateWeeklyUpdate(guid, updatesData, function(err, data) {
                    if (err) {
                        console.log("err: " + err);
                        return cb({message:"Something went wrong"})
                    }
                
                    cb(null, "weekly updates saved successfully");
                    
                });

            } else {
                db.InsertWeeklyUpdate(guid, updatesData, function(err, data) {
                    if (err) {
                        console.log("err: " + err);
                        return cb({message:"Something went wrong"})
                    }
                
                    cb(null, "weekly updates saved successfully");
                    
                });
            }
        })
    }
}

SettingsCtrl.prototype.GetWeeklyUpdates = function(guid, dates, cb) {
    db.GetWeeklyUpdates(guid, dates, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        if(data != undefined) {
            let json = {
                craftsmanship: data.craftsmanship,
                execution: data.execution,
                leadership: data.leadership,
                mentoring: data.mentoring
            }
            cb(null, json);
            /*
            var createDate = data.createddate; //your input date here

            var currentDate = new Date(); // today date
            currentDate.setMonth(currentDate.getMonth() - 6);  //subtract 6 month from current date 
   
            if (createDate > currentDate) {
                console.log("date is less than 6 month");
                let json = {
                    craftsmanship: data.craftsmanship,
                    execution: data.execution,
                    leadership: data.leadership,
                    mentoring: data.mentoring
                }
                cb(null, json);
            } else {
                console.log("date is greater than 6 month");
                cb("past time");
            }
            */
        } else {
            cb(null, "Record Not Found")
        }
        
    });
}

SettingsCtrl.prototype.insertWorkHighlights = function(guid, data, cb) {
    db.getWorkHighLights(guid, function(err, found, user) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        if(!found) {

            db.insertWorkHighlights(guid, data, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }
        
                cb(null, "inserted successfully.");
            });

        } else {

            db.updateWorkHighlights(guid, data, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }
        
                cb(null, "updated successfully.");
            });

        }

    });
}

SettingsCtrl.prototype.getWorkHighlights = function(guid, cb) {
    db.getWorkHighLights(guid, function(err, found, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        if(found) {
           cb(null, data.highlights)  
        }

        if(found == false) {
            cb(null, found);
        }
        
    });
}

SettingsCtrl.prototype.GetAllUser = function(guid, cb) {
    db.GetAllUser(guid, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

SettingsCtrl.prototype.CreateSchema = function(cb) {
    db.CreateSchema('public', 'tenant3', function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

SettingsCtrl.prototype.GetSearchProfile = function(text, cb) {
    let textData = text.replace(/\s+/g, ' | ');
    db.GetSearchProfile(textData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        cb(null, data);
        
    });
}

SettingsCtrl.prototype.getUserSkills = function(payload, cb) {

    db.GetUserSkillsData(payload._id, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        db.GetProfileData(payload._id, function(err, profileData) {
            if (err) {
                console.log("err: " + err);
                return cb({message:"Something went wrong"})
            } 

            let json = {
                userSkills: data,
                user_name: profileData[0].first_name
            }
    
            cb(null, json);
        });
    });
}

SettingsCtrl.prototype.updateUserSkills = function(payload, skills, cb) {

    let skillIds = [];
    let skillValues = [];

    for(let i=0; i<skills.length; i++) {
        skillIds.push(skills[i].skill_id); 
        skillValues.push(skills[i].skill_level); 
    }
    
    db.UpdateUserSkills(payload._id, skillIds, skillValues, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        cb(null, data);
        
    });
}

SettingsCtrl.prototype.GetUserAccessRole = function(guid, cb) {
    db.GetUserAccessRole(guid, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

SettingsCtrl.prototype.ManageUserAccessRole = function(userData, cb) {
    db.ManageUserAccessRole(userData, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

SettingsCtrl.prototype.SaveCompanyLogo = function(sqlQuery, queryArray, cb) {
    db.SaveCompanyLogo(sqlQuery, queryArray, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        cb(null, "logo updated successfully.");
    });
}

SettingsCtrl.prototype.GetCompanyLogoAndPlaceholder = function(tenant, cb) {
    db.TenantConfigure(tenant, 's_tenant_name', function(err, tenantData) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        let json = {
            company_logo : tenantData.s_company_logo,
            placeholder_logo : tenantData.s_placeholder_logo
        }

        cb(null, json);
    })
}

SettingsCtrl.prototype.SetSalesforceEmail = function(sEmail, tenant, cb) {
    db.SetSalesforceEmail(sEmail, tenant, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        cb(null, "email updated successfully.");
    });
}

SettingsCtrl.prototype.GetSalesforceEmail = function(tenant, cb) {
    db.TenantConfigure(tenant, 's_tenant_name', function(err, tenantData) {
        if (err) {
            console.log("err: " + err);
            return cb("Something went wrong")
        }
        
        let email = tenantData.s_salesforce_email ? tenantData.s_salesforce_email :  '';

        cb(null, email)
    });
}

module.exports = new SettingsCtrl();