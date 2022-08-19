import React, { Component, Fragment, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Badge, Row, Col, Input, Label, Progress, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component'
import moment from 'moment'
import copy from 'copy-to-clipboard';

import { get_custom_course, get_oembed, get_custom_assign_course, custom_course_step_complete, custom_course_complete, upload_step_pitch, add_step_pitch, update_iframe_url } from '../../actions/customCourse'
import { custCourseStepTypeConstant, assignCourseState, QUIZ_STATUSES, shareLinkActionControls, QuizQuesTypesKey } from '../../constants/appConstants'
import { iframeyStepLinks, getTypeIcon, copySharableLink, createSlideIframeUrl } from '../../transforms'
import HalfStarRating from '../../component/TZS_Rating/HalfStarRating';
import SweetAlert from 'react-bootstrap-sweetalert';

import step from '../../assets/img/step.png'
import shrDwnOptIcon from '../../assets/img/option_icon.png'
import { ROUTES } from '../../constants/routeConstants'
import stepComplete from '../../assets/img/stepcomplete.png'
import RecordPitch from './courseSteps/RecordPitch';
import StepVideoLinkModal from './modal/StepVideoLinkModal';
import { Loader } from '../../component/Loader'
import QuizContainer from '../../component/common/QuizContainer'
import { BadgeEarnedModal } from '../../component/BadgeEarnedModal'

class CourseAssigned extends Component {

  count = 0;
  state = {
    courseId: this.props.match.params.id || '',
    isEmbedLoading: true,
    isEmbedExist: false,
    isRecorded: false,
    isVideoRecordView: false,
    isStepVideoLinkModalShow: false,
    recordedLink: null,
    embededHTML: false,
    selectedStep: 0,
    rating: 5,
    activeStep: {},
    openBadgeModal: false,
    successResponse: false
  }

  componentDidMount() {
    this.props._get_custom_assign_course(this.state.courseId)
  }

  componentDidUpdate(prevProps) {
    let { customCourseDetail, isCompRequest } = this.props.myCourses
    let { selectedStep } = this.state
    let customCourseDetailPrev = prevProps.myCourses.customCourseDetail
    if( customCourseDetail.c_id ){
      let { steps, c_id, c_state } = customCourseDetail
      if(customCourseDetail.c_isManagerSign === false){
        // if all steps marked completed then mark course as COMPLETED
        if( this.isAllStepMarked(steps) && c_state == assignCourseState.START && !isCompRequest && this.count === 0){
          // Just single request required
          this.count = 1

          let data = {
            c_id: c_id
          }
          this.props._custom_course_complete(JSON.stringify(data), () => {
            if(customCourseDetail.is_default_course) {
              this.openBadgeModal();
            } else {
              this.props.history.push(ROUTES.MY_COURSES);
            }
          })
        }
      }
    }
    if(customCourseDetail.steps && !!customCourseDetailPrev.steps === false && customCourseDetail.steps.length > 0) {
        this.setCourseStep(customCourseDetail.steps[selectedStep], selectedStep, customCourseDetail)
    }
  }

  closeBadgeModal = () => {
    this.setState({openBadgeModal: false})
  }
  goToBadgeSection = () => {
    this.closeBadgeModal();
    this.props.history.push({pathname: ROUTES.LEARNING,
    state: { detail: 'earned-badge'}});
  }
  openBadgeModal = () => {
    this.setState({
      openBadgeModal: true
    })
  }

  markComplete = (stepId) => {
    let { _custom_course_step_complete, myCourses, _get_custom_assign_course } = this.props
    let c_id = myCourses.customCourseDetail.c_id
    let steps = myCourses.customCourseDetail.steps
    let data = {
      c_id: c_id,
      step_id: stepId
    }
    let selectedStep = steps.filter(step => step.step_id === stepId)[0]
    if(selectedStep.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ){
      if(selectedStep.is_quiz_started !== QUIZ_STATUSES.COMPLETED) {
        alert("Please submit quiz first")
        return false;  
      }

      else if(selectedStep.quiz_attempts < 3 && selectedStep.quiz_result < 80) {
        if(selectedStep.step_quiz.questions.length === 1 && selectedStep.step_quiz.questions[0].question_type === QuizQuesTypesKey.RATING) {
          
        } else {
          alert("You need 80% to pass the quiz.")
          return false;
        }
      }

    } else if(!!selectedStep.step_link === false) {
      alert("Please submit assigned task first")
      return false;
    }
    _custom_course_step_complete(JSON.stringify(data), () => {
      // update step data
      _get_custom_assign_course(c_id)
    })
  }

  hideAlert = () => {
    this.setState({
      successResponse: false
    })
  }

  completeCourse = () => {
    let { customCourseDetail } = this.props.myCourses
    if( customCourseDetail.c_id && this.isAllStepMarked(customCourseDetail.steps) ){
      let { c_id } = customCourseDetail
      let data = {
        c_id: c_id
      }
      this.props._custom_course_complete(JSON.stringify(data), () => {
        this.props.history.push(ROUTES.MY_COURSES)
      })
    }
  }

  setCourseStep = async (step, index, stepsData) => {
    let eurl = step.step_link
    if(step.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO) {
      this.setState({
        isVideoRecordView: true,
        isEmbedLoading: true,
        embededHTML: null,
        isEmbedExist: false,
        selectedStep: index,
        isRecorded: !!step.step_link,
        recordedLink: step.step_link || null,
        activeStep: step
      })
      return
    }

    if(step.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO && !!step.step_link === false) {
      this.setState({
        isStepVideoLinkModalShow: true
      })
    }

    // reset iframe view
    this.setState({
      isVideoRecordView: false,
      isEmbedLoading: true,
      embededHTML: null,
      isEmbedExist: false,
      selectedStep: index,
      isRecorded: false,
      recordedLink: null,
      activeStep: step
    })

    if(!!eurl === false) return
    let embededUrl = step.step_iframeurl
    if(embededUrl != '' && embededUrl != null) {
      this.setState({
        isEmbedLoading: false,
        embededHTML: embededUrl,
        isEmbedExist: true
      })
    } else {
      let checkIframeXfo = await iframeyStepLinks(eurl)
      if(checkIframeXfo) {
        for(let i=0; i<stepsData.steps.length; i++) {
          if(stepsData.steps[i].step_id === step.step_id) {
            stepsData.steps[i].step_iframeurl = checkIframeXfo
          }
        }
        this.props._update_iframe_url(stepsData)
        this.setState({
          isEmbedLoading: false,
          embededHTML: checkIframeXfo,
          isEmbedExist: true
        })
      } else {
        this.setState({
          isEmbedLoading: false,
          embededHTML: eurl,
          isEmbedExist: false
        })
      }
    }
  }

  // checkEmbed = (eurl, index) => {
  //   this.props._get_oembed(eurl, (res) => {
  //     console.log("_get_oembed", !!res.html)
  //     if(!!res.html === true){
  //       // extract src from oembed's embed code response
  //       let embedUrl = res.html.split('src=')[1].split(/[ >]/)[0].replace('"', '').replace('"', '')
  //       this.setState({
  //         isEmbedLoading: false,
  //         embededHTML: embedUrl,
  //         isEmbedExist: true
  //       })
  //     } 
  //     else
  //       this.setState({
  //         isEmbedLoading: false,
  //         embededHTML: eurl,
  //         isEmbedExist: false
  //       })
      
  //   })
  // }

  isAllStepMarked = (steps) => {
    let totalSteps = steps.length
    let completedSteps = steps.filter(step => step.step_complete === true).length
    return (completedSteps === totalSteps)
  }

  submitVideo = (blob) => {
    var fd = new FormData();
    fd.append('videofile', blob);
    fd.append('course_id', this.state.courseId)
    fd.append('step_id', this.getCurrentStepId())
    console.log("submitting")
    this.props._upload_step_pitch(fd, (res) => {
      if(res.success) {
        
        // update step data
      this.setState({ successResponse: true})
      this.props._get_custom_assign_course(this.state.courseId, () => {
        this.setCourseStep(this.getCurrentStep(), this.state.selectedStep)
      })
      } else {
        if(!!res.message && typeof res.message === "string" ) {
          alert(res.message)
        } else {
          alert("Error saving video! Please try again")
        }
      }
    })
  }

  getCurrentStepId = () => {
    let { selectedStep } = this.state
    let {customCourseDetail} = this.props.myCourses
    return customCourseDetail.steps[selectedStep].step_id
  }

  getCurrentStep = () => {
    let { selectedStep } = this.state
    let {customCourseDetail} = this.props.myCourses
    if(!!customCourseDetail.steps === false) return null

    return customCourseDetail.steps[selectedStep]
  }

  closeStepVideoLinkModal = () => {
    this.setState({
      isStepVideoLinkModalShow: false
    })
  }

  reloadQuizStep = () => {
    this.props._get_custom_assign_course(this.state.courseId, () => {
      this.setCourseStep(this.getCurrentStep(), this.state.selectedStep)
    })
  }

  renderQuizStep = (activeStep) => {
    return (
      <QuizContainer 
        c_id={this.state.courseId} 
        {...activeStep} 
        _reloadData={this.reloadQuizStep}
      />
    )
  }

  renderStep = () => {
    let { activeStep } = this.state
    switch(activeStep.step_type) {
      case custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ:
        return (
          <div className="embed-responsive embed-responsive-16by9 quiz-step">
            <div className="embed-responsive-item text-center">
              {this.renderQuizStep(activeStep)}
            </div>
          </div>
        )
      default:
        return this.renderStepLink()
    }
  }

  renderStepLink = () => {
    let { embededHTML, isEmbedLoading, isEmbedExist, isVideoRecordView, isRecorded, recordedLink } = this.state
    let { isUploadingPitch } = this.props.myCourses

    let loadingTxt = (this.getCurrentStep() !== null && this.getCurrentStep().step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO)? '' : '...Loading'
    
    if(isVideoRecordView) {
      return (
        <RecordPitch initialStep={'1'} isUploading={isUploadingPitch} videoLimit={120000} submitVideo={this.submitVideo} disabled={isRecorded} isRecorded={isRecorded} recordedLink={recordedLink} />
      )
    }
    else if(isEmbedLoading || !embededHTML) 
      return (
        <div className="embed-responsive embed-responsive-16by9">
          <div className="text-center">
            {loadingTxt}
          </div>
        </div>
      )
    else if( isEmbedExist ) {
      return (
        <div className="embed-responsive embed-responsive-16by9">
          {  embededHTML.includes('/presentation/d/') ?
            <iframe className="embed-responsive-item" src={createSlideIframeUrl(embededHTML)} allowFullScreen></iframe> : <iframe className="embed-responsive-item" src={embededHTML} allowFullScreen></iframe>
          }
        </div>
      )
    }
    else { 
      return (
        <div className="embed-responsive embed-responsive-16by9">
          <div className="embed-responsive-item" allowFullScreen>
            {/* <iframe className="embed-responsive-item" src={embededHTML} allowFullScreen onLoad={() => {console.log('loaded')}}></iframe> */}
            { embededHTML.includes('/presentation/d/') ?
              <iframe className="embed-responsive-item" src={createSlideIframeUrl(embededHTML)} allowFullScreen></iframe> : <div className="no-iframe">
              Open in new window.&nbsp;<a href={embededHTML} target="_blank">{'Click here '}</a>
              </div>
            }
          </div>
        </div>
      )
    }
  }

  render() {
    let {customCourseDetail, isAddingStepInfo, isCompRequest} = this.props.myCourses
    let { selectedStep, isStepVideoLinkModalShow, courseId, openBadgeModal, successResponse } = this.state
    let progress = 0
    let totalSteps = 0
    let completedSteps = 0
    if(customCourseDetail.steps){
      totalSteps = customCourseDetail.steps.length
      completedSteps = customCourseDetail.steps.filter(step => step.step_complete === true).length
      progress = (completedSteps/totalSteps)*100
    }
    return (
      <section className="main-content">
        <div id="custom-course-detail" className="container-fluid tsz-container assigned">
          <Row>
            <Col md="12">
              <div className="separator-border"></div>
            </Col>
          </Row>
          <Row className="custom-course-view-container">
            <Col md="12">
              <Row className="p-3">
                <Col md="8" className="c-link-viewarea pl-0">
                  {this.renderStep()}

                  <Row className="custom-course-content mx-1 separator-border">
                    <Col md="12">

                      <Row className="py-2">
                        <Col md="12" className="d-flex mt-3">
                          <h2 className="title">{customCourseDetail.c_title} 
                          {/* <Badge className="primary-badge course_dur ml-4">{ isNaN(customCourseDetail.c_duration)? customCourseDetail.c_duration : customCourseDetail.c_duration > 1 ? customCourseDetail.c_duration + " Weeks" : customCourseDetail.c_duration + " Week"}</Badge> */}
                          </h2>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" xs="12 d-flex">
                          <p className="assigned-course-info">Start Date</p>
                          <p className="course-info-date ml-5">{moment(customCourseDetail.start_time).format("MMMM Do, YYYY")}</p>
                        </Col>
                        <Col md="6" xs="12 d-flex">
                          <p className="assigned-course-info">Assigned By</p>
                          <p className="course-info ml-5">{customCourseDetail.assigned_by}</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <p className="mt-2 c-desc">{customCourseDetail.c_description}</p>
                        </Col>
                      </Row>
                    </Col>
                    {customCourseDetail.c_state === "Draft" ? <Col className="draft-btn">
                    <div className={'btn btn-theme ts-save-draft-btn'}>
                      <Link to={{pathname:ROUTES.CREATE_COURSE, state:{goTo: 'create-course', c_id: this.props.myCourses.customCourseDetail.c_id}}} >Back to Draft</Link>
                    </div>
                    </Col> : ''}
                  </Row>
                  
                </Col>

                <Col md="4" className="card right-sidebar">
                  <h2 className="title mt-2">{customCourseDetail.c_title}</h2>
                  <div className="progress-sec">
                    <Row>
                      <Col className="px-0 progressBox" md="12">
                        <Progress value={progress} />
                        <div className="ml-1 mt-2 course-info">{ `${completedSteps}/${totalSteps} completed`}</div>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col md="12" className="px-0 align-items-center">
                      <Row className="d-flex align-items-center c-rating">
                        <Col lg="6" md="12" className="px-0">
                          <span>Course Rating </span>
                        </Col>
                        <Col lg="6" md="12" className="px-0 d-flex align-items-center">
                          <StarRatingComponent 
                            name="rate1"
                            starColor="#ff824e"
                            emptyStarColor="#8494a5" 
                            starCount={this.state.rating}
                            value={customCourseDetail.course_rating}
                            editing={false}
                            renderStarIconHalf={() => 
                              <HalfStarRating rating={customCourseDetail.course_rating} />
                            }
                          />
                          <div className="rating-count ml-1">({customCourseDetail.rating_count ? customCourseDetail.rating_count : 0})</div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="flex-column">
                  <div className="mt-3">
              
                  { customCourseDetail.steps && customCourseDetail.steps.length > 0 && 
                    customCourseDetail.steps.map((stepData, index) => 
                    {
                      let completeCls = stepData.step_complete? "step-completed" : ''
                      let title = ''
                      switch(stepData.step_type){
                        case custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO:
                          title = 'Record and submit your pitch for review - 2min Max'
                          break;
                        case custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO:
                          title = 'Enter URL for your demo video and submit for review'
                          break;
                        default:
                          title = stepData.step_title
                      }
                      return (
                        <CourseStep
                          key={`step-${index}`}
                          title={title}
                          stepData={stepData}
                          index={index}
                          selectedStep={selectedStep}
                          completeCls={completeCls}
                          isStepVideoLinkModalShow={isStepVideoLinkModalShow}
                          courseId={courseId}
                          isAddingStepInfo={isAddingStepInfo}
                          _setCourseStep={this.setCourseStep}
                          customCourseDetail= {customCourseDetail}
                          _markComplete={this.markComplete}
                          _getTypeIcon={getTypeIcon} 
                          _closeModal={this.closeStepVideoLinkModal}
                          _onStepSubmit={this.props._add_step_pitch}
                          _get_custom_assign_course={this.props._get_custom_assign_course}
                        />
                      )
                    })
                  }
                  </div>
              </Row>
             { customCourseDetail.c_isManagerSign === true ? <Row className="py-2">
               <Col md="12" className={"my-2"}>
                <div className="mx-4">
                  <Row>
                    <Col xl="12" lg="12" md="12" sm="12">
                      <div className="d-flex align-items-center course-step-header">
                        <div className="d-flex checkbox-theme">
                            <Input id="managerSignoff" className="styled" type="checkbox" checked disabled />
                            <Label for="managerSignoff" className="arrow-label">Sign-off required by Manager</Label>
                        </div>
                      </div> 
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col>
                <div className="complete-course">
                <Button className="btn-theme-outline" onClick={this.completeCourse}>Complete Course</Button>
                </div>
              </Col>
            </Row> : ''}
                </Col>
              </Row>
            </Col>
          </Row>
          <Fragment>
            <Loader isLoading={isCompRequest} />
        </Fragment>
        {(customCourseDetail.steps && customCourseDetail.steps.length) &&
          <StepVideoLinkModal 
            isStepVideoLinkModalShow={isStepVideoLinkModalShow}
            stepData={customCourseDetail.steps[selectedStep]}
            index={selectedStep}
            courseId={courseId}
            isAddingStepInfo={isAddingStepInfo}
            _getTypeIcon={getTypeIcon}
            _closeModal={this.closeStepVideoLinkModal}
            _onSubmit={this.props._add_step_pitch}
            _get_custom_assign_course={this.props._get_custom_assign_course}
          />
        }
        </div>

        <BadgeEarnedModal 
          title="Badge Earned"
          bodyText="Congratulations! You've got a shiny new badge for your profile."
          isOpen={openBadgeModal}
          _toggle={this.closeBadgeModal}
          _confirmed={this.goToBadgeSection}
        />

        { successResponse &&
          <SweetAlert
            success
            title="Woot!"
            onConfirm={this.hideAlert}
          >
            Video Uploaded successfully
        </SweetAlert>
        }

      </section>
    )
  }
}

const mapStateToProps = ({ myCourses }) => ({
  myCourses
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_custom_course            : get_custom_course,
      _get_oembed                   : get_oembed,
      _get_custom_assign_course     : get_custom_assign_course,
      _custom_course_step_complete  : custom_course_step_complete,
      _custom_course_complete       : custom_course_complete,
      _upload_step_pitch            : upload_step_pitch,
      _add_step_pitch               : add_step_pitch,
      _update_iframe_url            : update_iframe_url
    },
    dispatch
  )

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseAssigned))

