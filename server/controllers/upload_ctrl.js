const multer = require('multer');
const fs = require('fs');
const hbjs = require('handbrake-js');

const db = require('../db');
const aws = require('aws-sdk');
const config = require('../config');

var s3bucket = new aws.S3({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY, "region":config.SES_REGION});

function UploadCtrl() {

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file);
        cb(null, 'dist/upload/csv');
  },
  filename: function (req, file, cb) {
    let fname = file.originalname.replace(/\s/g, '')
    cb(null, Date.now() + '-' +fname)
  }
});

var videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file);
        cb(null, 'dist/upload/user/videos');
  },
  filename: function (req, file, cb) {
    let fname = file.originalname.replace(/\s/g, '')
    cb(null, Date.now() + '-' +fname)
  }
});

var upload;


UploadCtrl.prototype.UploadCsvFile = function(req, res) {
    upload = multer({ storage: storage, limits: { fileSize: 5242880 } }).single('file');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({success:false, message:err})
        } else if (err) {
            return res.status(500).json({success:false, message:err})
        }
        return res.status(200).send({success:true, result:req.file})

    })
}

UploadCtrl.prototype.GetCsvFile = function(req, response) {
//    res.download(req.body.filename, 'const.csv', function(err) {
//        if(err) {
//            res.status(500).send(err);
//        }
//    });
    fs.readFile('dist/upload/csv/'+ req.params.filename, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            console.log('received data: ' + data);
            response.writeHead(200, {'Content-Type': 'text/csv'});
            response.write(data);
            response.end();
        } else {
            return res.status(500).json({success:false, message:err})
        }
    });
} 

UploadCtrl.prototype.UploadVideo = function(req, res) {

    upload = multer({ storage: videoStorage }).single('videofile');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("err1", err);
            return res.status(500).json({success:false, ...err})
        } else if (err) {
            console.log("err2 ", err);
            return res.status(500).json({success:false, ...err})
        }
     
        db.CheckVideoExist(req.payload._id, req.body.course_id, req.body.step_id, function(err, found, data) {
            if(err) {
                return res.status(500).json({success:false, message:"Internal Server error"})
            } 
            console.log(req.file);
            var file = req.file;
            if(found) {
                fs.unlink(file.path, function (err) {
                    if (err) {
                        console.error("Failed to delete temp file", err);
                    }
                    console.log('Temp File Delete');
                    return res.status(500).json({success:false, message:"Video already created."})
                });
            } else {
                fs.readFile(file.path, function (err, data) {
                    if (err) {
                        return res.status(500).json({success:false, ...err})
                    }; // Something went wrong!
                    var params = {
                        Bucket: 'customstepvideo',
                        Key: file.filename, //file.name doesn't exist as a property
                        ContentType: file.mimetype,
                        ACL: 'public-read',
                        Body: data
                    };
                    s3bucket.upload(params, function (err, data) {
                        // Whether there is an error or not, delete the temp file
                        fs.unlink(file.path, function (err) {
                            if (err) {
                                console.error("Failed to delete temp file", err);
                            }
                            console.log('Temp File Delete');
                        });

                        if (err) {
                            console.log('ERROR MSG: ', err);
                            return res.status(500).json({success:false, ...err})
                        } else {
                            //console.log('Successfully uploaded data', data);
                            let courseId = req.body.course_id;
                            let stepId = req.body.step_id;

                            db.GetAssignCourseByCourseId(req.payload._id, courseId, function(err, assign) {
                                if(err) {
                                    if (err) {
                                        console.log("insert step pitch 500 error: ", err);
                                        res.status(500).json({success:false, ...err});
                                        return;
                                    }
                                }
                                db.InsertStepPitch(req.payload._id, courseId, stepId, data.Location, '', assign[0].assign_by_id, '', function(err, insertedData){
                                    if (err) {
                                        console.log("insert step pitch 500 error: ", err);
                                        res.status(500).json({success:false, ...err});
                                        return;
                                    }
                            
                                    return res.status(200).send({success:true, result:data.Location})
                                });
                            })
                        }
                    });
                })
            }
        })
    });
}

