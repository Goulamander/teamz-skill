const db = require('../db');
const utils = require('../utils');
const uuidv1 = require('uuid/v1');
const Utils = require('../utils');
const AssignDefaultCourses = require('../assignDefaultCourses');

function OktaSamlCtrl() {

}

OktaSamlCtrl.prototype.OktaLogin = function(req, cb) {
    db.TenantConfigure(req.body.tenant, 's_tenant_name', (err, tenantData) => {

        if (err) {
            console.log("err: " + err);
            return cb('Something went wrong', 500);
        }
        
        let user_email = req.user.nameID.trim().toLowerCase();

        if(tenantData.s_entry_point != null && tenantData.b_saml_enable) {
            console.log("req.user", req.user);
            db.GetUser(user_email, function(err, found, data){

                if (err) {
                    console.log("err: " + err);
                    return cb(err, 500);
                }
                let reqType = Utils.getReqType(req.user.issuer);

                // saml custom attributes(JIT)
                let employeeNumber, 
                department, 
                managerId,
                manager,
                FirstName,
                Zipcode ,
                LastName,
                title,
                userRole;
                let azureJsonStr = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/';

                if(reqType === 'OKTA') {
                    employeeNumber = req.user.EmployeeNumber ? req.user.EmployeeNumber : '';
                    department = req.user.Department ? req.user.Department : '';
                    managerId = req.user.ManagerID ? req.user.ManagerID : '';
                    manager = req.user.Manager ? req.user.Manager : '';
                    FirstName = req.user.FirstName ? req.user.FirstName : '';
                    Zipcode = req.user.Zipcode ? req.user.Zipcode : '';
                    LastName = req.user.LastName ? req.user.LastName : '';
                    title = req.user.title ? req.user.title : '';
                    userRole = Utils.getUserRole(req.user.TeamzSkill_role ? req.user.TeamzSkill_role : 'IC');
                } else {
                    employeeNumber = req.user.employeeid ? req.user.employeeid : '';
                    department = req.user.department ? req.user.department : '';
                    managerId = req.user[azureJsonStr+'ManagerID'] ? req.user[azureJsonStr+'ManagerID']:'';
                    manager = req.user[azureJsonStr+'Manager'] ? req.user[azureJsonStr+'Manager'] : '';
                    FirstName = req.user.Firstname ? req.user.Firstname : '';
                    Zipcode = req.user.postalcode ? req.user.postalcode : '';
                    LastName = req.user.Lastname ? req.user.Lastname : '';
                    title = req.user.jobtitle ? req.user.jobtitle : '';
                    userRole = Utils.getUserRole(req.user[azureJsonStr+'role'] ? req.user[azureJsonStr+'role'] : 'IC');
                }

                if(found == false) {
                    console.log("reqDataFalse", employeeNumber, 
                        department, 
                        managerId,
                        manager,
                        FirstName,
                        Zipcode ,
                        LastName,
                        title,
                        userRole);
                    // this is new user. insert it into database
                    let guid = uuidv1();
                    
                    db.InsertUserRegisterDetails(guid.toString(), user_email, '', '', false, userRole, managerId, department, employeeNumber, manager, FirstName, LastName, Zipcode, title, function(err, result) {
                        if (err) {
                            return cb("Something went wrong", 500);
                        }

                        // get uuid of newly signup user
                        let uuid = result.func_insert_user_registerdetails

                        let jwtToken = utils.generateJwt(
                            uuid, 
                            user_email,
                            '',
                            userRole,
                            req.body.tenant
                        );
                        AssignDefaultCourses.assignDefaultCourse(user_email, req.body.tenant, function(err, successResult) {
                            if(err) {
                                console.log(err)
                            }
                            console.log(successResult)
                        });
                        let json = {
                            first_time_user: true,
                            email: user_email,
                            token: jwtToken,
                            role: userRole,
                            job_title: title,
                            department: department,
                            firstname: FirstName,
                            lastname: LastName,
                            zipcode: Zipcode,
                            employeeNumber: employeeNumber
                        };
                        
                        cb(null, 200, json);
                    });
                }
        
                if (found && data) {
                    console.log("reqData", employeeNumber, 
                        department, 
                        managerId,
                        manager,
                        FirstName,
                        Zipcode ,
                        LastName,
                        title,
                        userRole);
                    let userSamlRole;
                    if(reqType === 'OKTA') {
                        userSamlRole = req.user.TeamzSkill_role ? req.user.TeamzSkill_role:'';
                    } else {
                        userSamlRole = req.user[azureJsonStr+'role'] ? req.user[azureJsonStr+'role'] : '';
                    }

                    let params = `${employeeNumber != ''? 's_employee_number' : 'DASHED'},${department != ''? 's_department' : 'DASHED'},${managerId != '' ? 's_manager_id' : 'DASHED'},${manager != '' ? 's_manager' : 'DASHED'},${FirstName != '' ? 's_first_name' : 'DASHED'},${LastName != '' ? 's_last_name' : 'DASHED'},${title != '' ? 's_job_title' : 'DASHED'},${Zipcode != '' ? 's_zip_code' : 'DASHED'},${userSamlRole != '' ? 'k_role_id' : 'DASHED,'}`; 
                    
                    params = params.replace(/DASHED,/g, '').replace(/,\s*$/, "").trim();

                    let json = {
                        s_employee_number : employeeNumber != ''? employeeNumber : '',
                        s_department      : department != ''? department : '',
                        s_manager_id      : managerId != ''? managerId : '',
                        s_manager         : manager != ''? manager : '',
                        s_first_name      : FirstName != ''? FirstName : '',
                        s_last_name       : LastName != ''? LastName : '',
                        s_job_title       : title != ''? title : '',
                        s_zip_code        : Zipcode != ''? Zipcode : '',
                        k_role_id         : userSamlRole != ''? Utils.getUserRole(userSamlRole) : 4,
                    }

                    for (let propName in json) { 
                        if (json[propName] === null || json[propName] === undefined || json[propName] === '') {
                            delete json[propName];
                        }
                    }

                    let queryProp = createUpdateQuery('ts_user', json, data.uuid); 
                
                    if(!!params === true) { //saml params exist    
                        db.UpdateUserSamlDetail(queryProp.query, queryProp.params, function(err, result) {
                            if (err) {
                                return cb("Something went wrong", 500);
                            }

                            // get updated user row
                            db.GetProfileData(data.uuid, function(err, uData){
                                if(err) return cb("Something went wrong", 500);

                                db.updateTxVectorForProfileSearch(data.uuid, function(err, updatedData) {
                                    if(err) {
                                        return cb("Something went wrong", 500);
                                    }

                                    let userData = uData[0];
                                    let jwtToken = utils.generateJwt(
                                        data.uuid, 
                                        userData.email,
                                        userData.first_name,
                                        userData.user_role,
                                        req.body.tenant
                                    );
                                    
                                    let json = {
                                        first_time_user: userData.is_new_user,
                                        email: userData.email,
                                        token: jwtToken,
                                        role: userData.user_role,
                                        job_title: userData.job_title,
                                        department: department,
                                        firstname: userData.first_name,
                                        lastname: userData.last_name,
                                        zipcode: Zipcode,
                                        employeeNumber: employeeNumber
                                    };
                                    cb(null, 200, json);
                                })
                            })
                        })  
                    } else {
                        db.GetProfileData(data.uuid, function(err, uData){
                            if(err) return cb("Something went wrong", 500);

                            // no saml params only need to update last login
                            db.UpdateLastLogin(data.uuid, function(err, lastLogin) {
                                if(err) return cb("Something went wrong", 500);

                                let userData = uData[0];
                                let jwtToken = utils.generateJwt(
                                    data.uuid, 
                                    userData.email,
                                    userData.first_name,
                                    userData.user_role,
                                    req.body.tenant
                                );
                                
                                let json = {
                                    first_time_user: userData.is_new_user,
                                    email: userData.email,
                                    token: jwtToken,
                                    role: userData.user_role,
                                    job_title: userData.job_title,
                                    department: department,
                                    firstname: userData.first_name,
                                    lastname: userData.last_name,
                                    zipcode: Zipcode,
                                    employeeNumber: employeeNumber
                                };
                                cb(null, 200, json);
                            });
                        })
                    }
                } 
        
            });
        } else {
            cb("Tenant is not configured", 405);
        }

    })  
}

