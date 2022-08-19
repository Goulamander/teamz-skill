const db = require('../db');
const Joi = require('joi');
var multer = require('multer');
const _ = require('lodash');
var path = require('path');

const AddExpTopics = require('../models/experinceTopics');

function ExperiencesCtrl() {

}

const CreateExperienceSchema = Joi.object({
    exp_id: Joi.any().optional(),
    short_des: Joi.string().required().allow(''),
    title: Joi.string().required(),
    link: Joi.string().required(),
    text_to_display: Joi.string().required(),
    logo: Joi.string().required().allow(''),
    background_image: Joi.string().required().allow(''),
    exp_state : Joi.string().valid('Save','Draft').required(),
    topics: Joi.when('exp_state', { is: 'Draft', then: Joi.array().items(Joi.object({
        topic_id : Joi.any().optional(),
        topic_name : Joi.string().required(),
        topic_bgcolor: Joi.string().required(),
        topic_text_color: Joi.string().required(),
        topic_link: Joi.string().allow('').allow(null),
        topic_link_type : Joi.any().allow(null)
    })).required().min(1).max(9), otherwise : Joi.array().items(Joi.object({
        topic_id : Joi.any().optional(),
        topic_name : Joi.string().required(),
        topic_bgcolor: Joi.string().required(),
        topic_text_color: Joi.string().required(),
        topic_link : Joi.string().uri().required(),
        topic_link_type : Joi.string().valid('MICROSITE_LINK','FILE_LINK').required(),
    })).required().min(1).max(9) })
});

const EditExperienceSchema = Joi.object({
    exp_id: Joi.number().required(),
    short_des: Joi.string().required().allow(''),
    title: Joi.string().required(),
    link: Joi.string().required(),
    text_to_display: Joi.string().required(),
    logo: Joi.string().required().allow(''),
    background_image: Joi.string().required().allow(''),
    exp_state : Joi.string().valid('Save','Draft').required(),
    topics: Joi.when('exp_state', { is: 'Draft', then: Joi.array().items(Joi.object({
        topic_id : Joi.any().optional(),
        topic_name : Joi.string().required(),
        topic_bgcolor: Joi.string().required(),
        topic_text_color: Joi.string().required(),
        topic_link: Joi.string().allow('').allow(null),
        topic_link_type : Joi.any().allow(null)
    })).required().min(1).max(9), otherwise : Joi.array().items(Joi.object({
        topic_id : Joi.any().optional(),
        topic_name : Joi.string().required(),
        topic_bgcolor: Joi.string().required(),
        topic_text_color: Joi.string().required(),
        topic_link : Joi.string().uri().required(),
        topic_link_type : Joi.string().valid('MICROSITE_LINK','FILE_LINK').required(),
    })).required().min(1).max(9) })
});

const experiencesImgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let experienceData = JSON.parse(req.body.experienceData);

        let schemaError = Joi.validate(experienceData, CreateExperienceSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.details[0].message);
            return cb(schemaError.error.details[0].message);
        }

        if (file.fieldname === "logo") { // if uploading logo
            cb(null, 'dist/upload/experienceLogo');
        } else { // else uploading image
            cb(null, 'dist/upload/experienceBg');
        }
    },
    filename: function (req, file, cb) {
        let fileExt = path.extname(file.originalname);
        cb(null, Date.now() + '-exp' +fileExt)
    }
});

const experienceUpload = multer({
    storage: experiencesImgstorage,
    limits: {
        fileSize: 500000
    }
}).fields([{ name:'logo', maxCount:1 }, { name:'background', maxCount:1 }]);

const editExperiencesImgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let experienceData = JSON.parse(req.body.experienceData);

        let schemaError = Joi.validate(experienceData, EditExperienceSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.details[0].message);
            return cb(schemaError.error.details[0].message);
        }

        if (file.fieldname === "logo") { // if uploading logo
            cb(null, 'dist/upload/experienceLogo');
        } else { // else uploading image
            cb(null, 'dist/upload/experienceBg');
        }
    },
    filename: function (req, file, cb) {
        let fileExt = path.extname(file.originalname);
        cb(null, Date.now() + '-exp' +fileExt)
    }
});

const editExperienceUpload = multer({
    storage: editExperiencesImgstorage,
    limits: {
        fileSize: 500000
    }
}).fields([{ name:'logo', maxCount:1 }, { name:'background', maxCount:1 }]);

