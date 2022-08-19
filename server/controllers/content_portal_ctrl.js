const db = require('../db');
const urlMetadata = require('url-metadata');
var multer = require('multer');
var path = require('path');
const Joi = require('joi');
//const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const aws = require('aws-sdk');

const config = require('../config');
const Utils = require('../utils');

function ContentPortalCtrl() {

}

var s3bucket = new aws.S3({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY, "region":config.SES_REGION});

const CreateMicrositeSchema = Joi.object({
    short_des: Joi.string().required().allow(''),
    title: Joi.string().required(),
    link: Joi.string().required(),
    logo: Joi.string().required().allow(''),
    background_image: Joi.string().required().allow(''),
    style_type: Joi.string().required(),
    customize_link: Joi.when('style_type', { is: 'GRID_VIEW', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    contents: Joi.array().items(Joi.object({
        doc_id : Joi.any().required(),
        doc_serial_id: Joi.any().required()
    })).required().min(1)
});

const UpdateMicrositeSchema = Joi.object({
    short_des: Joi.string().required().allow(''),
    title: Joi.string().required(),
    link: Joi.string().required(),
    style_type: Joi.string().required(),
    customize_link: Joi.when('style_type', { is: 'GRID_VIEW', then: Joi.string().required(), otherwise: Joi.string().optional().allow('') }),
    logo: Joi.string().required().allow(''),
    background_image: Joi.string().required().allow('')
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'dist/upload/contentportal');
  },
  filename: function (req, file, cb) {
    let fileExt = path.extname(file.originalname);
    cb(null, Date.now() + '-ac' +fileExt)
  }
});

var micrositesImgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let micrositeData = JSON.parse(req.body.micrositeData);

        let schemaError = Joi.validate(micrositeData, CreateMicrositeSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.message);
            return cb("Insufficient data to process request");
        }

        if (file.fieldname === "logo") { // if uploading logo
            cb(null, 'dist/upload/micrositeLogo');
        } else { // else uploading image
            cb(null, 'dist/upload/micrositeBg');
        }
  },
  filename: function (req, file, cb) {
    let fileExt = path.extname(file.originalname);
    cb(null, Date.now() + '-ms' +fileExt)
  }
});

var updateMicrositesImgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let micrositeData = JSON.parse(req.body.micrositeData);

        let schemaError = Joi.validate(micrositeData, UpdateMicrositeSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.message);
            return cb("Insufficient data to process request");
        }

        if (file.fieldname === "logo") { // if uploading logo
            cb(null, 'dist/upload/micrositeLogo');
        } else { // else uploading image
            cb(null, 'dist/upload/micrositeBg');
        }
  },
  filename: function (req, file, cb) {
    let fileExt = path.extname(file.originalname);
    cb(null, Date.now() + '-ms' +fileExt)
  }
});

var upload = multer({ storage: storage, limits: { fileSize: 204800 } }).single('file');

const micrositeUpload = multer({
    storage: micrositesImgstorage,
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
            name:'background', 
            maxCount:1
        }
    ]
);

const updateMicrositeUpload = multer({
    storage: updateMicrositesImgstorage,
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
            name:'background', 
            maxCount:1
        }
    ]
);

ContentPortalCtrl.prototype.AddGDriveContent = function(req, cb) {

    const { GDriveDocs } = req.body;

    let insertContent = [];
    for(let i=0; i< GDriveDocs.length; i++) {
        insertContent.push(insertGdriveContent(GDriveDocs[i], req.payload._id));
    }

    Promise.all(insertContent).then(data => {
        cb(null, 200, 'Content created successfully');
    }, error => {
        cb(error, 500, null);
    }).catch(err => {
        cb(err, 500, null);
    })

}

function insertGdriveContent(docData, guid) {

    return new Promise((resolve, reject) => {
        urlMetadata(docData.url).then(data => {

            let result = {
                image: ''
            }

            //try get image
            try {
                if(!!data.image) {
                    result.image = data.image;
                }
                if(!!result.image == false) {
                    if(!!data['og:image'])
                        result.image = data['og:image'];
                }
                
                db.AddGDriveContent(guid, docData, result.image, function(err, value) {
                    if(err) {
                        //console.log("err", err);
                        resolve(err)
                    }

                    resolve(data);
                })
            } catch(error) {
                //console.log("error", error);
                reject(error);
            }
        })
    })
}

