import React, {useState, useEffect} from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'
import classnames from 'classnames'

import VideoRecord from '../../../component/videoRecord'

const RecordPitch = (props) => {
  const [activeTab, setActiveTab] = useState(props.initialStep);
  const [recordingObj, setRecordingObj] = useState(null);
  const [recordingURL, setRecordingURL] = useState(null);
  
  useEffect(() => {
    if(props.isRecorded && !!props.recordedLink === true) {
      setRecordingURL(props.recordedLink)
      setActiveTab('3')
    }
  })

  const showSubmitTab = () => {
    if(activeTab === '2') {
      setActiveTab('3')
    }
  }

  const showPrevTab = () => {
    if(activeTab === '3' && !!props.recordedLink === false) {
      setActiveTab('2')
    }
  }

  const saveRecording = obj => {
    try {
      let source = window.URL.createObjectURL(obj)
      setRecordingObj(obj)
      setRecordingURL(source)
      setActiveTab('2')
    } catch(e) {
      console.log("rec obj err: ", e)
    }
  }

  const discardAndRetake = () => {
    setRecordingObj(null)
    setRecordingURL(null)
    setActiveTab('1')
  }

  const submitVideo = () => {
    if(recordingObj) props.submitVideo(recordingObj)
    else setActiveTab('1')
  }

  return (
    <div className="card">
      <div className="recordPitch">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
            >
              Record
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={showPrevTab}
            >
              Preview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={showSubmitTab}
            >
              Submit
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="record-tabs">
          <TabPane tabId="1" className="recording-container h-100">
            <Row className="h-100">
              <Col sm="12" className="h-100">
                {props.disabled ?
                  (props.isRecorded && props.recordedLink) ?
                  <div className="blank-screen h-100">
                    <video id="video-chat" src={props.recordedLink} controls autoPlay={false} />
                  </div>
                  :
                  <div className="blank-screen h-100">
                    <div className="action"><p>Turn on Camera</p></div>
                  </div>
                :
                  <VideoRecord onRecordingComplete={saveRecording} vidoeLimit={props.videoLimit} />
                }
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2" className="preview-retake">
            <Row>
              <Col sm="12">
                <div className="d-flex justify-content-center text-center video-preview">
                  <video id="video-chat" src={recordingURL} controls autoPlay={false} />
                </div>
              </Col>
              <Col sm="12">
                <div className="text-center py-2 pb-3">
                  <span className="actionLink" onClick={discardAndRetake}>Discard and retake video</span>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3" className="preview-submit">
            <Row>
            <Col sm="12">
                <div className="d-flex justify-content-center text-center video-preview">
                  <video id="video-chat" src={recordingURL} controls autoPlay={false} />
                </div>
              </Col>
              <Col sm="12">
                <div className="text-center py-2 pb-3">
                  {props.isUploading? 
                    <span className="actionLink">...Uploading video</span>
                  :
                    !!props.recordedLink?
                      <span className="actionLink" ></span>
                      :
                      <span className="actionLink" onClick={submitVideo}>Submit video for review</span>
                    
                  }
                </div>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default RecordPitch