'use strict';

const Express = require('express');
const passport = require('passport');
const fs = require('fs');
const utils = require('../utils');
const jwtMod = require('jsonwebtoken');
const Config = require('../config');
const uuidv1 = require('uuid/v1');
const jwt = require('express-jwt');
const GetSchema = require('../middlewares/GetSchema');
var parseString = require('xml2js').parseString;
const AcceessControl = require('../middlewares/AccessControl');
const auth = require('../middlewares/isAuth');

const Router = Express.Router();

const OktaSamlCtrl = require('../controllers/oktasaml_ctrl');

function ensureAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();
    else
    res.status(401).json({ status:401, success:false, message:'Unauthorised'});
    return;
}

Router.post('/',
    GetSchema,
    ensureAuthenticated,
    function(req, res) {
        //console.log('GET [/] user authenticated! req.user: %s \n', JSON.stringify(req.user, 4));
        OktaSamlCtrl.OktaLogin(req, (err, status, data) => {
            if (err) {
                console.log("err: " + err);
                return res.status(500).json({status:status, success: false, message:err})
            }

            res.status(status).json({status:status, success: true, result:data})
        })   
    }
);

Router.post('/register', function(req, res, next) {
    if (!!req.body === false || !!req.body.email === false || !!req.body.subdomain === false || !!req.body.password === false || !!req.body.idp_type === false  ) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    let regexExp = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if(regexExp.test(req.body.email) === false) {
        res.status(422).json({success:false, message:"Invalid email address"});
        return;
    }
    
    let user_email = req.body.email.trim().toLowerCase();

    OktaSamlCtrl.RegisterUser(user_email, req.body.password, req.body.idp_type, req.body.subdomain, function(err, found, data) {
        if (err) {
            console.log("register tenant 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(found === true) {
            res.status(200).json({success:true, result:data});
        } else {
            res.status(200).json({success:true, result:data});
        }
    })
});

Router.get('/login', function(req, res, next) {
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    passport.authenticate(tenant, function(err, user, info) {
        if (err) { 
            return res.redirect('/tenant/404'); 
        }
        if (!user) { 
            return res.redirect('/');
        }
        req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
        });
    })(req, res, next);
});

Router.post('/logout', auth, AcceessControl, function(req, res, next) {
    console.log("req.user", req.user);
    req.logout();
    console.log("User has logged out.");
    res.status(200).json({success: true, result:"User has logged out." });
});

Router.put('/company-setting', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false || req.payload.role != 2) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false || !!req.body.sso_admin_email === false || !!req.body.entity_id === false || !!req.body.entry_point === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }
    req.body.callback_url = `https://${req.payload.tenant}.${Config.SAML_CALLBACK_BASE_URL}/login/callback`
    OktaSamlCtrl.SaveCompanySetting(req.payload._id, req.body, function(err, data) {
        if (err) {
            console.log("update tenant 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        let json = {

        }
        utils.samlStrategy(); //Updating SAML Strategy records
        res.status(200).json({success:true, result:data});
    })
});

Router.get('/company-setting', auth, AcceessControl, function(req, res, next) {
   
    if (!!req.payload === false || !!req.payload._id === false || req.payload.role != 2) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    OktaSamlCtrl.GetCompanySetting(req.payload._id, function(err, data) {
        if (err) {
            console.log("get tenant detail 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }

        if(data) {
 	
            let json = {
                sso_admin_email: data.s_sso_admin_email,
                entry_point: data.s_entry_point,
                callback_url: data.s_callback_url,
                entity_id: data.s_entity_id,
                saml_enable: data.b_saml_enable,
                meta_data: data.s_saml_metadata_xml,
                allow_password_signin: data.b_allow_password_signin
            }
        
            res.status(200).json({success:true, result:json});
       } else {
		    res.status(200).json({success:true, result:"no metadata"});
       }
    })
});

Router.put('/okta-xml-metadata', auth, AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false || req.payload.role != 2) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false || !!req.body.meta_data === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    
    parseString(req.body.meta_data, function (err, result) {
        if(err) {
            console.log("parseString", err)
            res.status(400).json({success: false, message: 'Failed to extract required data from metadata. Please enter correct metadata'});
            return;
        }

        if(!!result[`md:EntityDescriptor`]['md:IDPSSODescriptor'][0]['md:KeyDescriptor'][0]['ds:KeyInfo'][0]['ds:X509Data'][0]['ds:X509Certificate'][0] === false || !!result[`md:EntityDescriptor`]['md:IDPSSODescriptor'][0]['md:SingleSignOnService'][0].$.Location === false || !!result[`md:EntityDescriptor`].$.entityID === false) {
            res.status(422).json({success:false, message:"Invalid xml metadata"});
            return;
        }

        let cert = result[`md:EntityDescriptor`]['md:IDPSSODescriptor'][0]['md:KeyDescriptor'][0]['ds:KeyInfo'][0]['ds:X509Data'][0]['ds:X509Certificate'][0];

        let certUrl = `./cert/${req.payload.tenant}.pem`;
        let entryPoint = result[`md:EntityDescriptor`]['md:IDPSSODescriptor'][0]['md:SingleSignOnService'][0].$.Location;
        let entityId = result[`md:EntityDescriptor`].$.entityID;

        fs.writeFile(certUrl, cert, (err) => {
            if(err) {
                console.log(err)
                res.status(400).json({success: false, message: 'Failed to create cert file'});
                return;
            }
            console.log("data", entryPoint);
            console.log("entityId", entityId);
            OktaSamlCtrl.SaveXmlMetaData(req.payload._id, req.body.meta_data, certUrl, entryPoint, entityId, function(err, data) {
                if (err) {
                    console.log("save XML 500 error: ");
                    res.status(500).json({success:false, message:err});
                    return;
                }

                let json = {
                    entry_point: entryPoint,
                    entity_id: entityId,
                    meta_data: req.body.meta_data
                }
                utils.samlStrategy(); //Updating SAML Strategy records
                
                res.status(200).json({success:true, result:json});
            })
        })

    });
});