ContentPortalCtrl.prototype.GetGDriveContent = function(guid, cb) {

    db.GetGDriveContent(guid, function(err, data) {
        if(err) {
            return cb(err)
        }

        db.GetCPPoularTags(function(err, tagsData) {
            if(err) {
                return cb(err)
            }
    
            for(var i=0; i< data.length; i++) {
                let popular_tags = `${data[i].content_tag} , ${data[i].content_stage_tags}`;
                let tags = popular_tags.split(',');
                let content_tags = [];
                let content_stage_tags = [];
                for(let k=0; k<tags.length; k++) {
                    for(let j=0; j<tagsData.length; j++) {
                        if(tagsData[j].id === parseInt(tags[k])) {
                            if(tagsData[j].tag_type === 'CONTENT_TAG') {
                                tagsData[j].isNewTag = false;
                                content_tags.push(tagsData[j]);
                            } else {
                                tagsData[j].isNewTag = false;
                                content_stage_tags.push(tagsData[j]);
                            }
                        }
                    }
                }
                // console.log("content_tags", content_tags);
                // console.log("content_stagetags", content_stage_tags);
                data[i].content_tags = content_tags;
                data[i].content_stage_tags = content_stage_tags;
            }
            
            if(data.length === i) {
                cb(null, data);
            }
        });

    });

}

ContentPortalCtrl.prototype.GetCPPoularTags = function(cb) {

    db.GetCPPoularTags(function(err, data) {
        if(err) {
            return cb(err)
        }
        cb(null, data);
    });

}

ContentPortalCtrl.prototype.UpateDocumentContentTags = function(payload, body, oldTags, newTags, cb) {

    let { document_ids } = body
    let oldTagNames = [];
    let newTagNames = [];

    for(let i=0; i<oldTags.length; i++) {
        oldTagNames.push(oldTags[i].tag_name.toLowerCase());
    }

    for(let i=0; i<newTags.length; i++) {
        newTagNames.push(newTags[i].tag_name.toLowerCase());
    }

    if(newTags.length) {
        db.checkTagAlreadyExist(newTagNames, function(err, exits, tagsData) {
            if(err) {
                return cb(err);
            }
            if(exits) {
                return cb("some new tags are already present")
            }
            db.checkTagAlreadyExist(oldTagNames, function(err, exits, tagsValues) {
                if(err) {
                    return cb(err);
                }
                if(tagsValues.length === oldTagNames.length) {
                    let insertNewTagsPromise = [];
                    for(let i=0; i<newTags.length; i++) {
                        insertNewTagsPromise.push(insertNewTagsfunction(newTags[i], payload.tenant ? payload.tenant : 'public'));
                    }
                    Promise.all(insertNewTagsPromise).then((data) => {
                        let tagsToAdd = oldTags.concat(data);
                        let contentTagsToAdd = [];
                        let contentStageTagsToAdd = [];
                        for(let i=0; i<tagsToAdd.length; i++) {
                            if(tagsToAdd[i].tag_type === 'CONTENT_TAG') {
                                contentTagsToAdd.push(tagsToAdd[i].id);
                            } else {
                                contentStageTagsToAdd.push(tagsToAdd[i].id);
                            }
                        }
                        db.UpateDocumentContentTags(document_ids, contentTagsToAdd.join(), contentStageTagsToAdd.join(), function(err, data) {
                            if(err) {
                                return cb(err)
                            }
                            cb(null, data);
                        });
                    }).catch(err => {
                        cb(err)
                    });
                } else {
                    return cb("There is something wrong with old tags")
                }
            });
        })
    } else {
        db.checkTagAlreadyExist(oldTagNames, function(err, exits, tagsValues) {
            if(err) {
                return cb(err);
            }
            if(tagsValues.length === oldTagNames.length) {
                let tagsToAdd = oldTags;
                let contentTagsToAdd = [];
                let contentStageTagsToAdd = [];
                for(let i=0; i<tagsToAdd.length; i++) {
                    if(tagsToAdd[i].tag_type === 'CONTENT_TAG') {
                        contentTagsToAdd.push(tagsToAdd[i].id);
                    } else {
                        contentStageTagsToAdd.push(tagsToAdd[i].id);
                    }
                }
                db.UpateDocumentContentTags(document_ids, contentTagsToAdd.join(), contentStageTagsToAdd.join(), function(err, data) {
                    if(err) {
                        console.log("err", err)
                        return cb(err)
                    }
                    cb(null, data);
                });
            
            } else {
                return cb("There is something wrong with old tags")
            }
        });
    }
}

