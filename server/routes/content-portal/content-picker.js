'use strict';

const Express = require('express');
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({passError: true});
const Router = Express.Router();

const ContentPortalCtrl = require('../../controllers/content_portal_ctrl');
const AcceessControl = require('../../middlewares/AccessControl');

const GDriveContentSchema = Joi.object({
    GDriveDocs: Joi.array().items(Joi.object({
        description: Joi.string().optional().allow(''),
        embedUrl: Joi.string().required(),
        iconUrl: Joi.string().required(),
        id: Joi.string().required(),
        isShared: Joi.boolean().required(),
        lastEditedUtc: Joi.date().required(),
        mimeType: Joi.string().required(),
        name: Joi.string().required(),
        serviceId: Joi.string().required(),
        sizeBytes: Joi.number().required(),
        type: Joi.string().required(),
        url: Joi.string().required(),
        parentId: Joi.string().optional().allow(''),
        duration: Joi.number().optional()
    })).required().min(1)
});

const AddTagsToContentSchema = Joi.object({
    document_ids: Joi.array().required().min(1),
    tags: Joi.array().items(Joi.object({
        isNewTag: Joi.boolean().required(),
        tag_name: Joi.string().required(),
        tag_type: Joi.string().required(),
        tag_color: Joi.string().required(),
        id: Joi.number().required()
    })).required().min(1)
})

Router.post('/', AcceessControl, validator.body(GDriveContentSchema), function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.AddGDriveContent(req, function(err, statusCode, data) {
        if(err) {
            res.status(statusCode).json({success: false, message: err});
            return;
        }

        res.status(statusCode).json({success: true, result: data});
    });

});

Router.get('/', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetGDriveContent(req.payload._id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.post('/add-tags', validator.body(AddTagsToContentSchema), function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    let { tags } = req.body;

    let newTags = tags.filter(data => {
        return data.isNewTag === true;
    });

    let oldTags = tags.filter(data => {
        return data.isNewTag === false;
    })

    ContentPortalCtrl.UpateDocumentContentTags(req.payload, req.body, oldTags, newTags, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.delete('/delete-contents', function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if(!!req.body.content_docs === false || req.body.content_docs.length < 1) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
    }

    ContentPortalCtrl.DeleteContent(req.body.content_docs, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        res.status(200).json({success: true, result: data});
    })
})

Router.post('/add-contents-to-portal', function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if(!!req.body.content_docs === false || req.body.content_docs.length < 1) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
    }

    ContentPortalCtrl.AddContentsToPortal(req.body.content_docs, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        res.status(200).json({success: true, result: data});
    })
})

module.exports = Router;