function createUpdateQuery(tablename, obj, uuid) {
    let update = ' UPDATE ' + tablename;
    let keys = Object.keys(obj);
    let dollar = keys.map(function (item, idx) { return '$' + (idx + 1); });
    let values = Object.keys(obj).map(function (k) { return obj[k]; });
    values.push(uuid);
    return {
        query: update + ' SET (' + keys + ', t_last_login )' + ' = (' + dollar + ', now())' + ' WHERE k_user_id = ' + `$${values.length}`,
        params: values
    }
}

OktaSamlCtrl.prototype.RegisterUser = function(email, pass, idp_type, subdomain, cb) {
    let validate_token = utils.RandomString(16);
    let guid = uuidv1();
    userPassword = Math.random().toString(16).slice(6);
    let salt = utils.RandomString(16);
    let password = utils.GetHashUsingSalt(pass, salt);
    let regexSubdomain = utils.GetValidSubDomain(subdomain);
  
    db.checkSamlData('s_tenant_name', regexSubdomain, 'ts_tenants', 'ts_admin', function(err, found, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:err})
        }
        if(found) {
            cb("Please select different sub domain");
        }  else {

            db.checkSamlData('s_email', email, 'ts_user', regexSubdomain, function(err, found, value) {
                if (err) {
                    console.log("err: " + err);
                    return cb({message:err})
                }

                if(found) {
                    cb("User already exist");
                } else {
                    db.CreateSamlUser(guid, email, regexSubdomain, function(err, result) {
                        if (err) {
                            console.log("err: " + err);
                            return cb({message:err})
                        }

                        db.CreateSamlUserAuth(result.k_user_id, password, salt, regexSubdomain, function(err, authData) {
                            if (err) {
                                console.log("err: " + err);
                                return cb({message:err})
                            }

                            db.insertAdminTenants(result.k_user_id, subdomain, regexSubdomain, idp_type, '', function(err, tenant) {
                                if (err) {
                                    console.log("err: " + err);
                                    return cb({message:err})
                                }

                                cb(null, found, authData)
                                
                            });
                            AssignDefaultCourses.assignDefaultCourse(email, regexSubdomain, function(err, successResult) {
                                if(err) {
                                    console.log(err)
                                }
                                console.log(successResult)
                            });  
                        })  
                    }) 
                }
            })
        }
    }) 
}

