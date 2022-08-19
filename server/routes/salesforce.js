'use strict';

const Express = require('express');
const Router = Express.Router();
const jsforce = require('jsforce')
const fs = require('fs');
const base64url = require('base64-url');
const jwt = require('jsonwebtoken');
const request = require('request');
const path = require('path');
const CronJob = require('cron').CronJob;

const Config = require('../config');
const db = require('../db');
const SettingsCtrl = require('../controllers/settings_ctrl');

function extractAccessTokenAPI(err, remoteResponse, remoteBody, res, queryparam){
	if (err) { 
		return res.status(500).json({status: false, message:'something went wrong'+err}); 
	}
	
	var sfdcResponse = JSON.parse(remoteBody); 

	//success
	if(sfdcResponse.access_token){	
        //console.log(sfdcResponse);			 
		var conn = new jsforce.Connection({
            instanceUrl: sfdcResponse.instance_url,
            accessToken: sfdcResponse.access_token
        });

        conn.query(`Select CreatedById, CreatedDate, ForecastingTypeId, Id, IsAmount, IsQuantity, QuotaAmount, QuotaOwnerId, StartDate FROM ForecastingQuota`, function (err, forecastingQuota) {
            if(err) {
                return res.status(500).json({status: false, message:'something went wrong'+err})
            }
            
            conn.query(`Select AccountId, Amount, CloseDate, CreatedById, CreatedDate, ExpectedRevenue, Fiscal, FiscalQuarter, FiscalYear, ForecastCategory, Id, Name, OwnerId, Probability, StageName, TotalOpportunityQuantity, Type FROM Opportunity`, function (err, opportunity) {
                if(err) {
                    return res.status(500).json({status: false, message:'something went wrong'+err})
                }
                
                conn.query(`Select Alias, City, CompanyName, Email, FederationIdentifier, FirstName, ForecastEnabled, Id, IsActive, LastName, ManagerId, Name, PostalCode, ProfileId, Title, UserRoleId, UserType, Username FROM User`, function (err, users) {
                    if(err) {
                        return res.status(500).json({status: false, message:'something went wrong'+err})
                    }
                    let user = JSON.stringify(users.records);
                    let opp= JSON.stringify(opportunity.records);
                    let forecasting = JSON.stringify(forecastingQuota.records);
                    db.InsertSalesforceData(user, opp, forecasting, function(err, data) {
                        if(err) {
                            return res.status(500).json({status: false, message:'something went wrong'+err})
                        }
                        
                        let json = {
                            instanceUrl: sfdcResponse.instance_url,
                            accessToken: sfdcResponse.access_token,
                            forecastingQuota: forecastingQuota.records,
                            opportunity: opportunity.records,
                            users: users.records,
                            dbRes: data
                        }
                        res.status(200).json({success:true, result: json}); 

                    })
                }); 
            });

        });
	}else{
		res.status(500).json({status: false, message:'Some error occurred. Make sure connected app is approved previously if its JWT flow, Username and Password is correct if its Password flow.' + remoteBody}); 
	}
}

// Router.get('/jwt', function(req, res, next) {
//     if (!!req.payload === false || !!req.payload._id === false || !!req.payload.tenant === false) {
//         res.status(401).json({ error: "Unauthorised" });
//         return;
//     }
    
//     let tenant = req.payload.tenant;
    
//     if(tenant !== 'public') {
//         db.TenantConfigure(tenant, 's_tenant_name', function(err, tenantData) {
//             if (err) {
//                 console.log("err: " + err);
//                 return cb({message:"Something went wrong"})
//             }
    
//             let sfdcURL = Config.SF_URL+'/services/oauth2/token';
            
//             let email = tenantData.s_salesforce_email ? tenantData.s_salesforce_email :  'jaya@teamzskill.com';
    
//             var token = getJWTSignedToken_nJWTLib(email);
            
//             var paramBody = 'grant_type='+base64url.escape('urn:ietf:params:oauth:grant-type:jwt-bearer')+'&assertion='+token;
    