UploadCtrl.prototype.UploadMicrositeUploadedVideo = function(req, res) {

    upload = multer({ storage: videoStorage }).single('videofile');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("err1", err);
            return res.status(500).json({success:false, ...err})
        } else if (err) {
            console.log("err2 ", err);
            return res.status(500).json({success:false, ...err})
        }

        let guid = req.payload._id;
        let micrositeId = req.body.microsite_id;
     
        db.CheckMicroSiteVideoData(micrositeId, function(err, found, micrositeData) {
            if(err) {
                return res.status(500).json({success:false, message:"Internal Server error"})
            } 
            // console.log(req.file);
            var file = req.file;
            if(found && micrositeData) {
                if(micrositeData.microsite_creator === guid && (micrositeData.video_link !== '' || micrositeData.video_link !== null)) {

                    let outputFile = `dist/upload/user/videos/${file.filename}.mp4`;

                    hbjs.spawn({ input: file.path, output: outputFile })
                    .on('error', err => {
                        console.log("err", err);
                        fs.unlink(file.path, function (err) {
                            if (err) {
                                console.error("Failed to delete temp file", err);
                            }
                            console.log('Temp File Delete');
                            return res.status(500).json({success:false, message:"error in video conversion"})
                        });
                    })
                    .on('end', end => {
                        fs.readFile(outputFile, function (err, data) {
                            if (err) {
                                fs.unlink(file.path, function (err) {
                                    if (err) {
                                        console.error("Failed to delete temp file", err);
                                    }
                                    console.log('Temp File Delete');
                                });
                                fs.unlink(outputFile, function (err) {
                                    if (err) {
                                        console.error("Failed to delete temp mp4 file", err);
                                    }
                                    console.log('Temp mp4 File Delete');
                                });
                                return res.status(500).json({success:false, ...err})
                            }; // Something went wrong!
                            var params = {
                                Bucket: 'microsite-content-videos',
                                Key: `${file.filename}.mp4`, //file.name doesn't exist as a property
                                ContentType: 'video/mp4',
                                ACL: 'public-read',
                                Body: data
                            };
                            // s3bucket.upload(params, function (err, data) {
                            //     // Whether there is an error or not, delete the temp file
                            //     fs.unlink(file.path, function (err) {
                            //         if (err) {
                            //             console.error("Failed to delete temp file", err);
                            //         }
                            //         console.log('Temp File Delete');
                            //     });

                            //     fs.unlink(outputFile, function (err) {
                            //         if (err) {
                            //             console.error("Failed to delete temp mp4 file", err);
                            //         }
                            //         console.log('Temp mp4 File Delete');
                            //     });
        
                            //     if (err) {
                            //         console.log('ERROR MSG: ', err);
                            //         return res.status(500).json({success:false, ...err})
                            //     } else {
                            //         //console.log('Successfully uploaded data', data);
                            //         let gifUrl = `${data.Location}.gif`;
                            //         db.SaveVideoContentData(guid, data.Location, parseInt(micrositeId), gifUrl, '', true, function(err, data) {
                            //             if(err) {
                            //                 res.status(500).json({success:false, message: err.message});
                            //                 return;
                            //             }
    
                            //             return res.status(200).send({success:true, result:data.Location})
                                
                            //         });
                            //     }
                            // });
                        })
                    });

                } else {
                    fs.unlink(file.path, function (err) {
                        if (err) {
                            console.error("Failed to delete temp file", err);
                        }
                        console.log('Temp File Delete');
                        return res.status(500).json({success:false, message:"Microsite video already created."})
                    });
                }
            } else {
                fs.unlink(file.path, function (err) {
                    if (err) {
                        console.error("Failed to delete temp file", err);
                    }
                    console.log('Temp File Delete');
                    return res.status(500).json({success:false, message:"Microsite not found"})
                });
            }
        })
    });
}

module.exports = new UploadCtrl();