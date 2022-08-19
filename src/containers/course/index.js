import React, { Component, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Badge, Row, Col, Input, Label, Form, FormGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component';
import SweetAlert from 'react-bootstrap-sweetalert';
import copy from 'copy-to-clipboard';

import { get_custom_course, get_oembed, get_custom_assign_course_complete, update_iframe_url } from '../../actions/customCourse'
import { get_logo_placeholder_images } from '../../actions/userProfilePage'

import { custCourseStepTypeConstant, assignActionControls, shareLinkActionControls, managerAssignActionControls } from '../../constants/appConstants'
import { iframeyStepLinks, getTypeIcon, getUserRoleName, copySharableLink, createSlideIframeUrl } from '../../transforms'
import step from '../../assets/img/step.png'
import { ROUTES } from '../../constants/routeConstants'
import optionIcon from '../../assets/img/profile_default.png'
import likeIcon from '../../assets/img/like-icon.png'
import dislikeIcon from '../../assets/img/dislike-icon.png'
import shrDwnOptIcon from '../../assets/img/option_icon.png'
import RecordPitch from './courseSteps/RecordPitch';
import QuizContainer from '../../component/common/QuizContainer'
import Can from '../../component/Can'
import {
  add_assignee,
  delete_assignee,
  update_assignee,
  reset_assignee,
  send_assignee,
  send_team_assignee
} from '../../actions/invite_assignee'
import {
  get_teams_listing
} from '../../actions/team'
import { validateEmail } from '../../transforms'
import HalfStarRating from '../../component/TZS_Rating/HalfStarRating';
import { CourseAssignmentModal, CourseAssignmentTeamModal } from '../../containers/profile/main/MyCourses/CustomCourses'
const routeResource = "COMPONENT"

class Course extends Component {

  state = {
    courseId: this.props.match.params.id || '',
    isEmbedLoading: true,
    isEmbedExist: false,
    isRecorded: false,
    embededHTML: false,
    isVideoRecordView: false,
    recordedLink: null,
    selectedStep: 0,
    btnDropright: false,
    rating: 5,
    activeStep: {},
    isAssignModalShow: false,
    isAssignTeamModalShow: false,
    courseAssignSuccessfully: false,
    currentCourseToAssignTeam: {},
    currentCourseToAssign: {}
  }

  componentDidMount() {
    if(this.props.match.path === ROUTES.COURSE_COMPLETE) {
      this.props._get_custom_assign_course_complete(this.state.courseId)

    } else {
      this.props._get_custom_course(this.state.courseId)
    }
    this.props._get_teams_listing()
  }

  componentDidUpdate(prevProps) {
    let { selectedStep } = this.state
    let {customCourseDetail} = this.props.myCourses
    let customCourseDetailPrev = prevProps.myCourses.customCourseDetail
    
    // Show default step link in viewable area
    if(customCourseDetail.steps && !!customCourseDetailPrev.steps === false && customCourseDetail.steps.length > 0) {
        this.setCourseStep(customCourseDetail.steps[selectedStep], selectedStep, customCourseDetail)
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

    // if no embed url return
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

  handleAssignActions = (key, c_course) => {
    switch(key) {
      case "assign": 
        this.openAssignCourseModal(c_course);
        break;
      case "assignToTeam": 
        this.openAssignCourseTeamModal(c_course);
        break;
      default:
        console.log("No action")
    }
  }

  openAssignCourseModal = (course, index) => {
    this.setState({
      isAssignModalShow: true,
      currentCourseToAssign: course
    })
  }

  openAssignCourseTeamModal = (course, index) => {
    this.setState({
      isAssignTeamModalShow: true,
      currentCourseToAssignTeam: course
    })
  }

  toggleInviteModal = () => {
    this.setState(prevState => ({
      isAssignModalShow: !prevState.isAssignModalShow,
      currentCourseToAssign: {}
    }));
    this.props._reset_assignee()
  }

  toggleAssignCourseTeamModal = (callback) => {
    this.setState(prevState => ({
      isAssignTeamModalShow: !prevState.isAssignTeamModalShow,
      currentCourseToAssignTeam: {}
    }));
    if(callback === 'callbackCalled') {
      this.setState(prevState => ({
        courseAssignSuccessfully: true
      }));
    }
    this.props._reset_assignee()
  }

  add_member = () => {
    let user = {
      email:'',
      error: {
        email: null
      }
    }
    this.props._add_assignee(user)
  }

  delete_member = (index) => {
    this.props._delete_assignee(index)
  }

  edit_member = (e, user, index, inputType) => {
    let input = e.target.value;
    user[inputType] = input
    if(inputType === 'email') {
      // Validate email address
      user.error[inputType] = (input.length === 0)? null : !validateEmail(input) 
    }
    this.props._update_assignee(index, user)
  } 

  send_invites = (e) => {
    e.preventDefault();
    let {c_id, c_title} = this.state.currentCourseToAssign
    // check validation error
    if(this.validateInviteForm()){
      let data = {
        c_id: c_id,
        c_title: c_title
      }
      this.props._send_assignee(data , () => {
        this.toggleInviteModal();
        this.setState(prevState => ({
          courseAssignSuccessfully: true
        }));
      });
    }
  }

  validateInviteForm = () => {
    let { assignee } = this.props.inviteAssignee
    let isValid = true
    assignee.forEach((user) => {
      if(user.error.email)
        isValid=false
    })
    return isValid
  }
  
  getCurrentStep = () => {
    let { selectedStep } = this.state
    let {customCourseDetail} = this.props.myCourses
    if(!!customCourseDetail.steps === false) return null

    return customCourseDetail.steps[selectedStep]
  }

  renderQuizStep = (activeStep) => {
    if(this.props.match.path === ROUTES.COURSE_COMPLETE) {
      return (
        <QuizContainer 
          c_id={this.state.courseId} 
          {...activeStep}
        />
      )
    }

    let quizWelcomeTxt = activeStep.step_title
    if(!!activeStep.step_quiz.welcome_text === true) {
      quizWelcomeTxt = activeStep.step_quiz.welcome_text
    }
    return (
      <Row>
        <Col>
          <div className="quiz-wrapper">
            {quizWelcomeTxt}
          </div>
        </Col>
      </Row>
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
    
    let loadingTxt = (this.getCurrentStep() !== null && this.getCurrentStep().step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO)? '' : '...Loading'
    if(isVideoRecordView) {
      return (
        <RecordPitch initialStep={'1'} disabled={true} isRecorded={isRecorded} recordedLink={recordedLink} />
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
      let aspectRatio = "embed-responsive-4by3"
      if(embededHTML.indexOf('youtube.com') != -1) aspectRatio = "embed-responsive-16by9"
      return (
        <div className={`embed-responsive ${aspectRatio}`}>
          { embededHTML.includes('/presentation/d/') ?
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
    let {customCourseDetail} = this.props.myCourses
    let { assignee, isTeamAssigneeError, teamAssigneeError, error, assignErrorMsg } = this.props.inviteAssignee
    let { selectedStep, isAssignModalShow, isAssignTeamModalShow, courseAssignSuccessfully } = this.state

    let assignModalData = {
      isModalShow: isAssignModalShow,
      invites: assignee,
      _toggle: this.toggleInviteModal,
      _add_member: this.add_member,
      _delete_member: this.delete_member,
      _onChange: this.edit_member,
      _sendInvites: this.send_invites,
      _assignErrorMsg: assignErrorMsg,
      _assigneeError: error
    }

    let assignTeamModalData = {
      isModalShow: isAssignTeamModalShow,
      _send_team_assignee: this.props._send_team_assignee,
      teams: this.props.team.teamsData,
      _isTeamAssigneeError: isTeamAssigneeError,
      _teamAssigneeError: teamAssigneeError,
      _toggle: this.toggleAssignCourseTeamModal,
      currentCourseToAssignTeam: this.state.currentCourseToAssignTeam
    }

    return (
      <section className="main-content">
        <div id="custom-course-detail" className="container-fluid tsz-container">
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

                  <Row className="custom-course-content mx-1">
                    <Col md="12">
                      <Row className="py-2">
                        <Col md="12" className="d-flex mt-3">
                          <h2 className="title">{customCourseDetail.c_title} 
                          {/* <Badge className="primary-badge course_dur ml-4">{ isNaN(customCourseDetail.c_duration)? customCourseDetail.c_duration : customCourseDetail.c_duration > 1 ? customCourseDetail.c_duration + " Weeks" : customCourseDetail.c_duration + " Week"}</Badge> */}
                          </h2>
                        </Col>
                        <Col md="12">
                          <p className="mt-5 c-desc">{customCourseDetail.c_description}</p>
                        </Col>
                      </Row>
                    </Col>
                    {customCourseDetail.c_state === "Draft" ? <Col className="draft-btn">
                    <div className={'btn btn-theme ts-save-draft-btn'}>
                      <Link to={{pathname:ROUTES.CREATE_COURSE, state:{goTo: 'create-course', c_id: this.props.myCourses.customCourseDetail.c_id}}} >Back to Draft</Link>
                    </div>
                    </Col> : ''}
                  </Row>
          
                  <Row className="comment-section mx-1">
                    <Col md="12">
                      <Row className="py-2 mt-2">
                        <Col md="12" className="d-flex">
                           <h2 className="title">Comments <span className="comments-number">28</span></h2>
                        </Col>
                        <Col md="12" className="add-comment d-flex mt-3">
                          <Form className="w-100">
                              <FormGroup>
                                <div className="d-flex w-100">
                                  <img className="mr-3" src={optionIcon} alt="..." />
                                  <Input type="text" placeholder="Add a public comment…" />
                                </div>
                                {/* <Label sm={1}><img src={optionIcon} alt="..." /></Label>
                                <Col sm={11}>
                                  
                                </Col>   */}
                              </FormGroup>
                          </Form>    
                        </Col>
                        <Col md="12 p-0">
                          <div className="separator"></div>
                        </Col>
                        <Col md="12" className="comment-listing mt-3 mb-3">
                          <div className="comment d-flex">
                            <div className="image">
                              <img src={optionIcon} alt="..." /> 
                            </div>
                            <div className="comments ml-3">
                            <div className="mb-2">Vidit Jain | 2 days ago</div>
                            <div className="mb-4">This course is very useful. I was productive in 2nd week after taking this course. </div>

                            <div className="mb-3 like-dislike d-flex">
                              <div className="like-icon mr-4">
                                <img src={likeIcon} alt="like-icon"/>
                                <span className="ml-2">10</span>
                              </div>

                              <div className="dislike-icon ml-4">
                                <img src={dislikeIcon} alt="like-icon"/>
                              </div>
                            </div>
                          </div>
                          </div>
                        </Col>
                        <Col md="12 p-0">
                          <div className="separator"></div>
                        </Col>
                      </Row>
                    </Col>    
                  </Row>
                </Col>

                <Col md="4" className="card right-sidebar">
                  <h2 className="title mt-2">{customCourseDetail.c_title}</h2>
                  <Row>
                    <Col className="d-flex align-items-center assigned-to">
                      <span>Assigned to {customCourseDetail.course_count}</span>
                      {customCourseDetail.c_state !== "Draft" &&
                    <Col className="d-flex align-items-center justify-content-end">

                      <Can
                        role={getUserRoleName()}
                        resource={routeResource}
                        action={"YOU:MYCOURSES:ASSIGNMENT"}
                        yes={(attr) => (
                          // <div className="action-bottom-dots">
                          //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _openAssignCourseModal(c_course, index)}></a>
                          // </div>
                          <ButtonDropdown direction="down" isOpen={this.state.btnDropright} toggle={() => { this.setState({ btnDropright: !this.state.btnDropright }); }}>
                            <DropdownToggle className="btn btn-theme action-bottom-dots rounded">
                              Assign Course
                            </DropdownToggle>
                            <DropdownMenu>
                              {/* { getUserRoleName() === 'MANAGER' ?
                                managerAssignActionControls.map((item, index) => 
                                  <DropdownItem key={index} onClick={() => this.handleAssignActions(item.key, customCourseDetail)}>{item.title}</DropdownItem>
                                ) : assignActionControls.map((item, index) => 
                                <DropdownItem key={index} onClick={() => this.handleAssignActions(item.key, customCourseDetail)}>{item.title} */}
                                {assignActionControls.map((item, index) => 
                                <DropdownItem key={index} onClick={() => this.handleAssignActions(item.key, customCourseDetail)}>{item.title}
                              </DropdownItem>
                              )
                              }
                            </DropdownMenu>
                          </ButtonDropdown>  
                        )}
                        no={() => (
                          null
                        )}
                      />
                    </Col>
                    }
                    </Col>
                  </Row>
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
                  { customCourseDetail.steps && customCourseDetail.steps.length > 0 && 
                    customCourseDetail.steps.map((stepData, index) => {
                      let title = ''
                      switch(stepData.step_type){
                        case custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO:
                          title = 'Record and submit your pitch for review - 2min Max'
                          break;
                        case custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO:
                          title = stepData.step_video_title || 'Enter URL for your demo video and submit for review'
                          break;
                        default:
                          title = stepData.step_title
                      }
                      return <CourseStep
                              key={`courseStep-${index}`}
                              title={title}
                              stepData={stepData}
                              customCourseDetail= {customCourseDetail}
                              index={index}
                              selectedStep={selectedStep}
                              _setCourseStep={this.setCourseStep}
                              _getTypeIcon={getTypeIcon} 
                            />
                    })
                  }
                  </Row>
                  {customCourseDetail.c_isManagerSign === true ? <Row className="py-2">
                        <Col md="12" className={"my-3"}>
                          <div className="d-flex checkbox-theme justify-content-center">
                            <Input id="managerSignoff" className="styled" type="checkbox" checked disabled />
                            <Label for="managerSignoff" className="arrow-label">Sign-off required by Manager</Label>
                          </div>
                        </Col>
                      </Row> : ''}
                </Col>
              </Row>
            </Col>
          </Row>
          { courseAssignSuccessfully &&
            <SweetAlert
            success
            title="Woot!"
            onConfirm={() => {
              this.setState({ courseAssignSuccessfully: false})
            }}
            >
              Course has been assigned successfully
            </SweetAlert>
          }
          <CourseAssignmentModal {...assignModalData} />
          <CourseAssignmentTeamModal {...assignTeamModalData} />
        </div>
      </section>
    )
  }
}

const mapStateToProps = ({ myCourses, inviteAssignee, team }) => ({
  myCourses,
  inviteAssignee,
  team
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _get_custom_assign_course_complete: get_custom_assign_course_complete,
      _get_custom_course            : get_custom_course,
      _get_oembed                   : get_oembed,
      _add_assignee                 : add_assignee,
      _delete_assignee              : delete_assignee,
      _update_assignee              : update_assignee,
      _reset_assignee               : reset_assignee,
      _send_assignee                : send_assignee,
      _send_team_assignee           : send_team_assignee,
      _get_teams_listing            : get_teams_listing,
      _update_iframe_url            : update_iframe_url,
      _get_logo_placeholder_images  : get_logo_placeholder_images,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course)

const CourseStep = ({
  title,
  stepData,
  index,
  selectedStep,
  _setCourseStep,
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
      // let aTag = document.createElement('a');
      // aTag.setAttribute('href', `${uri}`);
      // aTag.innerText = "link text";
      // console.log(aTag)
      // copy(aTag, {
      //   format: 'text/plain'
      // });
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
    <Col className={(selectedStep===index)? 'active': ''} key={`step-${index}`} >
      <Row className="course-steps mb-3 pt-4">
        <Col xs="12" className={"px-4"}>
          <img className={"ts-icon icon-check"} src={step}/>
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
        <Col xs="12" className={"px-4 pt-2 pb-4 mt-2 course-link"} onClick={() => _setCourseStep(stepData, index, customCourseDetail)}>
          <div className={"step-link-wrapper d-flex"}>
            <div>
              <img className={"ts-icon icon-int-content py-1"} src={_getTypeIcon(stepData.step_type)} />
            </div>
            <div>
              <p className="ml-2 mb-0 mt-1 link" >{title}</p>
            </div>
          </div>
        </Col>
        { linkCopied &&
          <SweetAlert
            success
            title="Woot!"
            showConfirm={false}
            onConfirm={() => {
              setLinkCopied(false)
            }}
            timeout={1500}
            >
            Link copied to clipboard
          </SweetAlert>
        }
      </Row>
    </Col>
  )
}