Router.put('/azure-xml-metadata', auth, AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false || req.payload.role != 2) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false || !!req.body.meta_data === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    parseString(req.body.meta_data, function (err, result) {
        if(err) {
            console.log("parseString", err)
            res.status(400).json({success: false, message: 'Failed to extract required data from metadata. Please enter correct metadata'});
            return;
        }

        if(!!result[`EntityDescriptor`][`Signature`][0][`KeyInfo`][0][`X509Data`][0][`X509Certificate`][0] === false || !!result[`EntityDescriptor`][`IDPSSODescriptor`][0][`SingleSignOnService`][0].$.Location === false || !!result[`EntityDescriptor`].$.entityID === false) {
            res.status(422).json({success:false, message:"Invalid xml metadata"});
            return;
        }

        let cert = result[`EntityDescriptor`][`Signature`][0][`KeyInfo`][0][`X509Data`][0][`X509Certificate`][0];

        let certUrl = `./cert/${req.payload.tenant}.pem`;
        let entryPoint = result[`EntityDescriptor`][`IDPSSODescriptor`][0][`SingleSignOnService`][0].$.Location;
        let entityId = result[`EntityDescriptor`].$.entityID;

        fs.writeFile(certUrl, cert, (err) => {
            if(err) {
                console.log(err)
                res.status(400).json({success: false, message: 'Failed to create cert file'});
                return;
            }
            console.log("data", entryPoint);
            console.log("entityId", entityId);
            OktaSamlCtrl.SaveXmlMetaData(req.payload._id, req.body.meta_data, certUrl, entryPoint, entityId, function(err, data) {
                if (err) {
                    console.log("save XML 500 error: ");
                    res.status(500).json({success:false, message:err});
                    return;
                }

                let json = {
                    entry_point: entryPoint,
                    entity_id: entityId,
                    meta_data: req.body.meta_data
                }
                utils.samlStrategy(); //Updating SAML Strategy records
                
                res.status(200).json({success:true, result:json});
            })
        })

    });
});

Router.put('/update-password', auth, GetSchema, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false || req.payload.role != 2) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false || !!req.body.curr_pwd === false || !!req.body.new_pwd === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    if (req.body.new_pwd.length < 8) {
        res.status(422).json({success:false, message:"New password must be 8 characters long"});
        return;
    }

    OktaSamlCtrl.UpdateItAdminPassword(req.payload._id, req.body.curr_pwd, req.body.new_pwd, req.payload.tenant, function(err, data) {
        if (err) {
            console.log("update tenant 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
        res.status(200).json({success:true, result:data});
    })
});

Router.get('/Shibboleth.sso/Metadata',
    function(req, res) {
        var domain = req.headers.host;
        var tenant = domain.split('.')[0];
        res.type('application/xml');
        res.status(200).send(tenantStrategies[tenant].generateServiceProviderMetadata(fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8')));
    }
);

Router.post('/test-account',
    GetSchema,
    function(req, res) {
        OktaSamlCtrl.RegisterTestAccount(req, (err, status, data) => {
            if (err) {
                console.log("err: " + err);
                return res.status(500).json({status:status, success: false, message:err})
            }

            res.status(status).json({status:status, success: true, result:data})
        })   
    }
);

module.exports = Router;
