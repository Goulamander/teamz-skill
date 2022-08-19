const db = require('../db');
const uuidv1 = require('uuid/v1');
const Config = require('../config');
const request = require('request');
const Utils = require('../utils');
const AssignDefaultCourses = require('../assignDefaultCourses');
const aws = require('aws-sdk');
const config = require('../config');

function AuthCtrl() {

}

var sourceEmail = config.SRC_EMAIL;

var ses = new aws.SES({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY,"region":config.SES_REGION});

AuthCtrl.prototype.SlackAuth = function(queryData, tenant, cb) {   
    
    let redirect_uri = (!!queryData.redirect_url === true)? queryData.redirect_url : Config.SLACK_REDIRECT_URL;

    var options = {
        uri: Config.SLACK_AUTH_TO_ACCESS_URL
            +queryData.code+
            '&client_id='+Config.SLACK_CLIENT_ID+
            '&client_secret='+Config.SLACK_CLIENT_SECRET+
            '&redirect_uri='+redirect_uri,
        method: 'GET'
    }

    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            console.log("Error", JSONresponse);
            let json = {
                succes: false,
                result: {
                    message: "Error encountered"
                }
            };
            cb(json);
        }else {
            // success response from slack. 
            // TODO: logic for existing user
            db.checkSamlData('s_tenant_name', tenant, 'ts_tenants', 'ts_admin', function(err, found, tenantData) {
                if(found) {
                    if(tenantData.s_entity_type === 'slack') {
                        if(tenantData.s_team_id === JSONresponse.team.id) {
                            registerSlackUser(JSONresponse, tenant, function(err, success) {
                                if(err) {
                                    return cb(err);
                                }
        
                                cb(null, success)
                            });
                        } else {
                            return cb({success:false, message:"Invalid team"})
                        }
                    } else {
                        cb({success:false, message:"Slack is not configure for this tenant"})
                    }
                } else if(tenant === 'app') {
                    // allow slack on public tenant
                    registerSlackUser(JSONresponse, tenant, function(err, success) {
                        if(err) {
                            return cb(err);
                        }

                        cb(null, success)
                    });
                } else {
                    cb({success:false, message:"tenant not found"})
                }
            })
        }
    });
}

function registerSlackUser(JSONresponse, tenant, cb) {
    let guid = uuidv1();
    let user_email = JSONresponse.user.email.trim().toLowerCase();
    db.GetUser(user_email, function(err, found, data){
            
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        if (found && data) {
            // console.log("data", data);

            db.UpdateLastLogin(data.uuid, (err, update) => {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:"Something went wrong"})
                }

                db.CheckSchema((err, setSchema) => {
                    if(err) {
                        return cb({
                            success:false, message: err
                        });
                    }
                    let jwtToken = Utils.generateJwt(data.uuid, user_email, JSONresponse.user.name,data.user_role, setSchema.search_path);

                    let json = {
                        success: true,
                        result: JSONresponse.user,
                        first_time_user: data.first_time_user,
                        role: data.user_role,
                        token: jwtToken
                    };
                    cb(null, json);
                })
            }); 
        } 

        if(found == false) {

            db.InsertUserDetails(guid.toString(), JSONresponse.user.name, user_email, JSONresponse.user.image_512, JSONresponse.access_token, JSONresponse.team.id, true, 1, function(err) {
                if (err) {
                    cb(err)
                    return;
                }

                db.CheckSchema((err, setSchema) => {
                    if(err) {
                        return cb({
                            success:false, message: err
                        });
                    }

                    AssignDefaultCourses.assignDefaultCourse(user_email, tenant, function(err, successResult) {
                        if(err) {
                            console.log(err)
                        }
                        console.log(successResult)
                    });

                    let jwtToken = Utils.generateJwt(guid.toString(),user_email, JSONresponse.user.name, 1, setSchema.search_path);
                    
                    let json = {
                        success: true,
                        result: JSONresponse,
                        first_time_user: true,
                        role: 1, // For now hard coded
                        token: jwtToken
                    };
                    cb(null, json);
                })                        
            });
        }
        
    });
}

AuthCtrl.prototype.RegisterUser = function(userData, tenant, cb) {
    let userEmail = userData.email.trim().toLowerCase();
   
    if (!!userEmail === false || !!userData.password === false) {
        return cb("Bad request");
    }
    
    if(process.env.NODE_ENV === "sandbox") {
        db.CheckInviteExist(userEmail, function(err, found, data){
            if(found) {
                InsertRegisterUsers(userData, tenant, userEmail, function(err, data) {
                    if(err) {
                        return cb(err);
                    }
                    cb(null, data); 
                })
            } else {
                cb("You don't have access to sign up in system.");
            }
        });
    } else {
        InsertRegisterUsers(userData, tenant, userEmail, function(err, data) {
            if(err) {
                return cb(err);
            }
            cb(null, data);
        })
    }
}

