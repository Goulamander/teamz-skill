const Crypto = require('crypto');
const db = require('./db');
const saml = require('passport-saml');
const fs = require('fs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const fetch = require('node-fetch');
const request = require('request');

const msStreamRegx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-z0-9]+\.microsoftstream.com\/video+\/[a-zA-Z0-9]/;
const msOfficeRegx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-z0-9|-]+\.sharepoint.com\/:[wpxo]{1}:/;
const youtubeRegx = /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

const Config = require('./config');

const userRolesMapping = ["MANAGER", "IT_ADMIN_MANAGER", "ADMIN_MANAGER", "IC", "IT_ADMIN_IC", "ADMIN_IC"];

const libraryImgBgColors = [
    { image: 'dist/library/bg_images/bg_1.jpg', color: '#33180a' },
    { image: 'dist/library/bg_images/bg_2.jpg', color: '#080e1c' },
    { image: 'dist/library/bg_images/bg_3.jpg', color: '#4077b8' },
    { image: 'dist/library/bg_images/bg_4.jpg', color: '#304144' },
    { image: 'dist/library/bg_images/bg_5.jpg', color: '#a37e7f' },
    { image: 'dist/library/bg_images/bg_6.jpg', color: '#191e2b' },
    { image: 'dist/library/bg_images/bg_7.jpg', color: '#465f6f' },
    { image: 'dist/library/bg_images/bg_8.jpg', color: '#144064' },
    { image: 'dist/library/bg_images/bg_9.jpg', color: '#f2cc87' },
    { image: 'dist/library/bg_images/bg_10.jpg', color: '#0891fc' },
    { image: 'dist/library/bg_images/bg_11.jpg', color: '#514677' },
    { image: 'dist/library/bg_images/bg_12.jpg', color: '#17192f' },
    { image: 'dist/library/bg_images/bg_13.jpg', color: '#b1b1b1' },
    { image: 'dist/library/bg_images/bg_14.jpg', color: '#63453d' },
    { image: 'dist/library/bg_images/bg_15.jpg', color: '#153923' },
    { image: 'dist/library/bg_images/bg_16.jpg', color: '#c7b9b4' },
];

function Utils() {

}

Utils.prototype.RandomString = function(length) {
    return Crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

Utils.prototype.GetHashUsingSalt = function(valueToHash, salt) {
    var hash = Crypto.createHmac('sha512', salt);
    hash.update(valueToHash);
    return hash.digest('hex');
}

Utils.prototype.twelveDay = function(startDate) {
    var twelveDay = 24*60*60*1000*12; // hours*minutes*seconds*milliseconds*day
    var firstDate = new Date(startDate);
    var secondDate = new Date();

    var diffTime = (secondDate.getTime() - firstDate.getTime() );

    if(diffTime > twelveDay) {
        return true;
    } else {
        return false;
    }
}

Utils.prototype.validateHttpLink = (link) => {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(link)) { 
        return false;
    }
    return true
  }

