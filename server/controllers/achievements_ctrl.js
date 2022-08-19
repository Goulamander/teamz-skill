var multer = require('multer');
var path = require('path');
var fs = require('fs');
const db = require('../db');

function AchievementsCtrl() {

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'dist/upload/achievements');
  },
  filename: function (req, file, cb) {
    let fileExt = path.extname(file.originalname);
    cb(null, Date.now() + '-ac' +fileExt)
  }
});

// const fileFilter = (req, file, cb) => {
//   if (
//     path.extname(file.originalname) === '.png'
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("File format should be png"), false); // if validation failed then generate error
//   }
// };

var upload = multer({ storage: storage }).single('file');


AchievementsCtrl.prototype.AddAchievements = function(req, res) {
 
  if (!!req.payload === false || !!req.payload._id === false) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json({success:false, message:err})
    } else if (err) {
        return res.status(500).json({success:false, message:err})
    }  
   
    let userData = JSON.parse(req.body.userData);

    if (!!userData.c_title === false || !!userData.s_issuing_org === false || !!userData.cred_url === false) {
      res.status(422).json({success:false, message: "Invalid form data" });
      return; 
    }

    if(req.file != undefined) {
      db.AddAchievements(req.payload._id, req.body, req.file.path, function(err, data) {
        if (err) {
            console.log("err: " + err);
            res.status(500).json({message:"Something went wrong"});
            return;
        }
        let resJSON = {
            message: "Added successfull",
            file_url: req.file.path
        }
        res.status(200).json({success:true, result:resJSON});
        return;
      });
    } else {
      db.AddAchievements(req.payload._id, req.body, '', function(err, data) {
        if (err) {
            console.log("err: " + err);
            res.status(500).json({message:"Something went wrong"});
            return;
        }
        let resJSON = {
            message: "Added successfull",
            file_url: ''
        }
        res.status(200).json({success:true, result:resJSON});
        return;
      });
    }

  })
}

AchievementsCtrl.prototype.GetAchievements = function(req, res) {
 
  if (!!req.payload === false || !!req.payload._id === false) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  db.GetAchievements(req.payload._id, (err, data) => {

    if (err) {
      console.log("err: " + err);
      res.status(500).json({message:"Something went wrong"});
      return;
    }
    
    return res.status(200).json({success:true, result:data});
  })
}

module.exports = new AchievementsCtrl();