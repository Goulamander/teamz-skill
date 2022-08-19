'use strict';

const Express = require('express');
const Router = Express.Router();
const _ = require('lodash');

const ContentPortalCtrl = require('../../controllers/content_portal_ctrl');
const AcceessControl = require('../../middlewares/AccessControl');
const auth = require('../../middlewares/isAuth');

Router.post('/create-microsite', auth, AcceessControl, ContentPortalCtrl.InsertMicrositeData);

Router.put('/modify-microsite', auth, AcceessControl, ContentPortalCtrl.ModifyMicrositeData);

Router.get('/', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetMicrosites(req.payload._id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.delete('/microsite/content-cards', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body.link === false || !!req.body.microsite_id === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
    }

    ContentPortalCtrl.DeleteMicrositeContents(req.payload._id, req.body.link, req.body.microsite_id, req.body.microsite_contents, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.post('/microsite/add-new-content', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body.link === false || !!req.body.microsite_id === false || !!req.body.content_serial_id === false || !!req.body.content_doc_id === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
    }

    ContentPortalCtrl.AddNewMicrositeContents(req.payload._id, req.body.microsite_id, req.body.content_serial_id, req.body.content_doc_id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.get('/microsite/:microsite_link', function(req, res, next) {

    ContentPortalCtrl.GetMicrositeData(req.params.microsite_link, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.post('/save-get-share-link', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body.recipient_email === false || !!req.body.microsite_id === false || !!req.body.share_via === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
    }

    ContentPortalCtrl.SaveShareGetLinkData(req.payload._id, req.body, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.get('/my-shares', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    ContentPortalCtrl.GetMyShares(req.payload._id, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        // let sharedData = _.filter(data, function(o) {
        //     if(o.share_via === 'LINK'){
        //         return o
        //     }
        // });
        
        // sharedData = _.chain(sharedData).groupBy("microsite_id").map((value, key) => ({
        //     share_via: value[0].share_via,
        //     open_rate: value[0].open_rate,
        //     click_rate: value[0].click_rate,
        //     time_spent: value[0].time_spent,
        //     microsite_id: value[0].microsite_id,
        //     style_type: value[0].style_type,
        //     title: value[0].title,
        //     backgroung_img: value[0].backgroung_img,
        //     link: value[0].link,
        //     logo: value[0].logo,
        //     text_to_display: value[0].text_to_display,
        //     share_with: mapEmails(value)
        // })).value()

        let sharedData = _.chain(data).groupBy("shared_id").map((value, key) => ({
            shared_id: value[0].shared_id,
            share_via: value[0].share_via,
            open_rate: value[0].open_rate,
            click_rate: value[0].click_rate,
            time_spent: value[0].time_spent,
            microsite_id: value[0].microsite_id,
            style_type: value[0].style_type,
            title: value[0].title,
            backgroung_img: value[0].backgroung_img,
            link: value[0].link,
            logo: value[0].logo,
            text_to_display: value[0].text_to_display,
            share_with:value[0].share_with,
            link_created: value[0].link_created,
            events_data: value.map((val, k) => {
                return {
                    eventlabel: val.eventlabel,
                    eventvalue: val.eventvalue  
                }
            })
        })).value();

        sharedData.sort(function(a, b) { 
            return b.shared_id - a.shared_id;
        });
        res.status(200).json({success: true, result: sharedData});
    });

});

Router.post('/save-upload-video', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body.microsite_id === false || !!req.body.video_url === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
    }

    ContentPortalCtrl.SaveUploadVideo(req.payload._id, req.body, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

Router.post('/save-cta-text', auth, AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    if (!!req.body.CTAtext === false || !!req.body.CTAlink === false || !!req.body.microsite_id === false) {
        res.status(422).json({success:false, message: "Invalid form data" });
        return; 
    }

    ContentPortalCtrl.SaveCTATextData(req.payload._id, req.body, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });

});

function mapEmails(values) {
    let sharedEmails = [];
    for(let i=0; i< values.length; i++) {
        sharedEmails.push(values[i].share_with);
    }
    return sharedEmails;
}

module.exports = Router;