function insertNewTagsfunction(tagsData, tenant) {
    return new Promise(function(resolve, reject) {
        db.SetSchema(tenant, (err, schemaName) => {
            if(err) {
                return reject(err);
            }
            db.InsertNewPoularTags(tagsData, function(err, tags) {
                if(err) {
                    return reject(err);
                }
                resolve(tags)
            })
        });
    });
}

ContentPortalCtrl.prototype.DeleteContent = function(contents, cb) {
    let addedContents = [];
    let nonAddedContents = [];

    for(let i=0; i<contents.length; i++) {
        if(contents[i].is_content_added) {
            if(!contents[i].is_content_shared_in_microsite) {
                addedContents.push(contents[i].doc_id);
            } else {
                return cb("Contents can't be deleted which has been shared in microsite");
            }
        } else {
            nonAddedContents.push(contents[i].doc_id)
        }
    }

    db.DeleteAddedContents(addedContents, function(err, deletedData) {
        if(err) {
            return cb(err)
        }
        console.log(nonAddedContents);

        db.DeleteNonAddedContents(nonAddedContents, function(err, data) {
            if(err) {
                return cb(err)
            }
            
            cb(null, data);
        });

    });

}

ContentPortalCtrl.prototype.AddContentsToPortal = function(contents, cb) {

    let contentsToAdd = [];

    for(let i=0; i<contents.length; i++) {
        contentsToAdd.push(contents[i].doc_id);
    }

    db.AddContentsToPortal(contentsToAdd, function(err, data) {
        if(err) {
            return cb(err)
        }
        
        cb(null, data);
    });

}

ContentPortalCtrl.prototype.GetMyContent = function(guid, cb) {

    db.GetMyContent(guid, function(err, data) {
        if(err) {
            return cb(err)
        }

        db.GetCPPoularTags(function(err, tagsData) {
            if(err) {
                return cb(err);
            }
    
            for(var i=0; i< data.length; i++) {
                let popular_tags = `${data[i].content_tag} , ${data[i].content_stage_tags}`;
                let tags = popular_tags.split(',');
                let content_tags = [];
                let content_stage_tags = [];
                for(let k=0; k<tags.length; k++) {
                    for(let j=0; j<tagsData.length; j++) {
                        if(tagsData[j].id === parseInt(tags[k])) {
                            if(tagsData[j].tag_type === 'CONTENT_TAG') {
                                tagsData[j].isNewTag = false;
                                content_tags.push(tagsData[j]);
                            } else {
                                tagsData[j].isNewTag = false;
                                content_stage_tags.push(tagsData[j]);
                            }
                        }
                    }
                }
                // console.log("content_tags", content_tags);
                // console.log("content_stagetags", content_stage_tags);
                data[i].content_tags = content_tags;
                data[i].content_stage_tags = content_stage_tags;
            }
            
            if(data.length === i) {
                cb(null, data);
            }
        });

    });

}

ContentPortalCtrl.prototype.AddMyContent = function(guid, bodyData, cb) {

    const { doc_id, doc_serial_id } = bodyData;
    db.CheckMyContentAlreadyAdded(guid, doc_id, function(err, found, data) {
        if(err) {
            console.log("Something went wrong", err);
            return cb("Something went wrong");
        }
        if(found) {
            return cb("Document already added to My Contents")
        }
        db.AddMyContent(guid, doc_id, doc_serial_id, function(err, data) {
            if(err) {
                console.log("Something went wrong", err);
                return cb("Something went wrong");
            }
            
            cb(null, "Content added successfully to My Contents");
        });
    });

}

