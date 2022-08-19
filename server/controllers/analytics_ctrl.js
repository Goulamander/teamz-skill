const db = require('../db');

function AnalyticsCtrl() {

}

AnalyticsCtrl.prototype.GetOpportunityAmount = (guid, close_won, cb) => {
  db.GetOpportunityAmount(guid, close_won, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

AnalyticsCtrl.prototype.GetQuotaAttainment = (guid, cb) => {
  db.GetQuotaAttainment(guid, (err, data) => {

    if (err) {
      console.log("err: " + err);
      return cb('Something went wrong');
    }
    
    cb(null, data);

  })    
}

module.exports = new  AnalyticsCtrl();