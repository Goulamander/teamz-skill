'use strict';

const Express = require('express');
const Router = Express.Router();
const UploadCtrl = require('../controllers/upload_ctrl');
const AcceessControl = require('../middlewares/AccessControl');
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');
const config = require('../config');
//const ffmpeg = require('fluent-ffmpeg');

var s3bucket = new aws.S3({"accessKeyId": config.SES_ACCESS_KEY_Id, "secretAccessKey":config.SES_SECRET_ACCESS_KEY, "region":config.SES_REGION, signatureVersion: 'v4'});

Router.post('/upload', AcceessControl, UploadCtrl.UploadCsvFile);

Router.get('/get-file/:filename', AcceessControl, UploadCtrl.GetCsvFile);

Router.post('/upload-video', AcceessControl, UploadCtrl.UploadVideo);

Router.post('/upload-microsite-recorded-video', AcceessControl, UploadCtrl.UploadMicrositeUploadedVideo);

Router.post('/get-signed-url', function(req, res) {
    if(!!req.body.fileName === false || !!req.body.fileType === false) {
        return res.status(403).json({status:false , message: "request payloads are missing"});
    }

    let fileName = req.body.fileName.replace(/ /g,"_");
    fileName = Date.now() + '-' + fileName;
    let fileType = req.body.fileType;

    var params = {
        Bucket: 'microsite-content-videos',
        Key: fileName,
        Expires: 600,
        ACL: 'public-read',
        ContentType: fileType
    };
    
    s3bucket.getSignedUrl('putObject', params, function (err, url) {
        if(err) {
            console.log("err", err.message);
            return res.status(200).json({status:false , message: err});
        }
        // console.log('The URL is', url);
        let s3FileName = `https://microsite-content-videos.s3-us-west-2.amazonaws.com/${fileName}`;

        return res.status(200).json({status:true , result: { signedUrl: url, fileName: s3FileName }});
        // axios({
        //     method: "put",
        //     url,
        //     data: fs.readFileSync(filePath),
        //     maxContentLength: 524288000,
        //     maxBodyLength: 524288000,
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Methods': '*'
        //     }
        // }).then((result) => {
        //     console.log('result', result);

        // }).catch((err) => {
        //     console.log('err', err.message);

        // });
    })
});

Router.get('/check-gif', function(req, res, next) {
    var input = path.join(__dirname, 'test.mp4');
    var output = path.join(__dirname, 'error.gif');
    var wmimage=path.join(__dirname,'image.png');
    ffmpeg(input)
    .withFps(1/4,1/8,1/12,1/16)
    .addOption('-vf','movie='+wmimage+'[watermark]; [input] [watermark] overlay=200:675 [output]')
    .on('end', function(){
        var input2 = path.join(__dirname, 'error.gif');
        var output2 = path.join(__dirname, 'out.gif');
        var title2 = "Video Title";
        ffmpeg(input2)
        .withFps(1/4,1/8,1/12,1/16)
        .addOption('-vf','drawtext=fontfile=/Windows/Fonts/arial.ttf:text='+title2+':fontsize=50:fontcolor=white: x=500:y=760')
        .on('end', function(){
            fs.unlink(output, function(err){
                console.log(err)
            });
        })
        .save(output2);
    })
    .save(output).duration(10);
});

module.exports = Router;