ContentPortalCtrl.prototype.EditPortalContents = function(req, res) {
 
    if (!!req.payload === false || !!req.payload._id === false) {
      res.status(401).json({ error: "Unauthorised" });
      return;
    }
    
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({success:false, message:err.message})
      } else if (err) {
        return res.status(500).json({success:false, message:err.message})
      }  

      let docData = JSON.parse(req.body.docData);
      
      if (!!docData.doc_des === false || !!docData.doc_id === false || !!docData.doc_title === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
      }
  
        if(req.file != undefined) {
            db.UpdatePortalContents(docData.doc_id, docData.doc_des, req.file.path, docData.doc_title, function(err, data) {
            if (err) {
                console.log("err: " + err);
                res.status(500).json({message:"Something went wrong"});
                return;
            }
            let resJSON = {
                message: "Updated successfull",
                file_url: req.file.path
            }
            res.status(200).json({success:true, result:resJSON});
            return;
            });
        } else {
            db.UpdatePortalContents(docData.doc_id, docData.doc_des, '', docData.doc_title, function(err, data) {
            if (err) {
                console.log("err: " + err);
                res.status(500).json({message:"Something went wrong"});
                return;
            }
            let resJSON = {
                message: "Updated successfull",
                file_url: ''
            }
            res.status(200).json({success:true, result:resJSON});
            return;
            });
        }
  
    })
}

ContentPortalCtrl.prototype.GetLibraryImages = function(cb) {
    db.GetLibraryImages(function(err, data) {
        if(err) {
            console.log("Something went wrong", err);
            return cb("Something went wrong");
        }
        let bgImg = [];
        let logoImg = [];
        for(let i=0; i<data.length; i++) {
            if(data[i].image_type == 'Logo') {
                logoImg.push(data[i]);
            } else {
                bgImg.push(data[i])
            }
        }
        let json = {
            bgImg : bgImg,
            logoImg : logoImg
        }
        cb(null, json);
    })
}

ContentPortalCtrl.prototype.InsertMicrositeData = function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
   
    micrositeUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({success:false, message:err.message})
        } else if (err) {
          return res.status(500).json({success:false, message:err.message});
        }
        let micrositeData = JSON.parse(req.body.micrositeData);

        let schemaError = Joi.validate(micrositeData, CreateMicrositeSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.message);
            return res.status(422).json({success:false, message: "Insufficient data to process request"});
        }
        
        // console.log(req.files.logo);
        // console.log(req.files.background);

        const { short_des, title, link, customize_link, logo, background_image, style_type } = micrositeData;
        let contents = JSON.stringify(micrositeData.contents);
        
        db.CheckMicroSiteLinksExist(link.trim(), function(err, found, result) {
            if(err) {
                return res.status(500).json({success:false, message:err});
            }
            if(found) {
                return res.status(500).json({success:false, message:"Custom link already in used. Please choose different link"});
            }

            if(req.files.logo || req.files.background) {
                let logo_url = req.files.logo ? req.files.logo[0].path : logo;
                let bg_url = req.files.background ? req.files.background[0].path : background_image;

                db.InsertMicrositeData(req.payload._id, short_des, title, link.trim(), customize_link.trim(), logo_url, bg_url, style_type, contents, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        // delete file if error generated
                        fs.unlink(req.files.logo[0].path, function (err) {
                            if (err) {
                                console.error("Failed to delete temp file", err);
                            }
                            console.log('Temp File Delete');
                        });
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    if(req.files.logo) {
                        db.InsertMicrosioiteCustomLogo(req.files.logo[0].path, 'Logo', function(err, success) {
                            if(err) {
                                console.log("Something went wrong", err);
                                // delete file if error generated
                                fs.unlink(req.files.logo[0].path, function (err) {
                                    if (err) {
                                        console.error("Failed to delete temp file", err);
                                    }
                                    console.log('Temp File Delete');
                                });
                                return res.status(500).json({success:false, message:"Something went wrong"});
                            }
                            
                            console.log("custom logo store into database");
                            return res.status(200).json({success:false, result:"Microsite created."});
                        })
                    }
                });
                
            } else {
                db.InsertMicrositeData(req.payload._id, short_des, title, link.trim(), customize_link.trim(), logo, background_image, style_type, contents, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    
                    res.status(200).json({success:false, result:"Microsite created."});
                });
            }
        })
    })

}

