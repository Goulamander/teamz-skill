const Express = require('express');
const Router = Express.Router();
const AdminCtrl = require('../../controllers/admin_ctrl');
const auth = require('../../middlewares/isAuth');
const AcceessControl = require('../../middlewares/AccessControl');

Router.post('/', AdminCtrl.InsertDefExpTemplates);

Router.get('/', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    AdminCtrl.GetDefExpTemplates(function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }

        res.status(200).json({success: true, result: data});
    });
});

Router.get('/template/:template_link', auth, AcceessControl, function(req, res, next) {
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({success:false, message:"Unauthorised"});
        return;
    }

    AdminCtrl.GetDefExpTemplatesByLink(req.params.template_link, function(err, data) {
        if(err) {
            res.status(500).json({success: false, message: err});
            return;
        }
        res.status(200).json({success: true, result: data[0]});
    });
});

module.exports = Router;