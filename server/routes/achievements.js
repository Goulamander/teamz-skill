'use strict';

const Express = require('express');
const Router = Express.Router();
const AchievementsCtrl = require('../controllers/achievements_ctrl.js');
const AcceessControl = require('../middlewares/AccessControl');

Router.post('/', AcceessControl, AchievementsCtrl.AddAchievements);

Router.get('/', AcceessControl, AchievementsCtrl.GetAchievements);

module.exports = Router;