Utils.prototype.RandomString = function(length) {
    return Crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

Utils.prototype.GetValidSubDomain = function(subDomain) {
    return subDomain.replace(/[^a-z0-9-_]/g, '');
}

Utils.prototype.samlStrategy = function() {
    db.fetchTenant(function(err, data) {
        //console.log("yes", data);
        if (err) {
            console.log("err: " + err);
            return;
        }
        for (var i = 0; i < data.length; i++) {
        
            let certFile = 'No File'
            if(fs.existsSync(__dirname + '/cert/' + data[i].s_tenant_name + '.pem')) {
                certFile = fs.readFileSync(__dirname + '/cert/' + data[i].s_tenant_name + '.pem', 'utf8');
            }

            var samlStrategy = new saml.Strategy({
                callbackUrl: data[i].s_callback_url || '',
                entryPoint: data[i].s_entry_point || '',
                issuer: data[i].s_callback_url || 'passport-saml',
                identifierFormat: null,
                decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
                privateCert: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
                cert: certFile,
                validateInResponseTo: false,
                disableRequestedAuthnContext: true
            }, function(profile, done) {
                return done(null, profile);
            });
            passport.use(data[i].s_tenant_name, samlStrategy);
        }  

    })
}

Utils.prototype.getUserRole = (role) => {
    if(userRolesMapping.indexOf(role) != -1) {
        return userRolesMapping.indexOf(role) + 1;
    } else {
        return 1;
    }
}

Utils.prototype.getUserRoleName = (roleID) => {
    return roleID <= userRolesMapping.length ? userRolesMapping[roleID -1] : 'IC'
}

Utils.prototype.getCourseAccessID = function(roleID) {
    const userRoles = ["MANAGER", "IT_ADMIN_MANAGER", "ADMIN_MANAGER", "IC", "IT_ADMIN_IC", "ADMIN_IC"]
    const UserRolesTypeMap = ['1', '1', '1', '2', '1', '2']
    return UserRolesTypeMap[roleID - 1]
}

Utils.prototype.getDraftExperiencesAccessID = function(roleID) {
    const userRoles = ["MANAGER", "IT_ADMIN_MANAGER", "ADMIN_MANAGER", "IC", "IT_ADMIN_IC", "ADMIN_IC"]
    const UserRolesTypeMap = ['2', '1', '1', '2', '1', '1']
    return UserRolesTypeMap[roleID - 1]
}

Utils.prototype.generateJwt = function(id, email, fname, role, tenant) {
    if(!!tenant === false) {
        return jwt.sign({
            _id: id,
            email: email,
            name: fname,
            role: role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) *24
        }, Config.JWT_SECRET);
    } else {
        return jwt.sign({
            _id: id,
            email: email,
            name: fname,
            role: role,
            tenant: tenant,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) *24
        }, Config.JWT_SECRET);
    }
}

Utils.prototype.getQueryParams = ( params, url ) => {
  
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };

Utils.prototype.checkDuplicateStep = function(steps) {

    let TaskToCompleteVideo = [];
    let TaskToCompleteRecordedVideo = [];

    for(let i=0; i< steps.length; i++) {
        if(steps[i].step_type === 'TaskToComplete_RecordedVideo') {
            TaskToCompleteRecordedVideo.push(steps[i].step_type)
        } 

        if(steps[i].step_type === 'TaskToComplete_Video') {
            TaskToCompleteVideo.push(steps[i].step_type)
        }
    }

    if(TaskToCompleteVideo.length > 1 || TaskToCompleteRecordedVideo.length > 1) {
        return true;
    } else {
        return false;
    }
}  

Utils.prototype.msStreamRegx = function(eurl) {

    const msStreamRegxString = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-z0-9]+\.microsoftstream.com\/video+\/[a-zA-Z0-9]/;   

    if(msStreamRegxString.test(eurl)) {
        return true;
    } else {
        return false;
    }
}

Utils.prototype.mapArray = function(array, sendCorrectOption) {
    if(array[0].question_type === 'RATING' || array[0].question_type === 'WELCOME_TEXT') {
        return [];
    } else {
        // return from _.map
        if(sendCorrectOption) {
            return _.map(array, object =>
            _.omit(object, ['question_type', 'id', 'ques', 'answers', 'welcome_text', 'question_order']) // return from _.omit
            );
        } else {
            return _.map(array, object =>
            _.omit(object, ['question_type', 'id', 'ques', 'is_correct', 'welcome_text', 'question_order']) // return from _.omit
            );
        }
    }
}

