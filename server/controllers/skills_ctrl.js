const db = require('../db');

function SkillsCtrl() {

}

function getChildSkills(parentId, skill_name, selectedSchema) {
    return new Promise((resolve, reject) => {
        if(parentId != '') {
            db.SetSchema(selectedSchema, (err, schemaName) => {
                if(err) {
                    return reject(err);
                } 
                db.CheckSchema((err, schemaName) => {
                    if(err) {
                        return reject(err);
                    }
   
                    db.GetChildSkills(parentId, function(err, data) {
                        if (err) {
                            console.log("err: " + err);
                            reject("error");
                        }
                        
                        
                        let json = {
                            id:parentId,
                            name: skill_name,
                            skills:data
                        }
                        
                        resolve(json);
                    
                    });
                });
            });
        } else {
            reject("error");
        }
    });
}

function getSubChildSkills(parentId, selectedSchema) {
    return new Promise((resolve, reject) => {
        if(parentId != '') {
            db.SetSchema(selectedSchema, (err, schemaName) => {
                if(err) {
                    return reject(err);
                } 
                db.CheckSchema((err, schemaName) => {
                    if(err) {
                        return reject(err);
                    }
                    db.GetChildSkills(parentId, function(err, data) {
                        if (err) {
                            console.log("err: " + err);
                            reject("error");
                        }
                        
                        resolve(data);
                    
                    });
                });
            });
        } else {
            reject("error");
        }
    });
}

SkillsCtrl.prototype.getRelationalSkills = function(payload, cb) {
   let getSkillsPromise = []; 
   db.GetSkills(function(err, data) {
    if (err) {
        console.log("err: " + err);
        return cb({message:"Something went wrong"})
    }
    for(let i=0; i<data.length; i++) {
        getSkillsPromise.push(getChildSkills(data[i].id, data[i].parent_skill_name, payload.tenant ? payload.tenant : 'public'));
    }
    
    Promise.all(getSkillsPromise).then((data) => {    
        let skillsArray = [];
        let getSkillsPromise = [];
        skillsArray = data;

        // Loop here
        let funcData = skillsArray[2];
        let funcSkills = funcData.skills;
        for(let i=0; i<funcSkills.length; i++) {
            getSkillsPromise.push(getSubChildSkills(funcSkills[i].id, payload.tenant ? payload.tenant : 'public'));
        }
        Promise.all(getSkillsPromise).then(data => {
            data.forEach((skills, i) => {
                funcSkills[i].skills = skills
            })
            cb(null, skillsArray);  
        }).catch(error => {
            cb({success:false, message:error});
        })
    }).catch(err => {
        cb({success:false, message:err});
    })

   })
}

module.exports = new SkillsCtrl();