'use strict';

const Express = require('express');
const GetSchema = require('../middlewares/GetSchema');

const Router = Express.Router();

const AuthCtrl = require('../controllers/auth_ctrl');

Router.post('/', GetSchema, function(req, res, next) {

    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    var queryData = req.body;

    AuthCtrl.SlackAuth(queryData, tenant, function(err, data) {
        if (err) {
            console.log("slack Auth 500 error: ");
            res.status(500).send(err);
            return;
        }

        res.status(200).send(data);
    });

});

Router.post('/setup_slack_tenant', function(req, res) {
    req.body.idp_type = 'slack'
    // request params validation
    if (!!req.body === false || !!req.body.subdomain === false || !!req.body.team_id === false) {
        res.status(422).json({success:false, message:"Invalid form values"});
        return;
    }

    AuthCtrl.CreateSlackTenant(req.body, function(err, data) {
        if (err) {
            console.log("CreateSlackTenant error:", err);
            res.status(500).json(err);
            return;
        }

        res.status(200).json(data);
    })

})

module.exports = Router;