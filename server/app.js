const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const http = require('http');
const session = require('express-session');
const passport = require('passport');

const utils = require('./utils');
const AssignDefaultCourses = require('./assignDefaultCourses');
const GetSchema = require('./middlewares/GetSchema');
const auth = require('./middlewares/isAuth');

var TenantConfig = require('./tenant.config.json');
const db = require('./db');

const GetSkills = require("./routes/getskills");
const SlackAuth = require("./routes/slackAuth");
const Onboarding = require("./routes/onboarding");
const Register = require("./routes/register");
const Login = require("./routes/login");
const Profile = require("./routes/profile");
const InsertWeeklyUpdates = require("./routes/insertweeklyupdates");
const GetWeeklyUpdates = require("./routes/getweeklyupdates");
const UploadFile = require("./routes/uploadfile");
const Workhighlights = require("./routes/workhighlights");
const Courses = require("./routes/courses");
const Unfurl = require("./routes/unfurl");
const RecommendCouses = require("./routes/recommendation");
const CustomCourses = require("./routes/customcourses");
const GetData = require("./routes/getdata");
const OktaSamlAuth = require("./routes/oktasamlauth");
const Achievements = require("./routes/achievements");
const LearningAnalytics = require("./routes/learninganalytics");
const AWSSES = require('./routes/awsses');
const VerifUser = require('./routes/verifyuser');
const ManageAccess = require('./routes/manageaccess');
const Team = require('./routes/team');
const Salesforce = require('./routes/salesforce');
const Analytics = require('./routes/analytics');
const ContentPortal = require('./routes/contentportal');
const GAReportingApi = require('./routes/ga-repoting');
const ADMIN = require('./routes/admin'); //no admin for now, but In it there are API to create system generated templates

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://tenant.vcap.me:3000', 'http://tenant2.vcap.me:3000', 'http://tenant2.vcap.me:3001'],
    default: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var keys = Object.keys(TenantConfig);
var tenantStrategies = {};

utils.samlStrategy();

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.all('/login/callback', function(req, res, next) {
    //console.log("req", req);
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    console.log("Callback", tenant);
    let subDomain = utils.GetValidSubDomain(tenant);
    passport.authenticate(subDomain, function(err, user, info) {
        if (err) {
		return res.redirect('/tenant/404'); 
	}
        if (!user) { return res.redirect('/login'); }
        //console.log("user",user);
        req.logIn(user, function(err) {
        if (err) {
		return res.redirect('/tenant/404'); 
	}
        return res.redirect('/');
        });
    })(req, res, next);
});

app.post('/api/v1/sandbox/check-tenant-exist', GetSchema, function(req, res) {
    res.status(200).json({success: true, result:'tenant exist'})
})

app.post('/create_new_tenant', function(req, res, next) {
    let sandboxEnv = process.env.NODE_ENV === "sandbox" ? true : false;
    db.createFunctions('public', req.body.tenant, sandboxEnv, function(err, result) {
        if(err) {
            res.status(500).json({success:false, message:err.message});
            return;
        }

        res.status(200).json({success:true, result:"Record created"});
    })
});

//temp API to assign efault courses to all tenant users
app.get('/assign-default-course', GetSchema, function(req, res, next) {
    var domain = req.headers.host;
    var tenant = domain.split('.')[0];
    db.GetAllEmails(function(err, emails) {
        if(err) {
            res.json(500).json({success: false, message: err});
            return;
        }
        
        AssignDefaultCourses.assignDefaultCourse(emails[0].array_agg, tenant, function(err, data) {
            if(err) {
                res.json(500).json({success: false, message: err});
                return;
            }
            res.status(200).json({success: true, data: data})
        })
    })
})

app.use('/api/slack/auth', SlackAuth);
app.use('/api/v1/ga', GAReportingApi);
app.use('/api/unfurling', GetSchema, Unfurl);
app.use("/api/v1/content-portal", GetSchema, ContentPortal);
app.use("/api/v1/get-skills", auth, GetSchema, GetSkills);
app.use("/api/v1/onboarding", auth, GetSchema, Onboarding);
app.use("/api/v1/register", GetSchema, Register);
app.use("/api/v1/login", GetSchema, Login);
app.use("/api/v1/aws-ses", AWSSES);
app.use("/api/v1/admin", ADMIN);
app.use("/api/verify", GetSchema, VerifUser);
app.use("/api/v1/profile", GetSchema, Profile);
app.use("/api/v1/weekly-update", auth, GetSchema, InsertWeeklyUpdates);
app.use("/api/v1/get-weekly-update", auth, GetSchema, GetWeeklyUpdates);
app.use("/api/v1", auth, GetSchema, UploadFile);
app.use("/api/v1/work-highlights", auth, GetSchema, Workhighlights);
app.use("/api/v1/courses", auth, GetSchema, Courses);
app.use("/api/v1/course-recommend", auth, GetSchema, RecommendCouses);
app.use("/api/v1/custom-course", auth, GetSchema, CustomCourses);
app.use("/api/v1/get", auth, GetSchema, GetData);
app.use("/api/okta/saml", OktaSamlAuth);
app.use("/api/v1/achievement", auth, GetSchema, Achievements);
app.use("/api/v1/learning-analytics", auth, GetSchema, LearningAnalytics);
app.use("/api/v1/manage-access", auth, GetSchema, ManageAccess);
app.use("/api/v1/team", auth, GetSchema, Team);
app.use("/api/v1/salesforce", auth, GetSchema, Salesforce);
app.use("/api/v1/analytics", auth, GetSchema, Analytics);

app.all('/api/*', (req, res) => {
    res.status(404).end();
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.all('/*', (req, res) => {
    res.status(404).end();
})

// Catch auth errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ success:false, message: "Unauthorised Error: " + err.message });
    }

    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).json({
            status: false,
            message: err.error.toString()
        });
    }

});

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(3000, function() {
    console.log("listen on port 3000");
})
