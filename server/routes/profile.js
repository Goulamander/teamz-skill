'use strict';

const Express = require('express');
const Router = Express.Router();
const SettingsCtrl = require('../controllers/settings_ctrl');
var multer = require('multer');
var path = require('path');
const db = require('../db');
const AcceessControl = require('../middlewares/AccessControl');
const { check, validationResult } = require('express-validator');
const Utils = require('../utils');
const auth = require('../middlewares/isAuth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'dist/upload/profile_pic');
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
});

var upload = multer({ storage: storage }).single('file');

var companyLogoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("fsdfdsf", file.fieldname)
        if (file.fieldname === "logo") { // if uploading logo
            cb(null, 'dist/upload/cmpLogo');
        } else { // else uploading placeholder
            cb(null, 'dist/upload/placeholderLogo');
        }
    },
    filename: function (req, file, cb) {
        let fileExt = path.extname(file.originalname);
        cb(null, Date.now() + '-logo' +fileExt)
    }
});

const companyLogoUpload = multer({
    storage: companyLogoStorage,
    limits: {
        fileSize: 500000
    }
}).fields(
    [
        {
            name:'logo',
            maxCount:1
        },
        {
            name:'placeholder_logo', 
            maxCount:1
        }
    ]
);

Router.post('/', auth, AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false || !!req.body.skills === false || req.body.skills.length <1 || !!req.body.firstname === false || !!req.body.lastname === false || !!req.body.zipcode === false ||!!req.body.job_title === false || !!req.body.role === false) {
        res.status(422).json({success:false, message:"Please fill required field"});
        return;
    }
    
    SettingsCtrl.saveProfile(req.payload, req.body, function(err, profileData) {
    if (err) {
        console.log("save profile 500 error: ");
        res.status(500).json({success:false, message:err});
        return;
    }
    console.log("req.payload.email", req.payload.email);
    db.GetProfileData(req.payload._id, function(err, data){
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }

        if (data.length > 0) {
            //console.log("data", data);
            let jwtToken = Utils.generateJwt(req.payload._id, data[0].email, data[0].first_name, data[0].user_role, req.payload.tenant);
            
            let json = {
                success: true,
                first_time_user: data[0].is_new_user,
                is_slack_user: data[0].is_slack_user,
                role: data[0].user_role,
                email: data[0].email,
                token: jwtToken
            };
            res.status(200).json({success:true, result:json});
        } else {
		    res.status(423).json({success:false, message: "User not found"});
	    }
    })
  });     
  
});

Router.get('/', auth, AcceessControl, function(req, res, next) {

  if (!!req.payload === false || !!req.payload._id === false) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  SettingsCtrl.GetProfileData(req.payload._id, function(err, data) {
    if (err) {
        console.log("get Profile data 500 error: ");
        res.status(500).json({success:false, result: err});
        return;
    }

    res.status(200).json({success:true, result: data});
  });     
  
});

Router.put('/', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    if(Object.keys(req.body).length > 0) {
        // normal scenario
        SettingsCtrl.updateProfile(req.payload._id, req.body, function(err, data) {
            if (err) {
                console.log("save profile 500 error: ");
                res.status(500).json({success:false, message:err});
                return;
            }
        
            res.status(200).json({success:true, result:data});
        });
    } else {
        // multipart form data
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({success:false, message:err})
            } else if (err) {
                return res.status(500).json({success:false, message:err})
            }
            
            db.UpdateProfileWithImage(req.payload._id, req.body, req.file.path, function(err, data) {
                if (err) {
                    console.log("err: " + err);
                    res.status(500).json({message:"Something went wrong"})
                }
                let resJSON = {
                    message: "upload successfull",
                    file_url: req.file.path
                }
                res.status(200).json({success:true, result:resJSON});
            });
        })
    }
});

Router.post('/search', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    let text = req.body.search_text ? req.body.search_text.trim() : '';

    SettingsCtrl.GetSearchProfile(text, function(err, data) {
        if (err) {
            console.log("get Profile data 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }
    
        res.status(200).json({success:true, result: data});
    });     
    
});

Router.get('/user-skills', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
      res.status(401).json({ error: "Unauthorised" });
      return;
    }
  
    SettingsCtrl.getUserSkills(req.payload, function(err, data) {
      if (err) {
          console.log("get user Skills 500 error: ");
          res.status(500).send({success: false, message: err});
          return;
      }
  
      res.status(200).json({success: true, result: data});
    });     
    
});
  
Router.put('/user-skills', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
      res.status(401).json({ error: "Unauthorised" });
      return;
    }

    if(!!req.body.userSkills === false || req.body.userSkills.length < 1) {
        res.status(422).json({ status:false, message:"Invalid form values" });
        return;
    }
  
    SettingsCtrl.updateUserSkills(req.payload, req.body.userSkills, function(err, data) {
      if (err) {
          console.log("update user Skills 500 error: ");
          res.status(500).send({success: false, message: err});
          return;
      }
  
      res.status(200).json({success: true, result: data});
    });     
    
});

Router.post('/company-logo', auth, AcceessControl, function(req, res, next) {
    if(req.payload.tenant === 'public') {
        res.status(403).json({success: false, message: "Invalid request"});
        return;
    }
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    companyLogoUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({success:false, message:err.message})
        } else if (err) {
          return res.status(500).json({success:false, message:err.message});
        } else if(req.files.logo && req.files.placeholder_logo) {
            let sqlQuery = `UPDATE ts_admin.ts_tenants SET (s_company_logo, s_placeholder_logo, t_modified) = ($2, $3, now()) WHERE s_tenant_name = $1`;
            let queryArray = [req.payload.tenant, req.files.logo[0].path, req.files.placeholder_logo[0].path];
            SettingsCtrl.SaveCompanyLogo(sqlQuery, queryArray, function(err, data) {
                if(err) {
                    return res.status(500).json({success: false, message: err})
                }
                return res.status(200).json({success: true, result: data})
            })
        } else if(req.files.logo) {
            let sqlQuery = `UPDATE ts_admin.ts_tenants SET (s_company_logo, t_modified) = ($2, now()) WHERE s_tenant_name = $1`;
            let queryArray = [req.payload.tenant, req.files.logo[0].path];
            SettingsCtrl.SaveCompanyLogo(sqlQuery, queryArray, function(err, data) {
                if(err) {
                    return res.status(500).json({success: false, message: err})
                }
                return res.status(200).json({success: true, result: data})
            })
        } else if(req.files.placeholder_logo) {
            let sqlQuery = `UPDATE ts_admin.ts_tenants SET (s_placeholder_logo, t_modified) = ($2, now()) WHERE s_tenant_name = $1`;
            let queryArray = [req.payload.tenant, req.files.placeholder_logo[0].path];
            SettingsCtrl.SaveCompanyLogo(sqlQuery, queryArray, function(err, data) {
                if(err) {
                    return res.status(500).json({success: false, message: err})
                }
                return res.status(200).json({success: true, result: data})
            })
        } 
    })
});

Router.get('/company-logo', function(req, res, next) {
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    var subDomain = Utils.GetValidSubDomain(tenant);
    if(subDomain === 'app') {
        res.status(403).json({success: false, message: "Invalid request"});
        return;
    }

    SettingsCtrl.GetCompanyLogoAndPlaceholder(subDomain, function(err, data) {
        if(err) {
            return res.status(500).json({success: false, message: err})
        }
        return res.status(200).json({success: true, result: data})
    })    
    
});

module.exports = Router;