ContentPortalCtrl.prototype.GetMicrosites = function(guid, cb) {

    db.GetMicrosites(guid, function(err, data) {
        if(err) {
            return cb(err)
        }

        cb(null, data)

    });

}

ContentPortalCtrl.prototype.GetMicrositeData = function(link, cb) {

    db.GetMicrositeData(link, function(err, data) {
        if(err) {
            return cb(err)
        }

        db.GetCPPoularTags(function(err, tagsData) {
            if(err) {
                return cb(err)
            }
    
            for(var i=0; i< data.length; i++) {
                let popular_tags = `${data[i].content_tag} , ${data[i].content_stage_tags}`;
                let tags = popular_tags.split(',');
                let content_tags = [];
                let content_stage_tags = [];
                for(let k=0; k<tags.length; k++) {
                    for(let j=0; j<tagsData.length; j++) {
                        if(tagsData[j].id === parseInt(tags[k])) {
                            if(tagsData[j].tag_type === 'CONTENT_TAG') {
                                tagsData[j].isNewTag = false;
                                content_tags.push(tagsData[j]);
                            } else {
                                tagsData[j].isNewTag = false;
                                content_stage_tags.push(tagsData[j]);
                            }
                        }
                    }
                }
                // console.log("content_tags", content_tags);
                // console.log("content_stagetags", content_stage_tags);
                data[i].content_tags = content_tags;
                data[i].content_stage_tags = content_stage_tags;
            }

            let json;

            if(data.length) {
                json = {
                    style_type: data[0].style_type,
                    title: data[0].title,
                    description: data[0].description,
                    logo: data[0].logo,
                    link: data[0].link,
                    isShared: data[0].is_shared,
                    microsite_id: data[0].microsite_id,
                    doc_ser_id: data[0].doc_ser_id,
                    customize_link: data[0].customize_link,
                    background_img: data[0].background_img,
                    header_color: data[0].s_header_color,
                    cta_text: !!data[0].cta_text ? data[0].cta_text : '',
                    cta_url: !!data[0].cta_url ? data[0].cta_url : '',
                    video_link: !!data[0].video_link ? data[0].video_link : '',
                    video_thumbnail: !!data[0].video_thumbnail ? data[0].video_thumbnail : '', 
                    video_gif: !!data[0].video_gif ? data[0].video_gif : '',
                    is_animated_preview_enabled: data[0].is_animated_preview_enabled ? data[0].is_animated_preview_enabled : '',
                    contentsData: data.filter(val => val.doc_ser_id != null).sort((a, b) => a.microsite_content_id - b.microsite_content_id)
                }
            }

            if(data.length === i) {
                cb(null, json);
            }
        });

    });

}

ContentPortalCtrl.prototype.ModifyMicrositeData = function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    //check pending sites shared or not
    updateMicrositeUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({success:false, message:err.message})
        } else if (err) {
          return res.status(500).json({success:false, message:err.message});
        }
        let micrositeData = JSON.parse(req.body.micrositeData);

        let schemaError = Joi.validate(micrositeData, UpdateMicrositeSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.message);
            return res.status(422).json({success:false, message: "Insufficient data to process request"});
        }
        
        // console.log(req.files.logo);
        // console.log(req.files.background);

        const { short_des, title, link, customize_link, logo, background_image } = micrositeData;
            if(req.files.logo || req.files.background) {
                let logo_url = req.files.logo ? req.files.logo[0].path : logo;
                let bg_url = req.files.background ? req.files.background[0].path : background_image;

                if(req.files.logo) {
                    db.InsertMicrosioiteCustomLogo(req.files.logo[0].path, 'Logo', function(err, success) {
                        if(err) {
                            console.log("Something went wrong", err);
                            return res.status(500).json({success:false, message:"Something went wrong"});
                        }
                        
                        console.log("custom logo store into database")
                    })
                }

                db.UpdateMicrositeData(req.payload._id, short_des, title, link.trim(), customize_link.trim(), logo_url, bg_url, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    
                    res.status(200).json({success:false, result:"Microsite created."});
                });
                
            } else {
                db.UpdateMicrositeData(req.payload._id, short_des, title, link.trim(), customize_link.trim(), logo, background_image, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    
                    res.status(200).json({success:false, result:"Microsite created."});
                });
            }
    })

}