//             var req_sfdcOpts = { 	
//                 url : sfdcURL,  
//                 method:'POST', 
//                 headers: { 'Content-Type' : 'application/x-www-form-urlencoded'} ,
//                 body:paramBody 
//             };
            
//             let queryparam = !!req.query.limit === true ? req.query.limit : 10;
            
//             request(req_sfdcOpts, function(err, remoteResponse, remoteBody) {
//                 extractAccessTokenAPI(err, remoteResponse, remoteBody, res, queryparam); 
//             });
//         })
//     } else {
//         let sfdcURL = Config.SF_URL+'/services/oauth2/token';
            
//         let email = 'jaya@teamzskill.com';

//         var token = getJWTSignedToken_nJWTLib(email);
        
//         var paramBody = 'grant_type='+base64url.escape('urn:ietf:params:oauth:grant-type:jwt-bearer')+'&assertion='+token;

//         var req_sfdcOpts = { 	
//             url : sfdcURL,  
//             method:'POST', 
//             headers: { 'Content-Type' : 'application/x-www-form-urlencoded'} ,
//             body:paramBody 
//         };
        
//         let queryparam = !!req.query.limit === true ? req.query.limit : 10;
        
//         request(req_sfdcOpts, function(err, remoteResponse, remoteBody) {
//             extractAccessTokenAPI(err, remoteResponse, remoteBody, res, queryparam); 
//         });
//     }
// })

function getJWTSignedToken_nJWTLib(sfdcUserName){ 
	var claims = {
	  iss: Config.SF_CONSUMER_KEY,   
	  sub: sfdcUserName,     
	  aud: Config.SF_URL,
	  exp : (Math.floor(Date.now() / 1000) + (60*3))
    }

    var absolutePath = path.resolve("sfcert/key.pem");

    var cert = fs.readFileSync(absolutePath);

	var jwt_token = jwt.sign(claims, cert, { algorithm: 'RS256' });	
 
	return jwt_token; 
}

function extractAccessToken(err, remoteResponse, remoteBody, tenant, cb){
	if (err) { 
		return cb('something went wrong'); 
	}
	
	var sfdcResponse = JSON.parse(remoteBody); 

	//success
	if(sfdcResponse.access_token){	
        //console.log(sfdcResponse);			 
		var conn = new jsforce.Connection({
            instanceUrl: sfdcResponse.instance_url,
            accessToken: sfdcResponse.access_token
        });

        conn.query(`Select CreatedById, CreatedDate, ForecastingTypeId, Id, IsAmount, IsQuantity, QuotaAmount, QuotaOwnerId, StartDate FROM ForecastingQuota`, function (err, forecastingQuota) {
            if(err) {
                return cb('something went wrong'+err)
            }
            
            conn.query(`Select AccountId, Amount, CloseDate, CreatedById, CreatedDate, ExpectedRevenue, Fiscal, FiscalQuarter, FiscalYear, ForecastCategory, Id, Name, OwnerId, Probability, StageName, TotalOpportunityQuantity, Type FROM Opportunity`, function (err, opportunity) {
                if(err) {
                    return cb('something went wrong'+err)
                }
                
                conn.query(`Select Alias, City, CompanyName, Email, FederationIdentifier, FirstName, ForecastEnabled, Id, IsActive, LastName, ManagerId, Name, PostalCode, ProfileId, Title, UserRoleId, UserType, Username FROM User`, function (err, users) {
                    if(err) {
                        return cb('something went wrong'+err)
                    }
                    let user = JSON.stringify(users.records);
                    let opp= JSON.stringify(opportunity.records);
                    let forecasting = JSON.stringify(forecastingQuota.records);
                    db.SetSchema(tenant, function(err, data) {
                        if(err) {
                            return cb('something went wrong'+err)
                        }
                        console.log("data", data);
                        db.InsertSalesforceData(user, opp, forecasting, function(err, data) {
                            if(err) {
                                return cb('something went wrong'+err)
                            }
                            
                            let json = {
                                instanceUrl: sfdcResponse.instance_url,
                                accessToken: sfdcResponse.access_token,
                                forecastingQuota: forecastingQuota.records,
                                opportunity: opportunity.records,
                                users: users.records,
                                dbRes: data
                            }
                            cb(null, json);
                        })
                    })
                }); 
            });

        });
	}else{
		cb('Some error occurred. Make sure connected app is approved previously if its JWT flow, Username and Password is correct if its Password flow.' + remoteBody); 
	}
}

