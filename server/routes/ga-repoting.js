const Express = require('express');
const Router = Express.Router();
const {google} = require('googleapis');
const ga = require('google-analyticsreporting');
const _ = require('lodash');
const CronJob = require('cron').CronJob;

const config = require('../config');
const db = require('../db');
const key = require('./silken-agent-294320-c432600b2dac.json');

const viewId= "ga:234200467";

let jwtClient = new google.auth.JWT(
    key.client_email, null, key.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly'], null);
    jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err.message);
      return;
    }
});

Router.get('/update-alredy-shares', function(req, res, next) {
  db.GetMicrositeShares(function(err, data) {
    if(err) {
      res.status(500).json({success: false, message: err.message});
    }
    
    let shareUpdate = [];
    for(let i=0; i<data.length; i++) {
      shareUpdate.push(updateSharesFunction(parseInt(data[i].shared_id), data[i].microsite_id))
    }
    Promise.all(shareUpdate).then(data => {
      return res.status(200).json({success: true, result:data});
    }).catch(err => {
      return res.status(500).json({success: false, message:err});
    })
  })
});

function updateSharesFunction(shareId, micrositeId) {
  return new Promise((resolve, reject) => {
    db.GetMicrositeContentsCardIds(micrositeId, function(err, data) {
      let insertShareEvents = [];
      for(let i=0; i<data.doc_id.length; i++) {
        insertShareEvents.push(insertShareEventsPromise(shareId, micrositeId, data.doc_id[i], data.doc_ser_id[i]))
      }

      Promise.all(insertShareEvents).then(data => {
        resolve("done")
      }).catch(err => {
        reject(err.message);
      })
    })
  })
}

function insertShareEventsPromise(shareId, micrositeId, doc_id, doc_ser_id) {
  return new Promise((resolve, reject) => {
    db.InsertMicrositeShareContent(shareId, micrositeId, doc_id, doc_ser_id, function(err, data) {
      
      if(err) {
        reject(err)
      }
      resolve("inserted");
    })
  })
}

// Router.get('/', function(req, res, next) {
//   const reportRequests = {
//     reportRequests:
//       [
//         {
//             viewId: viewId,
//             dateRanges:
//             [
//               {
//                 endDate: 'today',
//                 startDate: '30daysAgo',
//               },
//             ],
//             metrics:
//             [
//               {
//                 expression: 'ga:uniquePageviews',
//               },
//               {
//                 expression: 'ga:avgTimeOnPage'
//               },
//               {
//                 expression: 'ga:totalEvents',
//               }
//             ],
//             dimensions:
//             [
//               {
//                 name: 'ga:pagePath',
//               },
//               {
//                 name: "ga:hostname"
//               }
//             ],
//             filtersExpression: "ga:pagepath=@?s_id=21",
//             // filtersExpression: "ga:pagetitle!=TeamzSkill",
//             dimensionFilterClauses: [
//               {
//                 "filters": [
//                   {
//                     "dimensionName": "ga:hostname",
//                     "operator": "EXACT",
//                     "expressions": ["app.dev.teamzskill.com"]
//                   }
//                 ]
//               }
//             ]
//         },
//     ],
//   };
    
//   ga.auth(key)
//     .then(
//         ga.query(reportRequests)
//         .then((data) => {
//             let analyticData= [];
//             let responseData= data.data.reports[0].data.rows;
//             if(responseData) {
//               for(let i=0; i<responseData.length; i++) {
//                 analyticData.push({
//                   pagePath: responseData[i].dimensions[0],
//                   pageViews: responseData[i].metrics[0].values[0],
//                   pageUniqueView: responseData[i].metrics[0].values[1],
//                   pageEvents: responseData[i].metrics[0].values[2]
//                 })
//               }
//             }
//             // res.status(200).json({ data: data.data});
//             // return false;
//             eventsData("app.dev.teamzskill.com", (err, eventsData) => {
//               if(err) {
//                 return res.status(500).json({success: true, result: err});
//               }
//               let groupGAData = analyticData.map((item, i) => Object.assign({}, item, eventsData[i]));
//               res.status(200).json({status: false, result: groupGAData});
//               // let updateDataPromise = [];
//               // for(let i=0; i<groupGAData.length; i++) {
//               //   updateDataPromise.push(UpdateMyShareData(groupGAData[i]))
//               // }
//               // Promise.all(updateDataPromise).then(data => {
//               //   res.status(200).json({ success: true, result: groupGAData });
//               // }).catch(reject => {
//               //   return res.status(500).json({success: true, result: reject});
//               // })
//             })
//         }).catch(err => {
//           console.log(err.message);
//         })
//     );
// });

function eventsData(hostName, cb) {
  const reportEventsRequests = {
    reportRequests:
      [
        {
          viewId: viewId,
          dateRanges:
          [
            {
              endDate: 'today',
              startDate: '30daysAgo',
            },
          ],
          metrics:
          [
            {
              expression: 'ga:totalEvents',
            }
          ],
          dimensions:
          [
            {
              name: 'ga:pagePath',
            },
            {
              name: 'ga:eventLabel',
            },
            {
              name: 'ga:eventAction',
            }
          ],
          filtersExpression: "ga:pagepath=@?s_id=",
          dimensionFilterClauses: [
            {
              "filters": [
                {
                  "dimensionName": "ga:hostname",
                  "operator": "EXACT",
                  "expressions": [hostName]
                }
              ]
            }
          ]
      },
    ],
  };
  
  ga.auth(key)
    .then(
      ga.query(reportEventsRequests)
      .then((data) => {
        let analyticData= [];
        let responseData= data.data.reports[0].data.rows;
        if(responseData) {
          for(let i=0; i<responseData.length; i++) {
            analyticData.push({
              pagePath: responseData[i].dimensions[0],
              eventlabel: responseData[i].dimensions[1],
              eventAction: responseData[i].dimensions[2],
              eventvalue: responseData[i].metrics[0].values[0]
            })
          }
        }
        
        let groupData = _.chain(analyticData).groupBy("pagePath").map((value, key) => ({
          pagePath: value[0].pagePath,
          events: _.map(value, object =>
            _.omit(object, ['pagePath'])
          )
        })).value()
        cb(null, groupData);
      }).catch(err => {
        console.log(err.message);
        cb(err.message)
      })
  );
}

