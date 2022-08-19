import React, {Component, Fragment, useState, useEffect} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert, Input } from 'reactstrap'
import SweetAlert from 'react-bootstrap-sweetalert';

import { ROUTES } from '../../../../constants/routeConstants'
import {
  get_custom_courses,
  delete_custom_course,
  delete_draft_custom_course
} from '../../../../actions/customCourse'
import {
  get_custom_assign_courses,
  start_custom_assign_course
} from '../../../../actions/myCourses'
import {
  add_assignee,
  delete_assignee,
  update_assignee,
  reset_assignee,
  send_assignee,
  send_team_assignee
} from '../../../../actions/invite_assignee'
import {
  get_teams_listing
} from '../../../../actions/team'
import { appConstant, customCourseStateConstant, courseTypes, draftActionControls, myPubCourseActionControls, assignCourseState, assignActionControls , managerAssignActionControls } from '../../../../constants/appConstants'
import { Loader } from '../../../../component/Loader'
import Can from '../../../../component/Can'
import { validateEmail, getUserRoleName, getTenantSite } from '../../../../transforms'
import CustomActionBox from '../../../../component/CustomActionBox'
import { ConfirmationBox } from '../../../../component/ConfirmationBox'
import courseImgDefault from '../../../../assets/img/course_small_default.jpg'
import closeIcon from '../../../../assets/img/close.png'
import errorIcon from '../../../../assets/img/error-icon.png'
import ampereLogo from '../../../../assets/img/ampere.png'
import default_logo from '../../../../assets/img/your_logo.png'
import AssignedCoursesList from '../../../../component/common/AssignedCourses'
const routeResource = "COMPONENT"

class CustomCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewAllPubCourses: false,
      viewAllMyPubCourses: false,
      viewAllDraftCourses: false,
      viewAllAssignCourses: false,
      viewAllStartedCourses: false,
      viewAllCompletedCourses: false,
      isAssignModalShow: false,
      isAssignTeamModalShow: false,
      currentCourseToAssignTeam: {},
      currentCourseToAssign: {},
      openDraftDeleteConf: false,
      openDeleteConf: false,
      deleteDraftCourseId: null,
      deleteCourseId: null,
      assignCourseId: null,
      toCoursePage: false,
      isDeletingCourse: false,
      deleteCourseError: null,
      courseAssignSuccessfully: false,
    }
    this.customerName = "TZS"
    this.setCustomerName()
  }

  componentDidMount() {
    this.props._get_custom_courses();
    this.props._get_custom_assign_courses();
    this.props._get_teams_listing()
  }

  setCustomerName = () => {
    let cust = getTenantSite()
    console.log("cust", cust)
    if(cust !== 'app') {
      this.customerName = cust
    }
    if(cust === 'ampere') {
      this.customerName = cust
    }
  }

  toggleViewAllCourses = (type) => {
    switch(type){
      case courseTypes.DRAFT:
          this.setState({
            viewAllDraftCourses: !this.state.viewAllDraftCourses
          })
          break;

      case courseTypes.SAVE:
          this.setState({
            viewAllPubCourses: !this.state.viewAllPubCourses
          })
          break;

      case courseTypes.CURRENT:
          this.setState({
            viewAllStartedCourses: !this.state.viewAllStartedCourses
          })
          break;
      
      case courseTypes.ASSIGNED:
          this.setState({
            viewAllAssignCourses: !this.state.viewAllAssignCourses
          })
          break;
      
      case courseTypes.MY_PUB_COURSES:
        this.setState(previousState=> ({
          viewAllMyPubCourses: !previousState.viewAllMyPubCourses
        }))
        break;

      case courseTypes.COMPLETE:
        this.setState(previousState=> ({
          viewAllCompletedCourses: !previousState.viewAllCompletedCourses
        }))
        break;
    }
  }

  renderToggleViewBtn = (type, count) => {
    let label = ''
    let title = ''
    switch(type) {
      case courseTypes.DRAFT:
        label = this.state.viewAllDraftCourses? 'View less' : 'View all'   
        title = 'Draft Courses'
        break;

      case courseTypes.SAVE:
        label = this.state.viewAllPubCourses? 'View less' : 'View all' 
        title = 'Recently Published Courses'
        break;
      
      case courseTypes.ASSIGNED:
        label = this.state.viewAllAssignCourses? 'View less' : 'View all' 
        title = 'Courses Assigned to You'
        break;

      case courseTypes.CURRENT:
        label = this.state.viewAllStartedCourses? 'View less' : 'View all' 
        title = 'Assigned Courses In Progress'
        break;

      case courseTypes.COMPLETE:
        label = this.state.viewAllCompletedCourses? 'View less' : 'View all' 
        title = 'Completed Courses'
        break;

      case courseTypes.MY_PUB_COURSES:
        label = this.state.viewAllMyPubCourses? 'View less' : 'View all' 
        title = 'Courses I created'
        break;
    }

    return(
      <h4 className="common-head">{`${title} - ${count} courses`} <a className="view-btn float-right" href="javascript:void(0)" onClick={()=>this.toggleViewAllCourses(type)}>{label}</a></h4>
    )
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

  handleDraftActions = (key, c_id) => {
    switch(key) {
      case "delete": 
        this.setState({
          openDraftDeleteConf: true,
          deleteDraftCourseId: c_id
        })
        break;

      default:
        console.log("No action")
    }
  }

  handleAssignActions = (key, c_course, index) => {
    switch(key) {
      case "assign": 
        this.openAssignCourseModal(c_course, index);
        break;
      case "assignToTeam": 
        this.openAssignCourseTeamModal(c_course, index);
        break;
      default:
        console.log("No action")
    }
  }

  handleMyPubActions = (key, c_id) => {
    switch(key) {
      case "delete": 
        this.setState({
          openDeleteConf: true,
          deleteCourseId: c_id
        })
        break;

      case "edit": 
        // <Link to={{pathname:ROUTES.CREATE_COURSE, state:{goTo: 'create-course', c_id: c_course.c_id}}}
        console.log("sdsddsadasdad", this.props)
        // this.setState({
        //   openDraftDeleteConf: true,
        //   deleteCourseId: c_id
        // })
        break;

      default:
        console.log("No action")
    }
  }

  deleteDraftCourse = () => {
    this.props._delete_draft_custom_course(this.state.deleteDraftCourseId, (success) => {
      if(success) {
        this.props._get_custom_courses()
      }
      this.setState({
        openDraftDeleteConf: false,
        deleteDraftCourseId: null
      })
    })
  }

  deleteCourse = () => {
    // reset delete course states
    this.setState({
      isDeletingCourse: true,
      deleteCourseError: null
    })

    // API request
    let errmsg = null
    this.props._delete_custom_course(this.state.deleteCourseId, (res) => {
      if(res.success) this.props._get_custom_courses()
      else if(res.message) errmsg = res.message

      this.setState({
        openDeleteConf: false,
        deleteCourseId: null,
        isDeletingCourse: false,
        deleteCourseError: errmsg
      })
    })
  }

  startAssignCourse = (course, index) => {
    console.log("startAssignCourse", course);
    let { _start_custom_assign_course } = this.props
    
    _start_custom_assign_course(course.c_id, () => {
      // redirect to custom course page
      this.setState({
        assignCourseId: course.c_id,
        toCoursePage: true
      })
    })
  }

  render() {
    let { customCourses, isLoading, assignedCourses, isAssignCourses, startingAssignCourse } = this.props.myCourses
    let { assignee, isTeamAssigneeError, teamAssigneeError, error, assignErrorMsg } = this.props.inviteAssignee
    let { logoImages } = this.props.profileSettings
    let { viewAllPubCourses, viewAllMyPubCourses, viewAllDraftCourses, viewAllAssignCourses, viewAllStartedCourses, viewAllCompletedCourses, isAssignModalShow, toCoursePage, assignCourseId, deleteCourseError, isDeletingCourse, isAssignTeamModalShow, courseAssignSuccessfully } = this.state

    if(!!toCoursePage === true) {
      return <Redirect to={`${ROUTES.COURSE}/${assignCourseId}/assigned`} />
    }

    // filter Published courses only
    let publishedCourses = customCourses.filter(course => course.c_state === customCourseStateConstant.SAVE)

    // filter Draft courses only
    let draftCourses = customCourses.filter(course => course.c_state === customCourseStateConstant.DRAFT)

    // filter "Courses Created by You" courses only
    let myPublishedCourses = customCourses.filter(course => course.c_state === customCourseStateConstant.SAVE && course.c_this_author)

    // filter assigned(unStart) courses only
    let unstartedAssignCourses = assignedCourses.filter(course => course.c_state === assignCourseState.UNSTART)

    // filter assigned(start) courses only
    let startedAssignCourses = assignedCourses.filter(course => course.c_state === assignCourseState.START)

    // filter assigned(start) courses only
    let completedAssignCourses = assignedCourses.filter(course => course.c_state === assignCourseState.COMPLETE)

    let publishedCoursesData = viewAllPubCourses? publishedCourses : publishedCourses.slice(0,3)
    let myPublishedCoursesData = viewAllMyPubCourses? myPublishedCourses : myPublishedCourses.slice(0,3)
    let draftCoursesData = viewAllDraftCourses? draftCourses : draftCourses.slice(0,3)
    let unstartAssignCoursesData = viewAllAssignCourses? unstartedAssignCourses : unstartedAssignCourses.slice(0,3)
    let startAssignCoursesData = viewAllStartedCourses? startedAssignCourses : startedAssignCourses.slice(0,3)
    let completeAssignCoursesData = viewAllCompletedCourses? completedAssignCourses : completedAssignCourses.slice(0,3)

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
        
      <Fragment>

        <StartedCourses 
          customerName={this.customerName}
          coursesData={startAssignCoursesData}
          coursesCount={startedAssignCourses.length}
          {...this.props}
          _renderToggleViewBtn={this.renderToggleViewBtn}
          logoImages = {logoImages} 
        />

        <AssignedCourses 
          customerName={this.customerName}
          coursesData={unstartAssignCoursesData}
          coursesCount={unstartedAssignCourses.length}
          startingAssignCourse={startingAssignCourse}
          _renderToggleViewBtn={this.renderToggleViewBtn} 
          _startAssignCourse={this.startAssignCourse}
          logoImages = {logoImages}
        />

        <PublishedCourses 
          customerName={this.customerName}
          coursesData={publishedCoursesData}
          coursesCount={publishedCourses.length}
          {...this.props}
          _renderToggleViewBtn={this.renderToggleViewBtn}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />

        <DraftCourses 
          customerName={this.customerName}
          coursesData={draftCoursesData}
          coursesCount={draftCourses.length}
          {...this.props}
          draftActionControls={draftActionControls}
          _handleDraftActions={this.handleDraftActions}
          _renderToggleViewBtn={this.renderToggleViewBtn}
          logoImages = {logoImages} 
        />

        <CompletedCourses 
          customerName={this.customerName}
          coursesData={completeAssignCoursesData}
          coursesCount={completedAssignCourses.length}
          {...this.props}
          _renderToggleViewBtn={this.renderToggleViewBtn}
          logoImages = {logoImages} 
        />

        <MyPublishedCourses 
          customerName={this.customerName}
          coursesData={myPublishedCoursesData}
          coursesCount={myPublishedCourses.length}
          {...this.props}
          actionControls={myPubCourseActionControls}
          _handleActions={this.handleMyPubActions}
          _renderToggleViewBtn={this.renderToggleViewBtn}
          logoImages = {logoImages} 
        />

        <ConfirmationBox 
          title="Confirmation!" 
          bodyText="You want to delete this draft course. Are you sure?" 
          isOpen={this.state.openDraftDeleteConf} 
          _toggle={() => this.setState({openDraftDeleteConf: !this.state.openDraftDeleteConf})}
          _confirmed={this.deleteDraftCourse}
        />

        <ConfirmationBox 
          title="Confirmation!" 
          bodyText="You want to delete this course. Are you sure?" 
          isOpen={this.state.openDeleteConf} 
          _toggle={() => this.setState({openDeleteConf: !this.state.openDeleteConf})}
          _confirmed={this.deleteCourse}
        />

        { !!deleteCourseError &&
          <SweetAlert
            custom
            title="Error!"
            customIcon={<img className="error-icon" src={errorIcon} alt="..." />}
            onConfirm={() => {
              this.setState({ deleteCourseError: null})
            }}
          >
            {deleteCourseError}
        </SweetAlert>
        }

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

      </Fragment>
    )
  }
}