function InsertRegisterUsers(userData, tenant, userEmail, cb) {
    var regexExp = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    if(regexExp.test(userEmail) === false) {

        cb("Invalid email address");

    } else if(userData.password.length < 6) {
        
        cb("Password must contain at least 6 charecter");

    } else {

        db.GetUser(userEmail, function(err, found, data){
       
            if (err) {
                console.log("err: " + err);
                return cb("Something went wrong")
            }
            
            if (found && data) {
                cb("Record already exist");
            }

            if(found == false) {
                let guid = uuidv1();
                let salt = Utils.RandomString(16);
                let password = Utils.GetHashUsingSalt(userData.password, salt);

                db.InsertUserRegisterDetails(guid.toString(), userEmail, password, salt, false, 4, '', '', '', '', '', '', null, '', function(err, result) {
                    if (err) {
                        cb("Something went wrong")
                        return;
                    }

                    // get uuid of newly signup user
                    let uuid = result.func_insert_user_registerdetails

                    let jwtToken = Utils.generateJwt(uuid, userEmail, '', 4, '');

                    let verified_code = Utils.RandomString(32);

                    const params = {    
                        "Source": `TeamzSkill <${sourceEmail}>`,
                        "Template": "SignupTemplate",
                        "ConfigurationSetName": "TeamzSkillSignUp",
                        "Destination": {
                        "ToAddresses": [userEmail]
                        },
                        "TemplateData": `{ \"email\":\"${userEmail}\", \"tenant\":\"${tenant}\", \"baseUrl\":\"${config.HOST_NAME}\",\"verifiedCode\":\"${verified_code}\"}`
                    }

                    db.InsertRandomCodes(uuid, verified_code, function(err, data) {
                        if (err) {
                            cb("Something went wrong")
                            return;
                        }
                        AssignDefaultCourses.assignDefaultCourse(userEmail, tenant, function(err, successResult) {
                            if(err) {
                                console.log(err)
                            }
                            console.log(successResult)
                        });

                        // send mail with ses
                        ses.sendTemplatedEmail(params, (err, sesdata) => {
                            if(err) {
                                console.log(err.message);
                                cb(err.message);
                            }
                            else {
                                console.log(sesdata.MessageId);
                                let json = {
                                    is_slack_user: false,
                                    first_time_user: true,
                                    email: userEmail,
                                    role: 4, // hard coded for now
                                    token: jwtToken
                                };
                                
                                cb(null, json); 
                            }
                        });
                    });
                });
            }
        })
    }
}

AuthCtrl.prototype.Login = function(queryData, cb) {

    let user_email = queryData.email.trim().toLowerCase(); 

    db.GetUser(user_email, function(err, found, data){

        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        if(found == false) {
           cb(null, found);
        }

        if (found && data) {

            if(data.verified) {
            
                var password = Utils.GetHashUsingSalt(queryData.password, data.salt);
                
                if(password == data.password) {
                    db.CheckSchema((err, setSchema) => {
                        if(err) {
                            return cb({
                                success:false, message: err
                            });
                        }
                        console.log("seleted schema", setSchema.search_path);

                        db.UpdateLastLogin(data.uuid, (err, update) => {
                            if (err) {
                                console.log("err: " + err);
                                return cb({message:"Something went wrong"})
                            }
                            let jwtToken = Utils.generateJwt(data.uuid, data.email, data.first_name, data.user_role, setSchema.search_path);
                            
                            let json = {
                                success: true,
                                first_time_user: data.first_time_user,
                                is_slack_user: data.is_slack_user,
                                role: data.user_role,
                                token: jwtToken
                            };
                            cb(null, found, json);
                        });
                    })
                    
                } else {
                    cb(null,false);
                }
            } else {
                cb('Please verify your email');
            }
        } 

    });
}

AuthCtrl.prototype.CreateSlackTenant = function(queryData, cb) {
    let regexSubdomain = Utils.GetValidSubDomain(queryData.subdomain);

    db.createFunctions('public', queryData.subdomain, false, function(err, result) {
        if(err) {
            console.log("createFunctions err: ", err)
            cb({success:false, message:err.message});
        }

        // after new schema created, make an entry into ts_admin->ts_tenant table
        db.checkSamlData('s_tenant_name', regexSubdomain, 'ts_tenants', 'ts_admin', function(err, found, data) {
            if (err) {
                console.log("checkSamlData err: " + err);
                return cb({success: false, message:err})
            }
            if(found) {
                cb({success: false, message: "Sorry this tenant already exists!"});
            }  else {
                // do an entry into ts_admin->ts_tenant table for this new tenant 

                let guid = uuidv1(); // create temporary uuid to add for slack based tenants
                
                db.insertAdminTenants(guid, queryData.subdomain, regexSubdomain, queryData.idp_type, queryData.team_id, function(err, tenant) {
                    if (err) {
                        console.log("err: " + err);
                        return cb({success: false, message:err})
                    }

                    cb(null, {success: true, result: "New tenant successfully created"})
                    
                })
            }
        })
    })
}

AuthCtrl.prototype.VerifyUser = function(code, cb) {
    db.checkRandomCode(code, function(err, found, codeData) {
        if (err) {
            console.log("err: " + err);
            return cb(err)
        }

        if(!found) {
            return cb("Invalid code")
        }

        db.verifyUser(codeData.k_user_id, function(err, value) {
            if (err) {
                console.log("err: " + err);
                return cb(err)
            }

            db.DeleteRandomCode(codeData.k_user_id, function(err, deletecode) {
                if (err) {
                    console.log("err: " + err);
                    return cb(err)
                }

                db.GetProfileData(codeData.k_user_id, function(err, data){

                    if(data[0].verified) {
                        db.CheckSchema((err, setSchema) => {
                            if(err) {
                                return cb({
                                    success:false, message: err
                                });
                            }
                            console.log("seleted schema", setSchema.search_path);
                            db.UpdateLastLogin(data[0].uuid, (err, update) => {
                                if (err) {
                                    console.log("err: " + err);
                                    return cb({message:"Something went wrong"})
                                }
                                let jwtToken = Utils.generateJwt(data[0].uuid, data[0].email, data[0].first_name, data[0].user_role, setSchema.search_path);
                                
                                let json = {
                                    success: true,
                                    first_time_user: data[0].is_new_user,
                                    is_slack_user: data[0].is_slack_user,
                                    role: data[0].user_role,
                                    email: data[0].email,
                                    token: jwtToken
                                };
                                cb(null, json);
                            });
                        })
                    } else {
                        cb('Please verify your email');
                    }
            
                });
            })
        });
    });
}

module.exports = new AuthCtrl();