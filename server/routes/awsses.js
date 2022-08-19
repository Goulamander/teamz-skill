const Express = require('express');
const Router = Express.Router();
const aws = require('aws-sdk');
const config = require('../config');

var ses = new aws.SES({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY,"region":config.SES_REGION});

Router.post('/create-invite-template', function(req, res, next) {
    const params = {
        "Template": {
          "TemplateName": "InviteMemeberTemplate",
          "SubjectPart": "{{userName}} has invited you to join TeamzSkill",
          "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div><h1 style='font-weight: 600;'>Join TeamzSkill</h1><span style='text-transform: capitalize;'>{{userName}}</span> ({{userEmail}}) has invited you to join TeamzSkill. Join now to start up-skilling! <br><br> <a href='https://{{tenant}}.{{baseUrl}}' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Join Now</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.createTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });    
  
});

Router.put('/update-invite-template', function(req, res, next) {
    const params = {
        "Template": {
          "TemplateName": "InviteMemeberTemplate",
          "SubjectPart": "{{userName}} has invited you to join TeamzSkill",
          "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div><h1 style='font-weight: 600;'>Join TeamzSkill</h1><span style='text-transform: capitalize;'>{{userName}}</span> ({{userEmail}}) has invited you to join TeamzSkill. Join now to start up-skilling! <br><br> <a href='https://{{tenant}}.{{baseUrl}}' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Join Now</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.updateTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

Router.delete('/delete-invite-template', function(req, res, next) {
    const params = {
        "TemplateName": "InviteMemeberTemplate"
    }

    ses.deleteTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

Router.post('/create-assignment-template', function(req, res, next) {
    const params = {
        "Template": {
            "TemplateName": "CourseAssignmentTemplate",
            "SubjectPart": "{{userName}} has assign you a course",
            "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div> <h1 style='font-weight: 600;'>Hi <span style='text-transform: capitalize;'>{{recipientName}}</span></h1> <span style='text-transform: capitalize;'>{{userName}}</span> ({{userEmail}})has assigned you a course. Happy Learning!<br><br> <a href='https://{{tenant}}.{{baseUrl}}/my-courses.html' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Check Course</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.createTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });    
  
});

Router.put('/update-assignment-template', function(req, res, next) {
    const params = {
        "Template": {
            "TemplateName": "CourseAssignmentTemplate",
            "SubjectPart": "{{userName}} has assigned you a course",
            "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div><h2 style='font-weight: 600;'>Hi <span style='text-transform: capitalize;'>{{recipientName}},</span></h2> <span style='text-transform: capitalize;'>{{userName}}</span> ({{userEmail}}) has assigned you a course. Happy Learning!<br><br> <a href='https://{{tenant}}.{{baseUrl}}/my-courses.html' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Check Course</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.updateTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

Router.delete('/delete-assignment-template', function(req, res, next) {
    const params = {
        "TemplateName": "CourseAssignmentTemplate"
    }

    ses.deleteTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

Router.post('/create-signup-template', function(req, res, next) {
    const params = {
        "Template": {
          "TemplateName": "SignupTemplate",
          "SubjectPart": "Confirm your email address on TeamzSkill",
          "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div><h1 style='font-weight: 600;'>Confirm your email address to get started on TeamzSkill</h1> Once you've confirmed that <span style='text-transform: capitalize'>{{email}}</span> is your email address, we will send you to your team site for TeamzSkill. <br><br> <a href='https://{{tenant}}.{{baseUrl}}/verify/{{verifiedCode}}' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Confirm Email Address</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.createTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });    
  
});

Router.put('/update-signup-template', function(req, res, next) {
    const params = {
        "Template": {
          "TemplateName": "SignupTemplate",
          "SubjectPart": "Confirm your email address on TeamzSkill",
          "HtmlPart": "<div style='font-family: arial;'> <div><img src='https://temazskillpictures.s3-us-west-2.amazonaws.com/teamzskill_logo.png' width='150'/></div><h1 style='font-weight: 600;'>Confirm your email address to get started on TeamzSkill</h1> Once you've confirmed that {{email}} is your email address, we will send you to your team site for TeamzSkill. <br><br> <a href='https://{{tenant}}.{{baseUrl}}/verify/{{verifiedCode}}' style='background-color: rgb(83, 82, 237); border: none; color: rgb(255, 255, 255); padding: 10px 50px;text-align: center;text-decoration: none;display: inline-block;font-size: 18px;margin: 4px 2px;cursor: pointer;'>Confirm Email Address</a> <br><br> ---------------------- <br> Made by TeamzSkill Inc. <br> 1049 El Monte Ave, STE C #602 Mountain View, CA 94040</div>",
        }
    }

    ses.updateTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

Router.delete('/delete-signup-template', function(req, res, next) {
    const params = {
        "TemplateName": "SignupTemplate"
    }

    ses.deleteTemplate(params, (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        }
        else {
            console.log(data);
            res.status(200).json(data.ResponseMetadata);
        }
    });
});

module.exports = Router;