const CourseStep = ({
  title,
  stepData,
  index,
  selectedStep,
  completeCls,
  _setCourseStep,
  _markComplete,
  _getTypeIcon,
  customCourseDetail
}) => {

  const [btnDropright, SetBtnDropright] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleClick = (option, uri) => {
    if(option === 'download') {
      var link = document.createElement("a");
      // If you don't know the name or want to use
      // the webserver default set name = ''
      link.setAttribute('download', 'file');
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      // copy(uri);
      copySharableLink(uri);
      setLinkCopied(true);
    }
  }

  const toggleMenu = () => {
    if(btnDropright) {
      SetBtnDropright(false);
    } else {
      SetBtnDropright(true);
    }
  }

  return(
    <Col className={(selectedStep===index)? 'active': ''} >
      <Row className="course-steps mb-3 pt-4">
        <Col xs="12" className={"px-4"}>
          {stepData.step_complete?
            <img className={"ts-icon icon-check"} src={stepComplete}/>
            :
            <img className={"ts-icon icon-check"} src={step}/>
          }                                
          <span className="pl-2">{`Step ${index+1}`}</span>
          <div className="pull-right sharable-dropdown">
            { (selectedStep===index && (stepData.step_type === 'ExternalContent' || stepData.step_type === 'InternalContent'))  &&  
              <ButtonDropdown direction="right" isOpen={btnDropright} toggle={() => toggleMenu()}>
                <DropdownToggle color={'link'} className="action-bottom-dots">
                  <img src={shrDwnOptIcon} width="25"/>
                </DropdownToggle>
                <DropdownMenu>
                  { 
                    shareLinkActionControls.map((item, index) => 
                      <DropdownItem key={index} onClick={() => handleClick(item.key, stepData.step_link)}>{item.title}</DropdownItem>
                    )
                  }
                </DropdownMenu>
              </ButtonDropdown>
            }
          </div>
        </Col>
        <Col xs="12" className={"white-bg pt-2 pb-4 mt-2"} onClick={() => _setCourseStep(stepData, index, customCourseDetail)}>
          <Row>
            <Col>
              <div className={"step-link-wrapper d-flex"}>
                <div>
                  <img className={"ts-icon icon-int-content py-1 mr-2"} src={_getTypeIcon(stepData.step_type)} />
                </div>
                <div>
                  <p className={completeCls}>{title}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs="12" className={"px-4 py-2 pt-3 course-link"}>
          <Row>
            <Col sm="6">
              
            </Col>
            <Col sm="6">
              <div className="action-btn pull-right">
                {stepData.step_complete?
                  <Button className="btn-theme-fill">Mark Complete</Button>
                  :
                  <Button className="btn-theme-outline" onClick={() => _markComplete(stepData.step_id)}>Mark Complete</Button>
                }
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      { linkCopied &&
        <SweetAlert
          success
          title="Woot!"
          onConfirm={() => {
            setLinkCopied(false)
          }}
          >
          Link copied to clipboard
        </SweetAlert>
      }
    </Col>
  )
}
