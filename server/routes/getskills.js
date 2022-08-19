'use strict';

const Express = require('express');
const Router = Express.Router();
const db = require('../db');
const SkillsCtrl = require('../controllers/skills_ctrl');

Router.get('/', function(req, res, next) {

  if (!!req.payload === false || !!req.payload._id === false) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  SkillsCtrl.getRelationalSkills(req.payload, function(err, data) {
    if (err) {
        console.log("get Skills 500 error: ");
        res.status(500).send({success: false, message: err});
        return;
    }

    res.status(200).json({success: true, result: data});
  });     
  
});

module.exports = Router;