ContentPortalCtrl.prototype.SaveShareGetLinkData = function(guid, shareData, cb) {

    let { recipient_email, microsite_id, share_via } = shareData;

    db.GetSiteShareWithRecipient(guid, recipient_email, parseInt(microsite_id), function(err, found, data) {
        if(err) {
            return cb(err)
        }

        if(found && data) {
            return cb(data.k_id)
        }

        db.GetMicrositeContentsCardIds(parseInt(microsite_id), function(err, content_ids) {
            if(err) {
                return cb(err)
            }
            
            db.SaveShareGetLinkData(guid, recipient_email, parseInt(microsite_id), share_via, content_ids.doc_id, content_ids.doc_ser_id, function(err, share_id) {
                if(err) {
                    return cb(err)
                }
                
                cb(null, share_id.func_insert_microsite_get_sharelink_data);
            });
        });
    })

}

ContentPortalCtrl.prototype.GetMyShares = function(guid, cb) {

    db.GetMyShares(guid, function(err, data) {
        if(err) {
            return cb(err)
        }
        cb(null, data);
    });

}

ContentPortalCtrl.prototype.GetPopularContent = function(cb) {

    db.GetPopularContent(function(err, data) {
        if(err) {
            return cb(err)
        }

        db.GetCPPoularTags(function(err, tagsData) {
            if(err) {
                return cb(err);
            }
    
            for(var i=0; i< data.length; i++) {
                let popular_tags = `${data[i].content_tag} , ${data[i].content_stage_tags}`;
                let tags = popular_tags.split(',');
                let content_tags = [];
                let content_stage_tags = [];
                for(let k=0; k<tags.length; k++) {
                    for(let j=0; j<tagsData.length; j++) {
                        if(tagsData[j].id === parseInt(tags[k])) {
                            if(tagsData[j].tag_type === 'CONTENT_TAG') {
                                tagsData[j].isNewTag = false;
                                content_tags.push(tagsData[j]);
                            } else {
                                tagsData[j].isNewTag = false;
                                content_stage_tags.push(tagsData[j]);
                            }
                        }
                    }
                }
                // console.log("content_tags", content_tags);
                // console.log("content_stagetags", content_stage_tags);
                data[i].content_tags = content_tags;
                data[i].content_stage_tags = content_stage_tags;
            }
            
            if(data.length === i) {
                cb(null, data);
            }
        });

    });

}

ContentPortalCtrl.prototype.InsertRecommenedContent = function(guid, contentData, payload, cb) {

    let insertRecommendedCnt = [];
    for(let i=0; i< contentData.emails.length; i++) {
        insertRecommendedCnt.push(funInsertRecommendedCnt(guid, contentData.emails[i], contentData.doc_id, contentData.doc_serial_id));
    }

    Promise.all(insertRecommendedCnt).then(data => {
        cb(null, 'Content recommended to all team members successfully');
    }, error => {
        cb(error, null);
    }).catch(err => {
        cb(err, null);
    })

}

