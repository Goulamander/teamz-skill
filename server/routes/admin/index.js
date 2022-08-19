const Express = require('express');
const Router = Express.Router();

const DefaultExpTemplates = require('./default-exp-templates');

Router.use('/def-exp-templates', DefaultExpTemplates);

module.exports = Router;