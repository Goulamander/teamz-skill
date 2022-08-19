const Express = require('express');
const Router = Express.Router();
const AuthCtrl = require('../controllers/auth_ctrl');

Router.get('/:code', function(req, res, next) {     
    AuthCtrl.VerifyUser(req.params.code, function(err, data) {
        if (err) {
            console.log("verify user 500 error: ");
            res.status(500).json({success:false, message:err});
            return;
        }
    
        res.status(200).json({success:true, result:data});;
    })
});

module.exports = Router;