function funInsertRecommendedCnt(guid, email, doc_id, doc_ser_id) {
    return new Promise((resolve, reject) => {
        db.GetUser(email, function(err, found, data){
            if (err) {
                console.log("err: " + err);
                return reject("Something went wrong");
            }
            
            if (found && data) {
                db.CheckRecommendContentExist(data.uuid, doc_id, doc_ser_id, function(err, found, content) {
                    if(err) {
                        return reject("Something went wrong");
                    }
                    
                    if (found && data) {
                        resolve("already recommended")
                    }

                    if(found === false) {
                        db.InsertRecommendCnt(guid, data.uuid, doc_id, doc_ser_id, function(err, insert) {
                            if(err) {
                                return reject("Something went wrong");
                            }

                            resolve("successfully recommended the content to the user")
                        })
                    }
                    
                })
            }
            if(found == false) {
                resolve("not found");
            }
        });
    })
}

ContentPortalCtrl.prototype.GetRecommendedContents = function(guid, cb) {

    db.GetRecommendedContents(guid, function(err, data) {
        if(err) {
            return cb(err)
        }

        db.GetCPPoularTags(function(err, tagsData) {
            if(err) {
                return cb(err);
            }
    
            for(var i=0; i< data.length; i++) {
                let popular_tags = `${data[i].content_tag} , ${data[i].content_stage_tags}`;
                let tags = popular_tags.split(',');
                let content_tags = [];
                let content_stage_tags = [];
                for(let k=0; k<tags.length; k++) {
                    for(let j=0; j<tagsData.length; j++) {
                        if(tagsData[j].id === parseInt(tags[k])) {
                            if(tagsData[j].tag_type === 'CONTENT_TAG') {
                                tagsData[j].isNewTag = false;
                                content_tags.push(tagsData[j]);
                            } else {
                                tagsData[j].isNewTag = false;
                                content_stage_tags.push(tagsData[j]);
                            }
                        }
                    }
                }
                // console.log("content_tags", content_tags);
                // console.log("content_stagetags", content_stage_tags);
                data[i].content_tags = content_tags;
                data[i].content_stage_tags = content_stage_tags;
            }
            
            if(data.length === i) {
                cb(null, data);
            }
        });

    });

}

ContentPortalCtrl.prototype.DeleteMicrositeContents = function(guid, link, microsite_id, contents, cb) {

    db.CheckMicroSiteShared(microsite_id, function(err, shared, msShared) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        if (msShared.exists) {
            return cb({message:"Microsite has been shared. We can't perform delete action"});
        } else {
            db.GetMicrositeContentsCardIds(parseInt(microsite_id), function(err, content_ids) {
                if(err) {
                    return cb(err)
                }

                let contentLength = content_ids.doc_ser_id !== null ? content_ids.doc_ser_id.length : 0;

                if(contentLength === 1) {
                    return cb('Microsite contents could not be less than 1')
                }
                db.DeleteMicrositeContents(guid, link, microsite_id, contents, function(err, data) {
                    if(err) {
                        return cb(err);
                    }
                    
                    cb(null, data);
                });
            })
        }

    });

}

ContentPortalCtrl.prototype.AddNewMicrositeContents = function(guid, microsite_id, content_ser_id, content_doc_id, cb) {

    db.CheckMicroSiteShared(microsite_id, function(err, shared, msShared) {
        if (err) {
            console.log("err: " + err);
            return cb("Something went wrong")
        }
        if (msShared.exists) {
            return cb("Microsite has been shared. We can't perform delete action");
        } else {
            db.CheckContentExistInMicrosite(microsite_id, content_ser_id, function(err, added, cardData) {
                if (err) {
                    console.log("err: " + err);
                    return cb("Something went wrong")
                }

                if (added) {
                    return cb("Selected content already added in microsite");
                }

                db.AddNewMicrositeContents(guid, microsite_id, content_ser_id, content_doc_id, function(err, data) {
                    if(err) {
                        return cb(err)
                    }
                    
                    cb(null, "content added successfully to microsite");
                });
            });
        }

    });

}

