const db = require('../db');
const aws = require('aws-sdk');
const config = require('../config');

function OnboadingCtrl() {

}

var sourceEmail = config.SRC_EMAIL;

var ses = new aws.SES({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY,"region":config.SES_REGION});

function insertInvites(guid, userName, userEmail, name, email, selectedSchema) {
    return new Promise((resolve, reject) => {
        if(email != '' && guid != null) {
            db.SetSchema(selectedSchema, (err, schemaName) => {
                if(err) {
                    return reject(err);
                }   

                let tenant =  '';
                tenant = selectedSchema === 'public' ? 'app' : selectedSchema;

                //prohibited existing users re-invites
                db.GetUser(email, function(err, found, userDetails) {
                    if (err) {
                        console.log("err: " + err);
                        return reject("error");
                    }

                    if(found) {
                        console.log("already exist");
                        resolve("already exist");
                    } else {
                        
                        db.InsertInvites(guid, name, email, function(err, data) {
                        
                            if (err) {
                                console.log("err: " + err);
                                reject("error");
                            }

                            db.GetProfileData(guid, function(err, currentUser) {


                                if (err) {
                                    console.log("err: " + err);
                                    reject("error");
                                }
                                
                                const params = {    
                                    "Source": `TeamzSkill <${sourceEmail}>`,
                                    "Template": "InviteMemeberTemplate",
                                    "ConfigurationSetName": "TeamzSkillSignUp",
                                    "Destination": {
                                    "ToAddresses": [email]
                                    },
                                    "TemplateData": `{ \"userName\":\"${currentUser[0].first_name}\", \"userEmail\": \"${currentUser[0].email}\", \"tenant\":\"${tenant}\", \"baseUrl\":\"${config.HOST_NAME}\"}`
                                }
            
                                // send mail with ses
                                ses.sendTemplatedEmail(params, (err, data) => {
                                    if(err) {
                                        console.log(err);
                                        reject(err);
                                    }
                                    else {
                                        console.log(data.MessageId);
                                        resolve(data.MessageId);
                                    }
                                });
                            })
        
                        });
                    }
                })
            });
        } else {
            reject("error");
        }
    });
}

OnboadingCtrl.prototype.SendInvites = function(userId, userName, invites, payload, cb) {    
    let insertInvitesPromise = [];
    for(let i=0; i<invites.length; i++) {
        if(payload.email != invites[i].email) {
            let email = invites[i].email.trim().toLowerCase();
            insertInvitesPromise.push(insertInvites(userId, userName, payload.email, invites[i].name, email, payload.tenant ? payload.tenant : 'public'))
        }
    }

    Promise.all(insertInvitesPromise).then((data) => {
        cb(null, {success:true, message:"invites send successfully"});
    }).catch(err => {
        cb({success:false, message:"Something went wrong"})
    })
}

OnboadingCtrl.prototype.GetUser = function(guid, cb) {
    db.GetProfileData(guid, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        let userData = data[0];
        let json = {
            first_time_user: userData.is_new_user,
            email: userData.email,
            role: userData.user_role,
            job_title: userData.job_title,
            department: userData.department,
            firstname: userData.first_name,
            lastname: userData.last_name,
            zipcode: userData.zipcode || '',
            employeeNumber: userData.employee_number
        };
        cb(null, json);
    });
}

module.exports = new OnboadingCtrl();