OktaSamlCtrl.prototype.SaveCompanySetting = function(guid, userData, cb) {
    db.SaveComapnySetting(guid, userData, function(err, tenant) {
        if (err) {
            console.log("err: " + err);
            return cb({message:err})
        }

        cb(null, tenant)
        
    }) 
}

OktaSamlCtrl.prototype.GetCompanySetting = function(guid, cb) {
    db.TenantConfigure(guid, 'k_user_id', function(err, tenantData) {
        if (err) {
            console.log("err: " + err);
            return cb({message:err})
        }

        cb(null, tenantData)
        
    }) 
}

OktaSamlCtrl.prototype.SaveXmlMetaData = function(guid, xmlData, certUrl, entryPoint, entityId, cb) {
    db.SaveXmlMetaData(guid, xmlData, certUrl, entryPoint, entityId, function(err, tenant) {
        if (err) {
            console.log("err: " + err);
            return cb({message:err})
        }

        cb(null, tenant)
        
    }) 
}

OktaSamlCtrl.prototype.UpdateItAdminPassword = function(guid, currpwd, newpwd, tenant, cb) {

    db.GetProfileData(guid, function(err, data) {

        if(data.length) {
            let currPassword = utils.GetHashUsingSalt(currpwd, data[0].salt);

            if(currPassword != data[0].password) {
                return cb("Current Password is Wrong")
            } else {
                let newPassword = utils.GetHashUsingSalt(newpwd, data[0].salt);
                db.UpdateItAdminPassword(guid, newPassword, tenant, function(err, tenantVal) {
                    if (err) {
                        console.log("err: " + err);
                        return cb(err)
                    }
            
                    cb(null, "Password Updated")
                    
                }) 
            }
        } else {
            cb("Record not found")
        }
    })
}

OktaSamlCtrl.prototype.RegisterTestAccount = function(req, cb) {
    db.TenantConfigure(req.body.tenant, 's_tenant_name', (err, tenantData) => {

        if (err) {
            console.log("err: " + err);
            return cb('Something went wrong', 500);
        }
    
        if(tenantData.s_entry_point != null && tenantData.b_saml_enable) {
            var regexExp = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

            if(regexExp.test(req.body.email) === false) {
                return cb("Invalid email address", 422);
            }

            db.GetUser(req.body.email, function(err, found, data){

                if (err) {
                    console.log("err: " + err);
                    return cb(err, 500);
                }


                
                let FirstName = req.body.FirstName?req.body.FirstName:'';
                let Zipcode = req.body.Zipcode?req.body.Zipcode:'';
                let LastName = req.body.LastName?req.body.LastName:'';
                let userRole = Utils.getUserRole(req.body.TeamzSkill_role);

                if(found == false) {
                    // this is new user. insert it into database
                    let guid = uuidv1();
                    let salt = utils.RandomString(16);
                    let password = utils.GetHashUsingSalt(req.body.password, salt);
                    
                    db.InsertUserRegisterDetails(guid.toString(), req.body.email, password, salt, false, userRole, '', '', '', '', FirstName, LastName, Zipcode, '', function(err, result) {
                        if (err) {
                            return cb("Something went wrong", 500);
                        }

                        // get uuid of newly signup user
                        let uuid = result.func_insert_user_registerdetails;

                        let jwtToken = utils.generateJwt(
                            uuid, 
                            req.body.email,
                            '',
                            userRole,
                            req.body.tenant
                        );
                        
                        let json = {
                            first_time_user: true,
                            email: req.body.email,
                            token: jwtToken,
                            role: userRole,
                            job_title: '',
                            department: '',
                            firstname: FirstName,
                            lastname: LastName,
                            zipcode: Zipcode,
                            employeeNumber: ''
                        };
                        
                        cb(null, 200, json);
                    });
                }
        
                if (found && data) {
                    cb("user already exist", 422);  
                } 
        
            });
        } else {
            cb("Tenant is not configured", 405);
        }

    })  
}

module.exports = new OktaSamlCtrl();