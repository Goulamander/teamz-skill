'use strict';

const Express = require('express');
const Router = Express.Router();

const AcceessControl = require('../middlewares/AccessControl');
const ContentPortalCtrl = require('../controllers/content_portal_ctrl');
const ContentPicker = require('./content-portal/content-picker');
const MyContent = require('./content-portal/my-contents');
const Microsites = require('./content-portal/microsites');
const RecommendedContent = require('./content-portal/recommened-contents');
const Experiences = require('./content-portal/experiences');

const auth = require('../middlewares/isAuth');

Router.get('/popular-tags', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }
    ContentPortalCtrl.GetCPPoularTags(function(err, tags) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        let content_tags= [];
        let content_stage_tags = [];

        for(let i=0; i<tags.length; i++) {
            if(tags[i].tag_type === 'CONTENT_TAG') {
                content_tags.push(tags[i]);
            } else {
                content_stage_tags.push(tags[i]);
            }
        }

        let json = {
            content_tags: content_tags,
            content_stage_tags: content_stage_tags
        }

        res.status(200).json({success: true, result: json});
    })
});

Router.get('/library-images', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetLibraryImages(function(err, data) {
        if(err) {
            return res.status(500).json({success:false, message:err })
        }

        res.status(200).json({success:true, result: data});

    })
})

Router.get('/popular-contents', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetPopularContent(function(err, data) {
        if(err) {
            return res.status(500).json({success:false, message:err })
        }
        res.status(200).json({success:true, result: data});

    })
});

Router.get('/content-analytics', auth, AcceessControl, function(req, res, next) {

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

Router.put('/edit-portal-content', auth, AcceessControl, ContentPortalCtrl.EditPortalContents);

Router.use('/content-picker', auth, ContentPicker);
Router.use('/my-contents', auth, MyContent);
Router.use('/microsites', Microsites);
Router.use('/recommended-contents', auth, RecommendedContent);
Router.use('/experiences', Experiences);

module.exports = Router;