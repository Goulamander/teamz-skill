'use strict';

const Express = require('express');
const Router = Express.Router();

const ContentPortalCtrl = require('../../controllers/content_portal_ctrl');
const TeamCtrl = require('../../controllers/team_ctrl');

const AcceessControl = require('../../middlewares/AccessControl');

Router.get('/', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetRecommendedContents(req.payload._id, function(err, data) {
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
        !!req.body.doc_serial_id === false ||
        !!req.body.teams === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }
    
    TeamCtrl.GetTeamMembersForCntRecommends(req.payload._id, req.payload.role, req.body.teams, req.body.doc_id, req.body.doc_serial_id, function(err, alreadyRecommended, data) {

        if (err) {
            console.log("Get team members 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }
        
        req.body.emails = data;

        ContentPortalCtrl.InsertRecommenedContent(req.payload._id, req.body, req.payload, function(err, data) {
            if(err) {
                res.status(500).json({success: false, message: err});
                return;
            }
            
            if(alreadyRecommended != null) {
                return res.status(500).json({success:false, message:"Some members of this team already have this content recommended to them. This content will be recommended to the rest of the team members now."});
            }
            
            res.status(200).json({success: true, result: data});
        });
    })

});

module.exports = Router;