Utils.prototype.GetQuizAnswers = function(userId, assign_c_id, assign_c_step_id, showOptions, cb) {

    db.GetStepQuizAnswers(userId, assign_c_id, assign_c_step_id, function(err, answers) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
       
        let answersWithOptions = _.chain(answers)
        // Group the elements of Array based on `color` property
        .groupBy("id")
        // `key` is group's name (color), `value` is the array of objects
        .map((value, key) => ({ 
        k_id: key, 
        question_type:value[0].question_type,
        answer: value[0].answers,
        ques: value[0].ques,
        ques_order: value[0].question_order,
        welcome_text : answers[0].welcome_text,
        options: showOptions ? mapArray(value, true) : []
        }))
        .orderBy(val => Number(val.ques_order))
        .value() 
        // console.log("answersWithOptions", answersWithOptions)
        cb(null, answersWithOptions);
    });
}

function mapArray(array, sendCorrectOption) {
    if(array[0].question_type === 'RATING' || array[0].question_type === 'WELCOME_TEXT') {
        return [];
    } else {
        // return from _.map
        if(sendCorrectOption) {
            return _.map(array, object =>
            _.omit(object, ['question_type', 'id', 'ques', 'answers', 'welcome_text', 'question_order']) // return from _.omit
            );
        } else {
            return _.map(array, object =>
            _.omit(object, ['question_type', 'id', 'ques', 'is_correct', 'welcome_text', 'question_order']) // return from _.omit
            );
        }
    }
}

Utils.prototype.quizResult = function(userId, quizStatus, step_id, course_id, cb) {  

    if(quizStatus === 'Completed') {
        db.CalculatePercentage(userId, step_id, course_id, function(err, data) {
            if (err) {
                console.log("err: " + err);
                cb(err);
            }
            cb(null, data.percentage);
        })
    } else {
        cb(null, 0);
    }
}

Utils.prototype.sortingAnswerString = function(answer) {  
    return answer.trim().split(',').sort().join(',');
}

Utils.prototype.GetSearchInterval = function(interval) {
    const intervals = ['last month', 'last week', 'last 6 months'];

    let index = intervals.indexOf(interval);

    if(index != -1) {
        if(intervals[index] === 'last month') {
            return '1 months'
        } else if(intervals[index] === 'last week') {
            return '1 week'
        } else if(intervals[index] === 'last 6 months') {
            return '6 months'
        }
    } else {
        return 'all';
    }
}

Utils.prototype.GetSearchCourseType = function(c_type) {
    const types = ['LEARNING_PATH', 'SALES_ENGINEERING_TRAINING', 'SALES_REP_TRAINING'];

    if(types.indexOf(c_type) != -1) {
        return c_type
    } else {
        return 'all';
    }
}

Utils.prototype.getRandomColor = function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getQueryParam( params, url ) {
  
    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
};