ContentPortalCtrl.prototype.SaveUploadVideo = function(guid, bodyData, cb) {

    let { microsite_id, video_url } = bodyData;

    // createGifAndThumbImg(video_url, function(err, data) {
    //     if(err) {
    //         return cb(err)
    //     }

    //     let { s3GifName, s3ThumbnailName } = data;
    //     console.log(s3ThumbnailName);
    //     console.log(s3ThumbnailName);
        
    //     db.SaveVideoContentData(guid, video_url, parseInt(microsite_id), s3GifName, s3ThumbnailName, function(err, data) {
    //         if(err) {
    //             return cb(err)
    //         }

    //         cb(null, "Video content created successfully")

    //     });

    // });
    let gifUrl = `${video_url}.gif`;
    db.SaveVideoContentData(guid, video_url, parseInt(microsite_id), gifUrl, '', true, function(err, data) {
        if(err) {
            return cb(err)
        }

        cb(null, "Video content created successfully")

    });
}

ContentPortalCtrl.prototype.SaveCTATextData = function(guid, bodyData, cb) {

    let { microsite_id, CTAtext, CTAlink } = bodyData;

    db.SaveCTATextData(guid, parseInt(microsite_id), CTAtext, CTAlink, function(err, data) {
        if(err) {
            return cb(err)
        }

        cb(null, "CTA text created successfully")

    });
}
//not using right now
function createGifAndThumbImg(video_content_url, cb) {

    let input = video_content_url;
    let fileName = `${Date.now()}-vc.gif`;
    let output = path.join(__dirname,`../dist/upload/vidCntGifs/${fileName}`);
    let wmimage= path.join(__dirname,'../dist/upload/vidCntGifs/water_mark.png');

    ffmpeg(input)
    .withFps(1/4,1/8,1/12,1/16)
    .addOption('-vf','movie='+wmimage+'[watermark]; [input] [watermark] overlay=(W-w)/2:(H-h)/1 [output]')
    .on('end',function(){
        let thumbFileName = `${Date.now()}-vct.jpg`;
        let thumbnail = path.join(__dirname,`../dist/upload/vidCntThumbnails/${thumbFileName}`);
        let input2 = video_content_url;
        ffmpeg(input2)
        .addOption('-vf','movie='+wmimage+'[watermark]; [input] [watermark] overlay=(W-w)/2:(H-h)/1 :shortest=1 [output]').on('end', function() {
            fs.readFile(output, function (err, data) {
                if (err) {
                    return cb(err.message)
                }; // Something went wrong!
                var params = {
                    Bucket: 'video-gifs',
                    Key: fileName, //file.name doesn't exist as a property
                    ACL: 'public-read',
                    Body: data
                };
                s3bucket.upload(params, function (err, data) {
                    // Whether there is an error or not, delete the temp file
                    fs.unlink(output, function (err) {
                        if (err) {
                            console.error("Failed to delete temp file", err);
                        }
                        console.log('Temp File Delete');
                    });
            
                    if (err) {
                        console.log('ERROR MSG: ', err);
                        return cb(err.message)
                    } else {
                        let s3GifName = `https://video-gifs.s3-us-west-2.amazonaws.com/${fileName}`;

                        fs.readFile(thumbnail, function (err, data) {
                            if (err) {
                                console.log("err", err.message);
                                return cb(err.message)
                            }; // Something went wrong!
                            var params = {
                                Bucket: 'video-content-thumbnails',
                                Key: thumbFileName, //file.name doesn't exist as a property
                                ACL: 'public-read',
                                Body: data
                            };
                            s3bucket.upload(params, function (err, data) {
                                // Whether there is an error or not, delete the temp file
                                fs.unlink(thumbnail, function (err) {
                                    if (err) {
                                        console.error("Failed to delete temp file", err);
                                    }
                                    console.log('Temp File Delete2');
                                });
                        
                                if (err) {
                                    console.log('ERROR MSG: ', err);
                                    return cb(err.message)
                                } else {
                                    let s3ThumbnailName = `https://video-content-thumbnails.s3-us-west-2.amazonaws.com/${thumbFileName}`;
                                    return cb(null, {
                                        s3GifName: s3GifName,
                                        s3ThumbnailName: s3ThumbnailName
                                    })
                                }
                            });
                        })
                    }
                });
            })
        })
        .save(thumbnail);
    })
    .save(output)
}

module.exports = new ContentPortalCtrl();