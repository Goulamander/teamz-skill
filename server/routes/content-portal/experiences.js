'use strict';

const Express = require('express');
const Router = Express.Router();

const ExperiencesCtrl = require('../../controllers/experiences_ctrl');
const AcceessControl = require('../../middlewares/AccessControl');
const Utils = require('../../utils');
const auth = require('../../middlewares/isAuth');

Router.post('/create-experience', auth, AcceessControl, ExperiencesCtrl.CreateExperience);

Router.put('/update-experience', auth, AcceessControl, ExperiencesCtrl.UpdateExperience);

Router.get('/', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ExperiencesCtrl.GetExperiences(req.payload._id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });
});

Router.get('/experience/:experience_link', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ExperiencesCtrl.GetExperiencesByLink(req.payload._id, req.params.experience_link, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        let accessType = Utils.getDraftExperiencesAccessID(req.payload.role);
        if(data[0].exp_state === 'Draft') {
            if(accessType === '1') {
                res.status(200).json({success: true, result: data[0]});
            } else {
                res.status(500).json({success: true, result: "you don't have access to view data for this experience"});
            }

        } else {
            res.status(200).json({success: true, result: data[0]});
        }
    });
});

module.exports = Router;