const DraftCourses = ({
  customerName,
  coursesData,
  coursesCount,
  isLoading,
  draftActionControls,
  _handleDraftActions,
  _renderToggleViewBtn,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        {
          _renderToggleViewBtn(courseTypes.DRAFT, coursesCount)
        }
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no draft courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
            // static ampere logo for customer courses
            // c_course.merchant_logo = null;
            // if(customerName == 'ampere'){
            //   c_course.merchant_logo = ampereLogo;
            // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"
                    
                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }

                return (
                  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
                    <div className="card course-single-group">
                      
                      <div className="img-box">											
                        <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                      </div>
                      
                      <div className="card-body p-0 pt-3">
                        
                        <h5 className="card-title"><Link to={{pathname:ROUTES.CREATE_COURSE, state:{goTo: 'create-course', c_id: c_course.c_id}}} >{c_course.c_title}</Link></h5>
                        
                        <div className="course-company-logo">
                          <img src={cLogo} />
                        </div>
                        
                        <ul className="card-info card-info-course">
                          <li><i className="fa fa-calendar"></i>
                         {/* { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration +" Week"
                        } */}

                         { isNaN(c_course.c_duration) ? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks " : c_course.c_duration + " Week"
                        }



                          {/* {c_course.c_duration}*/}

                        
                          
                          {" "} | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <div className="d-flex justify-content-end">
                          <CustomActionBox listData={draftActionControls} handleClick={(key) => _handleDraftActions(key, c_course.c_id)} />
                        </div>
                        {/* <div className="action-bottom-dots">
                          <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => this.openEditCourseModal(course, index)}></a>
                        </div> */}
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      }
    </Fragment>
    <Loader isLoading={isLoading} />

  </div>
  )
}