Router.post('/salesforce-email', function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false || !!req.payload.tenant === false) {
        res.status(401).json({ success: false, message: "Unauthorised" });
        return;
    }

    if (!!req.body.salesforce_email === false) {
        res.status(422).json({ success: false, message: "salesforce email is required" });
        return;
    }

    let salesforce_email = req.body.salesforce_email.trim();

    SettingsCtrl.SetSalesforceEmail(salesforce_email, req.payload.tenant, function(err, data) {
        if(err) {
            return res.status(500).json({status: false, message:'something went wrong'+err})
        }
        
        res.status(200).json({success:true, result: data});
    })
})

Router.get('/salesforce-email', function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ success: false, message: "Unauthorised" });
        return;
    }

    let tenant = req.payload.tenant;
    
    if(tenant === 'public') {
        res.status(200).json({success:true, result: 'jaya@teamzskill.com'});
    } else {
        SettingsCtrl.GetSalesforceEmail(req.payload.tenant, function(err, data) {
            if(err) {
                return res.status(500).json({status: false, message: err})
            }
            
            res.status(200).json({success:true, result: data});
        })
    }
});

function fetchSalesForceData(tenant) {
    return new Promise((resolve, reject) => {
        if(tenant !== 'public') {
            db.TenantConfigure(tenant, 's_tenant_name', function(err, tenantData) {
                if (err) {
                    console.log("err: " + err);
                    resolve('Something went wrong');
                }
                let sfdcURL = Config.SF_URL+'/services/oauth2/token';
                
                let email = tenantData ? tenantData.s_salesforce_email :  '';
        
                var token = getJWTSignedToken_nJWTLib(email);
                
                var paramBody = 'grant_type='+base64url.escape('urn:ietf:params:oauth:grant-type:jwt-bearer')+'&assertion='+token;
        
                var req_sfdcOpts = { 	
                    url : sfdcURL,  
                    method:'POST', 
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                    body:paramBody 
                };
                
                request(req_sfdcOpts, function(err, remoteResponse, remoteBody) {
                    extractAccessToken(err, remoteResponse, remoteBody, tenant, function(err, data) {
                        if(err) {
                            resolve(`error ${tenant}`);
                        } else {
                            resolve(`data fetch for ${tenant}`)
                        }
                    });
                });
            })
        } else {
            let sfdcURL = Config.SF_URL+'/services/oauth2/token';
                
            let email = 'jaya@teamzskill.com';
    
            var token = getJWTSignedToken_nJWTLib(email);
            
            var paramBody = 'grant_type='+base64url.escape('urn:ietf:params:oauth:grant-type:jwt-bearer')+'&assertion='+token;
    
            var req_sfdcOpts = { 	
                url : sfdcURL,  
                method:'POST', 
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded'} ,
                body:paramBody 
            };
            
            request(req_sfdcOpts, function(err, remoteResponse, remoteBody) {
                extractAccessToken(err, remoteResponse, remoteBody, tenant, function(err, data) {
                    if(err) {
                        resolve(`error ${tenant}`);
                    } else {
                        resolve(`data fetch for ${tenant}`)
                    }
                }); 
            });
        }
    })
}

console.log('Before sf job instantiation');
const job = new CronJob('0 0 1 */1 *', function() {
    db.GetAllTenantSchemas(function(err, schemas) {
      if(err) {
        console.log(err.message);
        return false;
      }
      let fetchSfData = [];
      for(let i=0; i<schemas.length; i++) {
        fetchSfData.push(fetchSalesForceData(schemas[i].schema_name));
      }
      Promise.all(fetchSfData).then(data => {
        console.log("sf data fetch job completed " + data);
      }).catch(err => {
        console.log("error in sf fetch job completion");
      })
    })
});
console.log('After sf job instantiation');
job.start();

module.exports = Router;