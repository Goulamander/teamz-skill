import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Row, Col, Input, Form, Button, Label, FormGroup } from 'reactstrap';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { get_microsite_by_link, save_upload_video_data, upload_microsite_recorded_video } from '../../../../actions/microsites'
import { getTenantSite, getToken } from '../../../../transforms'
import { appConstant, micrositeConst, MicrositeStyle } from '../../../../constants/appConstants'
import RecordVideoContent from './components/RecordVideoContent';
import VideoContentView from './components/VideoContentView';
import { Loader } from '../../../../component/Loader';

const MicrositeVideoContent = (props) => {
    let { getMSDataByLink, isRecordedVideoUploading } = props;
    console.log(props);

    const [ videoContentLink, setVideoContentLink ] = useState('');
    const [ isVideoLoading, setVideoLoading ] = useState(false);
    const [ isUploadError, setIsUploadError ] = useState(false);
    const [ uploadErrorMsg, setUploadErrorMsg ] = useState('');
    const [ isRecorded, setIsRecorded ] = useState(false);  

    useEffect(() => {
        setVideoContentLink(getMSDataByLink.video_link);
        setIsRecorded(!!getMSDataByLink.video_link);
    }, [getMSDataByLink])

    const fileInput = useRef(null);

    const handleFileUpload = event => {
        let fileName = event.target.files[0].name.replace(/ /g,"_");
        let fileType = event.target.files[0].type;
        let fileSize= event.target.files[0].size;
        if(fileSize > 200000000) {
            alert("file size can't be more than 200 MB")
            return false;
        }
        let token = getToken();
        let file = event.target.files[0];

        const options = {
            headers: {
                "content-type": "application/json",
                "JWTAuthorization": "Bearer "+ token
            },
        };
        axios.post(`${appConstant.BASE_URL}/api/v1/get-signed-url`, {
            fileName: fileName,
            fileType: fileType
        }, options).then((response) => {
            let { data } = response;
            if(data.status) {
                let url = data.result.signedUrl;
                console.log(url);
                setVideoLoading(true);
                axios({
                    method: "put",
                    url,
                    data: file,
                    maxContentLength: 200000000,
                    maxBodyLength: 200000000,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': '*'
                    }
                }).then((result) => {
                    let payload = {
                        "video_url": data.result.fileName,
                        "microsite_id": getMSDataByLink.microsite_id
                    }
                    props._save_upload_video_data(payload, (err, success) => {
                        if(err) {
                            console.log('err', err.message);
                            setVideoLoading(false);
                            setIsUploadError(true);
                            setUploadErrorMsg('Something wrong in file upload')
                        }
                        props._get_microsite_by_link(getMSDataByLink.link);
                        setVideoLoading(false);
                    })
                }).catch((err) => {
                    console.log('err', err.message);
                    setVideoLoading(false);
                    setIsUploadError(true);
                    setUploadErrorMsg('Something wrong in file upload')
                });
            }
        }, (error) => {
            console.log(error);
        });
    };

    const submitVideo = (blob) => {
        var fd = new FormData();
        fd.append('videofile', blob);
        fd.append('microsite_id', getMSDataByLink.microsite_id)
        console.log("submitting");
        props._upload_microsite_recorded_video(fd, (res) => {
          if(res.success) {
            props._get_microsite_by_link(getMSDataByLink.link);
          } else {
            if(!!res.message && typeof res.message === "string" ) {
              alert(res.message)
            } else {
              alert("Error saving video! Please try again")
            }
          }
        })
    }

    return (
        <div className="mb-5">
            { 
                videoContentLink != '' ? 
                <>
                    <VideoContentView {...props} />
                </> :
                <>
                    <Row className="justify-content-md-center mt-4">
                        <Col lg={9}>
                            <RecordVideoContent initialStep={'1'} isUploading={isRecordedVideoUploading} videoLimit={120000} submitVideo={submitVideo} disabled={isRecorded} isRecorded={isRecorded} recordedLink={videoContentLink} />
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col lg={9}>
                            <div className="mt-4 d-flex align-items-center justify-content-center line-divider">
                                <div className="line flex-fill"></div>
                                <div className="px-2 or-text">OR</div>
                                <div className="line flex-fill"></div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center mt-3">
                        <Col lg={9}>
                            <input
                            ref={fileInput}
                            onChange={handleFileUpload}
                            type="file"
                            accept=".mp4,.mov,.mpg"
                            style={{ display: "none" }}
                            />
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <Button className="addMembers" onClick={() => fileInput.current.click()}>Upload Video</Button>
                                <div className="max-size-text mt-3">Max size 200MB (mp4, mov, mpg)</div>
                            </div>    
                        </Col>
                    </Row>
                </>
            }
            {isVideoLoading &&
                <Loader isLoading={isVideoLoading} />
            }
            { isUploadError &&
            <SweetAlert
                danger
                title="Error!"
                onConfirm={() => {
                    setUploadErrorMsg('');
                    setIsUploadError(false);
                }}
                >
                {uploadErrorMsg}
                </SweetAlert>
            }           
        </div>
    )
}

const mapStateToProps = ({ microSites, contentPortal, profileSettings }) => ({
    ...microSites,
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
    {
        _get_microsite_by_link            :       get_microsite_by_link,
        _save_upload_video_data           :       save_upload_video_data,
        _upload_microsite_recorded_video  :       upload_microsite_recorded_video
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MicrositeVideoContent)