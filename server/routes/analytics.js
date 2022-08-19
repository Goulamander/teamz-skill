'use strict';

const Express = require('express');
const Router = Express.Router();

const AnalyticsCtrl = require('../controllers/analytics_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.get('/opportunity-amount', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    let queryparam = !!req.query.close_won === true ? req.query.close_won : '';
    
    AnalyticsCtrl.GetOpportunityAmount(req.payload._id, queryparam, function(err, data) {
        
        if(err) {
            return res.status(500).json({success: false, message:err}); 
        }
        
        res.status(200).json({success:200, result:data})

    })

})

Router.get('/quota-attainment', AcceessControl, function(req, res, next) {

    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    AnalyticsCtrl.GetQuotaAttainment(req.payload._id, function(err, data) {
        
        if(err) {
            return res.status(500).json({success: false, message:err}); 
        }
        
        res.status(200).json({success:200, result:data})

    })

})

module.exports = Router;