ExperiencesCtrl.prototype.CreateExperience = function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    experienceUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({success:false, message:err.message})
        } else if (err) {
          return res.status(500).json({success:false, message:err.message});
        }
        let experienceData = JSON.parse(req.body.experienceData);

        let schemaError = Joi.validate(experienceData, CreateExperienceSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.details[0].message);
            return res.status(422).json({success:false, message: schemaError.error.details[0].message});
        }
        
        // console.log(req.files.logo);
        // console.log(req.files.background);

        const { short_des, title, link, text_to_display, logo, background_image, exp_state } = experienceData;
        let topics = new AddExpTopics(experienceData.topics);
        
        db.CheckExperienceLinksExist(link.trim(), function(err, found, result) {
            if(err) {
                return res.status(500).json({success:false, message:err});
            }
            if(found) {
                return res.status(500).json({success:false, message:"Custom link already in used. Please choose different link"});
            }
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

                db.InsertExperienceData(req.payload._id, short_des, title, link.trim(), text_to_display.trim(), logo_url, bg_url, exp_state, topics, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    
                    res.status(200).json({success:false, result:"Experience created."});
                });
                
            } else {
                db.InsertExperienceData(req.payload._id, short_des, title, link.trim(), text_to_display.trim(), logo, background_image, exp_state, topics, function(err, data) {
                    if(err) {
                        console.log("Something went wrong", err);
                        return res.status(500).json({success:false, message:"Something went wrong"});
                    }
                    
                    res.status(200).json({success:false, result:"Experience created."});
                });
            }
        })
    })
}

ExperiencesCtrl.prototype.UpdateExperience = function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    editExperienceUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({success:false, message:err.message})
        } else if (err) {
          return res.status(500).json({success:false, message:err.message});
        }
        let experienceData = JSON.parse(req.body.experienceData);

        let schemaError = Joi.validate(experienceData, EditExperienceSchema);

        if(schemaError.error != null) {
            console.log("schemaError", schemaError.error.details[0].message);
            return res.status(422).json({success:false, message: schemaError.error.details[0].message});
        }
        
        // console.log(req.files.logo);
        // console.log(req.files.background);

        const { short_des, title, link, text_to_display, logo, background_image, exp_state, exp_id } = experienceData;
        let topics = new AddExpTopics(experienceData.topics);
        console.log("link", link);
        db.CheckExperienceLinksExist(link.trim(), function(err, found, result) {
            if(err) {
                return res.status(500).json({success:false, message:err});
            }
            if(found) {
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
    
                    db.UpdateExperienceData(req.payload._id, short_des, title, link.trim(), text_to_display.trim(), logo_url, bg_url, exp_state, topics, exp_id, function(err, data) {
                        if(err) {
                            console.log("Something went wrong", err);
                            return res.status(500).json({success:false, message:"Something went wrong"});
                        }
                        
                        res.status(200).json({success:false, result:"Experience updated."});
                    });
                    
                } else {
                    db.UpdateExperienceData(req.payload._id, short_des, title, link.trim(), text_to_display.trim(), logo, background_image, exp_state, topics, exp_id, function(err, data) {
                        if(err) {
                            console.log("Something went wrong", err);
                            return res.status(500).json({success:false, message:"Something went wrong"});
                        }
                        
                        res.status(200).json({success:false, result:"Experience updated."});
                    });
                }
            } else {
                return res.status(500).json({success:false, message:"experience not found"});
            }
        })
    })
}

ExperiencesCtrl.prototype.GetExperiences = function(guid, cb) {

    db.GetExperiences(guid, function(err, topics) {
        if(err) {
            return cb(err)
        }

        let expWithTopics = _.chain(topics)
        // Group the elements of Array based on `color` property
        .groupBy("exp_id")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ 
        exp_id: value[0].exp_id, 
        title:value[0].title,
        description: value[0].description,
        logo: value[0].logo,
        link: value[0].link,
        text_to_display : value[0].text_to_display,
        background_img: value[0].background_img,
        exp_state: value[0].exp_state,
        exp_created: value[0].exp_created,
        topics: _.map(value, object =>
            _.omit(object, ['exp_id', 'title', 'description', 'logo', 'link', 'text_to_display', 'background_img', 'exp_state', 'exp_created']) // return from _.omit
            )
        })).value()

        cb(null, expWithTopics)

    });

}

ExperiencesCtrl.prototype.GetExperiencesByLink = function(guid, expLink, cb) {

    db.GetExperiencesByLink(expLink, function(err, topics) {
        if(err) {
            return cb(err)
        }
        
        let expWithTopics = _.chain(topics)
        // Group the elements of Array based on `color` property
        .groupBy("exp_id")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ 
        exp_id: value[0].exp_id, 
        title:value[0].title,
        description: value[0].description,
        logo: value[0].logo,
        link: value[0].link,
        text_to_display : value[0].text_to_display,
        background_img: value[0].background_img,
        exp_state: value[0].exp_state,
        header_color: value[0].s_header_color,
        topics: _.map(value, object =>
            _.omit(object, ['exp_id', 'title', 'description', 'logo', 'link', 'text_to_display', 'background_img', 's_header_color', 'exp_state']) // return from _.omit
            )
        }))
        .value()

        cb(null, expWithTopics)

    });

}

module.exports = new ExperiencesCtrl();