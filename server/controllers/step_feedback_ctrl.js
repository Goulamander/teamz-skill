const db = require('../db');

function StepFeedBackCtrl() {

}

StepFeedBackCtrl.prototype.GetStepFeedBackRequests = function(userId, cb) {
    db.GetStepFeedBackRequests(userId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

StepFeedBackCtrl.prototype.InsertStepFeedback = function(userId, feedbackDetail, cb) {
    
    let overAllRating = (feedbackDetail.acpp + feedbackDetail.cvp + feedbackDetail.hd + feedbackDetail.spp + feedbackDetail.cs + feedbackDetail.ccca + feedbackDetail.bca + feedbackDetail.ae + feedbackDetail.storytelling + feedbackDetail.cp + feedbackDetail.cqh + feedbackDetail.caat)/30*100;

    console.log("overall", overAllRating.toFixed(2));

    db.InsertStepFeedBack(userId, feedbackDetail.what_went, feedbackDetail.what_improve, feedbackDetail.acpp, feedbackDetail.cvp, feedbackDetail.hd, feedbackDetail.spp, feedbackDetail.cs, feedbackDetail.ccca, feedbackDetail.bca, feedbackDetail.ae, feedbackDetail.storytelling, feedbackDetail.cp, feedbackDetail.cqh, feedbackDetail.caat, parseInt(feedbackDetail.course_id), feedbackDetail.assign_to, overAllRating.toFixed(2), function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

StepFeedBackCtrl.prototype.GetStepFeedBackForMe = function(userId, cb) {
    db.GetStepFeedBackForMe(userId, function(err, data) {
        if (err) {
            console.log("err: " + err);
            return cb({message:"Something went wrong"})
        }
        
        cb(null, data);
    });
}

module.exports = new StepFeedBackCtrl();