Utils.prototype.iframeyStepLinks = function(eurl) {
    return new Promise((resolve, reject) => {
        let corsurl = "https://cors-anywhere.herokuapp.com/"
        // Hard-code few links
        // 1. google drive file link
        if(eurl.indexOf('https://drive.google.com/open?id=') != -1) {
          let fileId = getQueryParam('id', eurl) || ''
          let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
          resolve(driveEmbedUrl);
    
        } else if(eurl.indexOf('https://drive.google.com/file/d/') != -1) {
          let fileId = eurl.substr(eurl.indexOf('file/d/')+7).split("/")[0] || ''
          let driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview`
          resolve(driveEmbedUrl);
        }
    
        // 2. microsoft stream links
        // example https://web.microsoftstream.com/video/f36603ec-7acc-4b95-94a6-8acd8d4890db
        if(msStreamRegx.test(eurl)) {
          let encodedUrl = encodeURIComponent(eurl)
          let embedUrl = `https://web.microsoftstream.com/oembed?url=${encodedUrl}`
          fetch(embedUrl, {method: 'get'})
          .then(response=> response.json())
          .then(res => {
            console.log("embedUrl", res)
            if(!!res.embed_url === true) resolve(res.embed_url)
            else resolve(false)
          })
          .catch(e => {
            resolve(false)
          })
        }
        // 3. microsoft office apps links
        // example https://myteamzskill-my.sharepoint.com/:w:/g/personal/sumit_myteamzskill_onmicrosoft_com/Eawq1k99yptPrBwuEd864pYB_IJcSNLzQv_24fBvJG_vnw?e=b2cabX
        if(eurl.indexOf('&action=embedview&wdbipreview=true') > 0) resolve(eurl);
    
        if(msOfficeRegx.test(eurl)) {
            let embededUrl = eurl
            let embedUrl = `${eurl}&action=embedview&wdbipreview=true`
        
            let option = {
                method : 'header',
                uri: embedUrl
            }
            return request(option,  (error, response, body) => {
                if(error) {
                    embededUrl = false
                    resolve(embededUrl)
                }
                console.log("requessttt", response.headers['x-frame-options'])
                let xframeAccess = response.headers['x-frame-options']
                let xframeAccessNew = xframeAccess === null ? xframeAccess : xframeAccess.toLowerCase()
                switch(xframeAccessNew) {
                    case "allow":
                        embededUrl = embedUrl
                        break;
                    case "deny":
                    case "sameorigin":
                        embededUrl = false
                        break;
                    default:
                    if(youtubeRegx.test(embedUrl))
                        embededUrl = false
                    else
                        embededUrl = embedUrl
                }
                resolve(embededUrl)
            })
        }
    
        // check 'x-frame-options'
        let embededUrl = eurl
        // fetch(eurl, {method: 'HEAD', mode: 'cors'})
        // .then(res => {
        //     console.log("res2", res.headers.get('x-frame-options'))
        //     let xframeAccess = res.headers.get('x-frame-options')
        //     let xframeAccessNew = xframeAccess === null ? xframeAccess : xframeAccess.toLowerCase()
        let option = {
            method : 'header',
            uri: eurl
        }
        return request(option,  (error, response, body) => {
            if(error) {
                embededUrl = false
                return resolve(embededUrl)
            }
            console.log("requessttt", response.headers['x-frame-options'], embededUrl)
            let xframeAccess = response.headers['x-frame-options']
            let xframeAccessNew = xframeAccess === null || xframeAccess === undefined ? xframeAccess : xframeAccess.toLowerCase()
            if(xframeAccessNew === 'allow') {
                embededUrl = eurl
            } else {
                embededUrl = false
            }
            // switch(xframeAccessNew) {
            //     case "allow":
            //     embededUrl = eurl
            //     break;
            //     case "deny":
            //     case "sameorigin":
            //     embededUrl = false
            //     break;
            //     default:
            //     if(youtubeRegx.test(eurl))
            //         embededUrl = false
            //     else
            //         embededUrl = eurl
            // }
            resolve(embededUrl)
        })
    })
}

Utils.prototype.getReqType = function(issuer) {
    if(!!issuer === true) {
        if(issuer.substr(0,23) === "https://sts.windows.net") {
            return 'AZURE'
        } else {
            return 'OKTA'
        }
    } else {
        return 'issuer not found'
    }
}

Utils.prototype.assignDefaultCourse = function(assignUserEmail, tenant, cb) {
    let email = [];
    email.push(assignUserEmail);
    if(typeof assignUserEmail === 'string') {
        email.push(assignUserEmail);
    } else {
        email = assignUserEmail
    }
    db.GetDefaultCourse(function(err, data) {
        let courseData = {
            c_id : data[0].k_id,
            emails: email,
            default_course: true
        }
        let payload = {
            tenant : tenant === 'app'? 'public': tenant
        }
        CoursesCtrl.InsertAssignCourses(data[0].k_user_id, courseData, payload, function(err, data){
            if (err) {
                console.log("insert courses 500 error: ");
                cb({success:false, message:err});
                return;
            }

            cb(null, {success:true, result:data});
        });
    })
}

Utils.prototype.getHeaderColor = function(bgImg) {
    let index = libraryImgBgColors.findIndex(function(item, i){
        return item.image === bgImg
    });

    return libraryImgBgColors[index].color;

}
  
module.exports = new Utils();