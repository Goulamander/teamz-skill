'use strict';

const Express = require('express');
const Router = Express.Router();
const TeamCtrl = require('../controllers/team_ctrl');
const CoursesCtrl = require('../controllers/courses_ctrl');
const AcceessControl = require('../middlewares/AccessControl');
const Joi = require('joi');

const teamObjectSchema = Joi.object({
    team: Joi.array().items(Joi.object({
        team_name: Joi.string().required(),
        team_des: Joi.string().optional().allow(''),
        error: Joi.any().optional(),
    })).required().max(10).min(1).unique('team_name')
});

const teamMembersObjectSchema = Joi.object({
    team_members: Joi.array().items(Joi.object({
        team_id: Joi.any().required(),
        user_id: Joi.any().required()
    })).required().min(1).unique('user_id')
})

Router.post('/', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    let schemaError = Joi.validate(req.body, teamObjectSchema);
    
    if(schemaError.error != null) {
        return res.status(422).json({success:false, message:schemaError.error.message});
    }
    
    TeamCtrl.CreateTeam(req.payload._id, req.body.team, function(err, data) {

        if (err) {
            console.log("create team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.put('/', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false ||  
        !!req.body.team_name === false ||
        !!req.body.team_id === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }

    let initial_letter = req.body.team_name.split("")[0];
    
    TeamCtrl.UpdateTeam(req.payload._id, req.body, initial_letter, function(err, data) {

        if (err) {
            console.log("update team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.get('/', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    TeamCtrl.GetTeam(req.payload._id, req.payload.role, function(err, data) {

        if (err) {
            console.log("create team 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.delete('/', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false ||  
        !!req.body.team_id === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }
    
    TeamCtrl.DeleteTeam(req.payload._id, req.body, req.payload.role, function(err, data) {

        if (err) {
            console.log("delete team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.get('/get-all-org-users/:team_id', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }
    
    TeamCtrl.GetAllOrgUsers(req.payload._id, req.params.team_id, function(err, data) {

        if (err) {
            console.log("get all org user team 500 error: ");
            res.status(500).json({success:false, result: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.post('/team-members', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    let schemaError = Joi.validate(req.body, teamMembersObjectSchema);
    
    if(schemaError.error != null) {
        return res.status(422).json({success:false, message:schemaError.error.message});
    }
    
    TeamCtrl.AddTeamMemebrs(req.payload._id, req.body.team_members, function(err, data) {

        if (err) {
            console.log("create team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.get('/team-members/:team_id', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    TeamCtrl.GetTeamMembers(req.payload._id, req.payload.role, req.params.team_id, function(err, data) {

        if (err) {
            console.log("create team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.delete('/team-members', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    if (!!req.body === false ||  
        !!req.body.team_id === false ||
        !! req.body.user_id === false) {
        res.status(422).json({success:false, message:"Insufficient data to process request"});
        return;
    }

    TeamCtrl.DeleteTeamMembers(req.payload._id, req.payload.role, req.body.team_id, req.body.user_id, function(err, data) {

        if (err) {
            console.log("delete team 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }

        res.status(200).json({success:true, result: data});
    });

});

Router.post('/assign-course', AcceessControl, function(req, res, next) {
    
    if (!!req.payload === false || !!req.payload._id === false) {
        res.status(401).json({ error: "Unauthorised" });
        return;
    }

    TeamCtrl.GetTeamMembersList(req.payload._id, req.payload.role, req.body.teams, req.body.c_id, function(err, alreadyAssign, data) {

        if (err) {
            console.log("Get team member 500 error: ");
            res.status(500).json({success:false, message: err});
            return;
        }
        
        req.body.emails = data;

        CoursesCtrl.InsertAssignCourses(req.payload._id, req.body, req.payload, function(err, details){
            if (err) {
                console.log("insert courses 500 error: ");
                res.status(500).json({success:false, message:err});
                return;
            }

            if(alreadyAssign != null) {
                return res.status(500).json({success:false, message:"Some members of this team already have this course assigned to them. This course will be assigned to the rest of the team members now."});
            }
            res.status(200).json({success:true, result:details});
        });
    });
});

module.exports = Router;