function insertEvents(docId, shareId, eData) {
  // console.log("eData", eData);
  return new Promise(function(resolve, reject) {
    db.UpdateMyShareEventsGaData(docId, parseInt(shareId[1]), eData, function(err, success) {
      if(err) {
        return reject(err.message);
      }
      resolve("event inserted")
    })
  })
}

function UpdateMyShareData(tenantName, gaData) {
  let tenant = tenantName === 'app' ? 'public' : tenantName;
  // console.log("update tenant", tenant);
  return new Promise(function(resolve, reject) {
    db.SetSchema(tenant, function(err, val) { 
      let shareId = gaData.pagePath.split('?s_id=');
      // console.log("shareId", shareId[1]);  
      // console.log("gaData", gaData);
      let eventsvalue = 0;
      if(gaData.events) {
        // console.log("gaData.events", gaData.events)
        let events = gaData.events;
        for(let i=0; i<events.length; i++) {
          if(events[i].eventAction !== 'Click Link') {
            eventsvalue += parseInt(events[i].eventvalue);
          }
        }
      } 
      db.UpdateMyShareGaData(parseInt(shareId[1]), gaData, eventsvalue, function(err, success) {
        if(err) {
          return reject(err.message);
        }
        if(gaData.events) {
          // console.log("gaData.events", gaData.events)
          let events = gaData.events;
          let docId = '';
          let promiseEventinsert = [];
          for(let i=0; i<events.length; i++) {
            if(events[i].eventAction !== 'Click Link') {
              docId = events[i].eventAction.split("/")[5];
              promiseEventinsert.push(insertEvents(docId, shareId, events[i]));
            }
          }
          Promise.all(promiseEventinsert).then(success => {
            resolve("events also inserted");
          }).catch(err => {
            reject(err);
          })
        } else {
          resolve("events also inserted");
        }
      })
    });
  })
}

function getGaData(tenant) {
  return new Promise((resolve, reject) => {
    let tenantName = tenant === 'public' ? 'app' : tenant;
    let hostName = tenantName + '.' + (process.env.HOST_NAME || 'vcap.me');
    
    const reportRequests = {
      reportRequests:
        [
          {
              viewId: viewId,
              dateRanges:
              [
                {
                  endDate: 'today',
                  startDate: '30daysAgo',
                },
              ],
              metrics:
              [
                {
                  expression: 'ga:uniquePageviews',
                },
                {
                  expression: 'ga:totalEvents',
                },
                {
                  expression: 'ga:avgTimeOnPage'
                },
              ],
              dimensions:
              [
                {
                  name: 'ga:pagePath',
                },
                {
                  name: "ga:hostname"
                }
              ],
              filtersExpression: "ga:pagepath=@?s_id=",
              dimensionFilterClauses: [
                {
                  "filters": [
                    {
                      "dimensionName": "ga:hostname",
                      "operator": "EXACT",
                      "expressions": [hostName]
                    }
                  ]
                }
              ]
          },
      ],
    };
      
    ga.auth(key)
      .then(
          ga.query(reportRequests)
          .then((data) => {
              let analyticData= [];
              let responseData= data.data.reports[0].data.rows;
              if(responseData) {
                for(let i=0; i<responseData.length; i++) {
                  // console.log("d", responseData[i].dimensions);
                  // console.log("m", responseData[i].metrics);
                  analyticData.push({
                    pagePath: responseData[i].dimensions[0],
                    pageViews: responseData[i].metrics[0].values[0],
                    pageEvents: responseData[i].metrics[0].values[1],
                    avgTime: responseData[i].metrics[0].values[2]
                  })
                }
              }
              // console.log("analyticData", analyticData);
              if(analyticData.length) {
                eventsData(hostName,(err, eventsData) => {
                  if(err) {
                    console.log("err", err);
                    return false;
                    // return res.status(500).json({success: true, result: err});
                  }
                  let merged = _.merge(_.keyBy(analyticData, 'pagePath'), _.keyBy(eventsData, 'pagePath'));
                  let groupGAData = _.values(merged);
                  // console.log("groupGAData", groupGAData);
                  let updateDataPromise = [];
                  for(let i=0; i<groupGAData.length; i++) {
                    updateDataPromise.push(UpdateMyShareData(tenantName, groupGAData[i]))
                  }
                  Promise.all(updateDataPromise).then(data => {
                    resolve("data updated");
                  }).catch(reject => {
                    reject(reject);
                  })
                });
              } else {
                resolve("data not found");
              }
          }).catch(err => {
            console.log(err.message);
          })
      );
  })
}

console.log('Before job instantiation');
const job = new CronJob('0 * * * *', function() {
  db.GetAllTenantSchemas(function(err, schemas) {
    if(err) {
      console.log(err.message);
      return false;
    }
    let fetchGaData = [];
    for(let i=0; i<schemas.length; i++) {
      fetchGaData.push(getGaData(schemas[i].schema_name));
    }
    Promise.all(fetchGaData).then(data => {
      console.log("job completed");
    }).catch(err => {
      console.log("error in job completion");
    })
  })
});
console.log('After job instantiation');
job.start();

module.exports = Router;