'use strict';

const Express = require('express');
const Router = Express.Router();
const db = require('../db');
const SettingCtrl = require('../controllers/settings_ctrl');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/', AcceessControl, function(req, res, next) {

  if (!!req.payload === false || !!req.payload._id === false) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }
  var startDate = new Date(req.body.start_date); //your input date here

  var currentDate = new Date(); // today date
  currentDate.setMonth(currentDate.getMonth() - 6);  //subtract 6 month from current date 

  if (startDate < currentDate) {
    console.log("date is more than 6 month");
    res.status(400).send({success: false, message: "past time"});
    return;
  }
  
  SettingCtrl.GetWeeklyUpdates(req.payload._id, req.body, function(err, data) {
    if (err) {
        console.log("get weekly update 500 error: ");
        res.status(500).send({success: false, message: err});
        return;
    }

    res.status(200).json({success: true, result: data});
  });     
  
});

module.exports = Router;