'use strict';

const Express = require('express');
const Router = Express.Router();

const ContentPortalCtrl = require('../../controllers/content_portal_ctrl');
const AcceessControl = require('../../middlewares/AccessControl');

Router.get('/', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetMyContent(req.payload._id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.post('/', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body === false ||  
        !!req.body.doc_id === false ||
        !!req.body.doc_serial_id === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }
    
    ContentPortalCtrl.AddMyContent(req.payload._id, req.body, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        
        res.status(200).json({success: true, result: data});
    });

});

module.exports = Router;