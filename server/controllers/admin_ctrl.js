const db = require('../db');
const Joi = require('joi');
const _ = require('lodash');
const Utils = require('../utils');

const AddExpTopics = require('../models/experinceTopics');

const DefTemplateExpSchema = Joi.array().items(Joi.object({
    short_des: Joi.string().required(),
    title: Joi.string().required(),
    link: Joi.string().required(),
    text_to_display: Joi.string().required(),
    logo: Joi.string().required(),
    background_image: Joi.string().required(),
    topics: Joi.array().items(Joi.object({
        topic_name : Joi.string().required(),
        topic_bgcolor: Joi.string().required(),
        topic_text_color: Joi.string().required(),
        topic_link : Joi.string().uri().required(),
        topic_link_type : Joi.string().valid('MICROSITE_LINK','FILE_LINK').required()
    })).required().min(1).max(9)
})).min(1).max(10);

function AdminCtrl() {

}

AdminCtrl.prototype.InsertDefExpTemplates = function(req, res, next) {
    // if (!!req.payload === false || !!req.payload._id === false) {
    //     res.status(401).json({success:false, message:"Unauthorised"});
    //     return;
    // }

    let experienceData = req.body;

    let schemaError = Joi.validate(experienceData, DefTemplateExpSchema);

    if(schemaError.error != null) {
        console.log("schemaError", schemaError.error.details[0].message);
        return res.status(422).json({success:false, message: schemaError.error.details[0].message});
    }

    let createTemplatePromise = [];
    for(let i=0; i<experienceData.length; i++) {
        createTemplatePromise.push(funCreateTemplate(experienceData[i]))
    }

    Promise.all(createTemplatePromise).then(data => {
        res.status(200).json({success:false, result:"Template experience created."});
    }, err => {
        console.log(err);
        return res.status(500).json({success:false, message:err});
    });
}

function funCreateTemplate(experienceData) {
    return new Promise((resolve, reject) => {
        const { short_des, title, link, text_to_display, logo, background_image, exp_state } = experienceData;
        console.log("data", experienceData.link);
        let topics = new AddExpTopics(experienceData.topics);
        db.CheckDefExpTempLinksExist(experienceData.link.trim(), function(err, found, result) {
            if(err) {
                reject(err);
            }
            if(found) {
                reject("Custom link already in used. Please choose different link");
            }

            db.InsertDefExpTemplates(short_des, title, link.trim(), text_to_display.trim(), logo, background_image, exp_state, topics, function(err, data) {
                if(err) {
                    reject(err);
                }
                
                resolve("Experience created.");
            });
            
        })
    })
}

AdminCtrl.prototype.GetDefExpTemplates = function(cb) {

    db.GetDefExpTemplates(function(err, topics) {
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
        exp_created: value[0].exp_created,
        topics: _.map(value, object =>
            _.omit(object, ['exp_id', 'title', 'description', 'logo', 'link', 'text_to_display', 'background_img', 'exp_created']) // return from _.omit
            )
        })).value()

        cb(null, expWithTopics)

    });

}

AdminCtrl.prototype.GetDefExpTemplatesByLink = function(expLink, cb) {

    db.GetDefExpTemplatesByLink(expLink, function(err, topics) {
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
        header_color: Utils.getHeaderColor(value[0].background_img),
        topics: _.map(value, object =>
            _.omit(object, ['exp_id', 'title', 'description', 'logo', 'link', 'text_to_display', 'background_img', 's_header_color']) // return from _.omit
            )
        }))
        .value()

        cb(null, expWithTopics)

    });

}

module.exports = new AdminCtrl();