const PublishedCourses = ({
  customerName,
  coursesData,
  coursesCount,
  isLoading,
  _renderToggleViewBtn,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Recently Published Courses - ${coursesCount} courses`} <Link className="view-btn float-right" to={ROUTES.COURSES_LIBRARY}>{'View All'}</Link></h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no published courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
              // static ampere logo for customer courses
              // c_course.merchant_logo = null;
              // if(customerName == 'ampere'){
              //   c_course.merchant_logo = ampereLogo;
              // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"
                    
                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }
                return (
                  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
                    <div className="card course-single-group">
                      
                      <div className="img-box">											
                        <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                      </div>
                      
                      <div className="card-body p-0 pt-3">
                        
                        <h5 className="card-title">
                          <Link to={`${ROUTES.COURSE}/${c_course.c_id}`} >{c_course.c_title}</Link>
                          </h5>
                        
                        <div className="course-company-logo">
                          <img src={cLogo} />
                        </div>
                        
                        <ul className="card-info card-info-course">
                          <li><i className="fa fa-calendar"></i>
                        { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks" : c_course.c_duration + " Week"}
                          {/* {c_course.c_duration}  */}
                          {" "} | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _openAssignCourseModal(c_course, index)}></a>
                            // </div>
                            <div className="d-flex justify-content-end">
                              <CustomActionBox listData={assignActionControls} handleClick={(key) => _handleAssignActions(key, c_course, index)} />
                            </div>  
                          )}
                          no={() => (
                            null
                          )}
                        />
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLoading} />

  </div>
  )
}


const MyPublishedCourses = ({
  customerName,
  coursesData,
  coursesCount,
  isLoading,
  actionControls,
  _handleActions,
  _renderToggleViewBtn,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        {
          _renderToggleViewBtn(courseTypes.MY_PUB_COURSES, coursesCount)
        }
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no my courses creation</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
            // static ampere logo for customer courses
            // c_course.merchant_logo = null;
            // if(customerName == 'ampere'){
            //   c_course.merchant_logo = ampereLogo;
            // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"
                    
                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }

                return (
                  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
                    <div className="card course-single-group">
                      
                      <div className="img-box">											
                        <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                      </div>
                      
                      <div className="card-body p-0 pt-3">
                        
                        <h5 className="card-title"><Link to={`${ROUTES.COURSE}/${c_course.c_id}`} >{c_course.c_title}</Link></h5>
                        
                        <div className="course-company-logo">
                          <img src={cLogo} />
                        </div>
                        
                        <ul className="card-info card-info-course">
                          <li><i className="fa fa-calendar"></i>
                         {/* { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration +" Week"
                        } */}

                         { isNaN(c_course.c_duration) ? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks " : c_course.c_duration + " Week"
                        }



                          {/* {c_course.c_duration}*/}

                        
                          
                          {" "} | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <div className="d-flex justify-content-end">
                          <CustomActionBox listData={actionControls} handleClick={(key) => _handleActions(key, c_course.c_id)} />
                        </div>
                        {/* <div className="action-bottom-dots">
                          <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => this.openEditCourseModal(course, index)}></a>
                        </div> */}
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      }
    </Fragment>
    <Loader isLoading={isLoading} />

  </div>
  )
}

const AssignedCourses = ({
  customerName,
  coursesData,
  coursesCount,
  startingAssignCourse,
  _renderToggleViewBtn,
  _startAssignCourse,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        {
          _renderToggleViewBtn(courseTypes.ASSIGNED, coursesCount)
        }
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no assigned courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
                // static ampere logo for customer courses
                // c_course.merchant_logo = null;
                // if(customerName == 'ampere'){
                //   c_course.merchant_logo = ampereLogo;
                // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"

                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }
                    
                return (
                  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
                    <div className="card course-single-group">
                      
                      <div className="img-box">											
                        <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                      </div>
                      
                      <div className="card-body p-0 pt-3">
                        
                        <h5 className="card-title">
                          <Link to={`${ROUTES.COURSE}/${c_course.c_id}`} >{c_course.c_title}</Link>
                          </h5>
                        
                        <div className="course-company-logo">
                          <img src={cLogo} />
                        </div>
                        
                        <ul className="card-info card-info-course">
                          <li><i className="fa fa-calendar"></i>
                           { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks" : c_course.c_duration + " Week"}
                          {/* {c_course.c_duration}  */}
                          
                          {" "}| {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        {
                          (startingAssignCourse.starting && (startingAssignCourse.course_id == c_course.c_id)) ?
                          <div className="action-bottom-dots">
                            <a href="javascript:void(0)" className={'br-link'}>Starting...</a>
                          </div>
                          :
                          <div className="action-bottom-dots">
                            <a href="javascript:void(0)" className={'br-link'} onClick={() => _startAssignCourse(c_course, index)}>Start Course > </a>
                          </div>
                        }
                      </div>
                    </div>
                  </Col>
                  
                )
              })
            }
          </Row>
        </div>
        }
    </Fragment>
  </div>
  )
}

const StartedCourses = ({
  customerName,
  coursesData,
  coursesCount,
  isAssignCourses,
  _renderToggleViewBtn,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        {
          _renderToggleViewBtn(courseTypes.CURRENT, coursesCount)
        }
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no assigned course in progress</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
                    // static ampere logo for customer courses
                    // c_course.merchant_logo = null;
                    // if(customerName == 'ampere'){
                    //   c_course.merchant_logo = ampereLogo;
                    // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"

                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }
                    
                return (
                  // <Col key={`course-${index}`} lg={4} md={12} className={'mt-2'}>
                  //   <div className="card course-single-group">
                      
                  //     <div className="img-box">											
                  //       <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                  //     </div>
                      
                  //     <div className="card-body p-0 pt-3">
                        
                  //       <h5 className="card-title">
                  //         <Link to={`${ROUTES.COURSE}/${c_course.c_id}/assigned`} >{c_course.c_title}</Link>
                  //         </h5>
                        
                  //       <div className="course-company-logo">
                  //         <img src={cLogo} />
                  //       </div>
                        
                  //       <ul className="card-info card-info-course">
                  //         <li><i className="fa fa-calendar"></i>
                  //         { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks" : c_course.c_duration + " Week"}
                  //         {/* {c_course.c_duration}  */}
                  //          {" "}| {c_course.c_tag}</li>
                  //       </ul>
                        
                  //       <p className="card-text" title={shortDes}>{shortDes}</p>
                  //       {/* <div className="action-bottom-dots">
                  //         <a href="javascript:void(0)" className={'br-link'} onClick={() => _startAssignCourse(c_course, index)}>Start Course > </a>
                  //       </div> */}
                  //     </div>
                  //   </div>
                  // </Col>
                  <AssignedCoursesList key={`course-${index}`} courseImg={courseImg} cLogo={cLogo} c_course={c_course} shortDes={shortDes} />
                )
              })
            }
          </Row>
        </div>
        }
    </Fragment>
    <Loader isLoading={isAssignCourses} />

  </div>
  )
}

const CompletedCourses = ({
  customerName,
  coursesData,
  coursesCount,
  isAssignCourses,
  _renderToggleViewBtn,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        {
          _renderToggleViewBtn(courseTypes.COMPLETE, coursesCount)
        }
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no complete custom course</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <Row>
            {coursesData.map((c_course, index) => {
            // static ampere logo for customer courses
            // c_course.merchant_logo = null;
            // if(customerName == 'ampere'){
            //   c_course.merchant_logo = ampereLogo;
            // }
                    let courseImg = courseImgDefault,
                    cLogo = logoImages !==  null ? logoImages.placeholder_logo != null ? logoImages.placeholder_logo.replace("dist", "") : default_logo : default_logo,
                    shortDes = c_course.c_description || "Use Jenkins effectively to improve the quality of your continuous delivery pipeline"
                    
                    if(!!c_course.c_image === true){
                      courseImg = appConstant.BASE_URL + c_course.c_image.replace("dist", "")
                    }

                return (
                  <Col key={`course-${index}`} xl={4} lg={6} md={12} className={'mt-2'}>
                    <div className="card course-single-group">
                      
                      <div className="img-box">											
                        <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                      </div>
                      
                      <div className="card-body p-0 pt-3">
                        
                        <h5 className="card-title">
                          <Link to={{pathname: `${ROUTES.COURSE}/${c_course.c_id}/complete`, state:{courseType: 'COMPLETE'}}} >{c_course.c_title}</Link>
                          </h5>
                        
                        <div className="course-company-logo">
                          <img src={cLogo} />
                        </div>
                        
                        <ul className="card-info card-info-course">
                          <li><i className="fa fa-calendar"></i>
                          { isNaN(c_course.c_duration)? c_course.c_duration : c_course.c_duration > 1 ? c_course.c_duration + " Weeks" : c_course.c_duration + " Week"}

                            {/* {c_course.c_duration}  */}
                            
                            {" "}| {c_course.c_tag}
                          
                          </li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        {/* <div className="action-bottom-dots">
                          <a href="javascript:void(0)" className={'br-link'} onClick={() => _startAssignCourse(c_course, index)}>Start Course > </a>
                        </div> */}
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </div>
        }
    </Fragment>
    <Loader isLoading={isAssignCourses} />

  </div>
  )
}

export const CourseAssignmentModal = ({
  isModalShow,
  invites,
  _toggle,
  _add_member,
  _delete_member,
  _onChange,
  _sendInvites,
  _assigneeError,
  _assignErrorMsg
}) => {
  return (
  <Modal 
    className={'modal-dialog-centered modal-team-member'} 
    modalClassName={'modal-theme tzs-modal'} 
    
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>Assign Course</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={_assigneeError}>
        { _assignErrorMsg != null ? _assignErrorMsg : 'Something went wrong.' }
      </Alert>
      <Form className="modal-theme-form">
        <div className="invite-team-member">
          {
            invites.map((user, index) => <InviteUser key={`invite-${index}`} user={user} index={index} _onChange={_onChange} _delete_member={_delete_member} /> )
          }
        </div>
        <div className="add-member-group">
          <a href="javascript:void(0)" className="btn" onClick={_add_member}>+ Add another</a>
          <a href="javascript:void(0)" className="btn"></a>					
        </div>
        <div className="form-actions">
          <Button className="btn-theme btn-block" data-dismiss="modal" onClick={_sendInvites} >Send Invitation</Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
)
}

export const CourseAssignmentTeamModal = ({
  isModalShow,
  _toggle,
  teams,
  currentCourseToAssignTeam,
  _isTeamAssigneeError,
  _teamAssigneeError,
  _send_team_assignee
}) => {
  
  const [teamList, setTeamList] = useState([]);
  const [teamToAssign, setTeamToAssign] = useState([]);

  useEffect(() => {
    if(teams.length > 0) {
      setTeamList(teams)
    } else {
      setTeamList([])
    }
  }, [teams])
  
  const handleTeamSearch = (e) => {
    e.preventDefault();
    let searchTxt = e.target.value

    if(!!searchTxt === false) {
      if(teams.length > 0) {
        setTeamList(teams)
      } else {
        setTeamList([])
      }
      return false
    }

    let filteredTeam = teams.filter(team => {
      if(team.team_name != null)
      return team.team_name.toLowerCase().indexOf(searchTxt.toLowerCase()) !== -1
    })

    if(filteredTeam.length > 0) {
      setTeamList(filteredTeam)
    } else {
      setTeamList([])
    }
  }

  const handleTeamCheck = (team) => {
    let teamsToAdd = [];
    if(checkTeamExist(teamToAssign, team.team_id)) {
        teamsToAdd = teamToAssign.filter(data => {
          return team.team_id != data
        });
        setTeamToAssign(teamsToAdd);
    } else {
      teamsToAdd = [...teamToAssign, team.team_id]
      setTeamToAssign(teamsToAdd);
    }
  }

  const checkTeamExist = (teamToAssign, team_id) => {
    if(teamToAssign.length) {
      for(let i=0; i<teamToAssign.length; i++) {
        if(teamToAssign[i] === team_id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  const sendTeamAssignee = () => {
    let json = {
      c_id : currentCourseToAssignTeam.c_id,
      teams: teamToAssign
    }
    _send_team_assignee(json, () => {
      _toggle("callbackCalled");
      setTeamToAssign([]);
    });
  }

  const _toggleClick = () => {
    _toggle("noCallbackCalled");
    setTeamToAssign([]);
  }
  //console.log("assignee.isTeamAssigneeError", _isTeamAssigneeError)
  return (
  <Modal 
    className={'modal-dialog-centered modal-team-member'} 
    modalClassName={'modal-theme tzs-modal'} 
    
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggleClick}>Assign Course to Teams</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={_isTeamAssigneeError}>
        { _teamAssigneeError != null ? _teamAssigneeError : 'Something went wrong.' }
      </Alert>
      <Row className="mt-2 mb-2 p-2">
          <Col md={8} sm={12}>
            {/* <Form className="form-inline srch-box ml-0">
              <Input type="search" id="search-add-to-member" placeholder="Find a team" aria-label="Search" className="w-100" onChange={handleTeamSearch} />
            </Form> */}
            <div className="has-search mt-2">
              <Input type="search" className="form-control" placeholder="Find a team" onChange={handleTeamSearch}  />
              <span className="fa fa-search form-control-feedback"></span>
            </div>
          </Col>    
      </Row>
      <Form className="modal-theme-form">
        <div className="assign-course-team-modal p-3">
          {
            teamList.map((team, index) => {
              return (
                getUserRoleName() === 'MANAGER' ?
                  team.team_owner ? 
                  <Fragment key={index}>
                    <div className="team-list d-flex align-items-center">
                      <input type="checkbox" onChange={() => handleTeamCheck(team)} />
                      <div className="ml-4 initial-letter mr-3 text-center" style={{backgroundColor : team.color}}>{team.initial_letter}</div>
                      <div className="team-name">{team.team_name}</div>
                    </div>
                    <div className="divider"></div>
                  </Fragment> : '' : <Fragment key={index}>
                    <div className="team-list d-flex align-items-center">
                      <input type="checkbox" onChange={() => handleTeamCheck(team)} />
                      <div className="ml-4 initial-letter mr-3 text-center" style={{backgroundColor : team.color}}>{team.initial_letter}</div>
                      <div className="team-name">{team.team_name}</div>
                    </div>
                    {/* <div className="divider"></div> */}
                  </Fragment>
              )
            })
          }
        </div>
        <div className="form-actions d-flex justify-content-around mt-2">
          <Button className="btn-cancel" data-dismiss="modal" onClick={_toggleClick} >Cancel</Button>
          <Button className="btn-theme" data-dismiss="modal" onClick={sendTeamAssignee}>Assign</Button>
        </div>
      </Form>
    </ModalBody>
  </Modal>
  )
}

const InviteUser = ({user, index, _onChange, _delete_member}) => (
  <Row key={`inviteUser-${index}`}>
    <Col xl="6" lg="6" md="6" sm="12">
      <FormGroup>
        <Label>Email Address*</Label>
        <Input type="email" placeholder="name@domain.com" value={user.email} valid={user.error.email!=null && !user.error.email} invalid={user.error.email!=null && user.error.email} onChange={(e) => _onChange(e, user, index, "email")} />
      </FormGroup>
    </Col>
    <Col className="d-flex align-items-center">
      <div className="closeIcon" onClick={() => _delete_member(index)}>
        <img src={closeIcon} alt="..." />
      </div>
    </Col>
  </Row>
)

const mapStateToProps = ( state ) => ({
  myCourses       : state.myCourses,
  inviteAssignee  : state.inviteAssignee,
  team            : state.team,
  profileSettings   : state.profileSettings
})

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      _get_custom_courses           : get_custom_courses,
      _add_assignee                 : add_assignee,
      _delete_assignee              : delete_assignee,
      _update_assignee              : update_assignee,
      _reset_assignee               : reset_assignee,
      _send_assignee                : send_assignee,
      _send_team_assignee           : send_team_assignee,
      _get_custom_assign_courses    : get_custom_assign_courses,
      _delete_draft_custom_course   : delete_draft_custom_course,
      _delete_custom_course         : delete_custom_course,
      _start_custom_assign_course   : start_custom_assign_course,
      _get_teams_listing            : get_teams_listing
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomCourses)
