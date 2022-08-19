import React, {Component, Fragment, useState, useEffect} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import SweetAlert from 'react-bootstrap-sweetalert';

import { ROUTES } from '../../../../constants/routeConstants'
import {
  get_custom_courses_library
} from '../../../../actions/customCourse'
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
import { appConstant, courseTypes, assignActionControls, managerAssignActionControls } from '../../../../constants/appConstants'
import { Loader } from '../../../../component/Loader'
import { validateEmail, getTenantSite, getUserRoleName, convertWeekNumber } from '../../../../transforms'
import courseImgDefault from '../../../../assets/img/course_small_default.jpg'
import closeIcon from '../../../../assets/img/close.png'
import prevArrowIcon from '../../../../assets/img/backward-arrow.png'
import nextArrowIcon from '../../../../assets/img/forward-arrow.png'
import ampereLogo from '../../../../assets/img/ampere.png'
import default_logo from '../../../../assets/img/your_logo.png'
import Can from '../../../../component/Can'
import CustomActionBox from '../../../../component/CustomActionBox'
const routeResource = "COMPONENT"

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewAllPubCourses: false,
      isAssignModalShow: false,
      currentCourseToAssign: {},
      isAssignTeamModalShow: false,
      currentCourseToAssignTeam: {},
      assignCourseId: null,
      toCoursePage: false,
      courseAssignSuccessfully: false
    }
    this.customerName = "TZS"
    this.setCustomerName()
  }

  componentDidMount() {
    this.props._get_custom_courses_library();
    this.props._get_teams_listing()
  }
  setCustomerName = () => {
    let cust = getTenantSite()
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
    }
  }

  handleAssignActions = (course, index) => {
    this.setState({
      isAssignModalShow: true,
      currentCourseToAssign: course
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
    if(this.validateInviteForm()) {
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

  render() {
    let { customCoursesLibrary, isLibraryRequest, startingAssignCourse } = this.props.myCourses
    let { logoImages } = this.props.profileSettings
    let { assignee, isTeamAssigneeError, teamAssigneeError, error, assignErrorMsg } = this.props.inviteAssignee
    let { viewAllPubCourses, isAssignModalShow, toCoursePage, assignCourseId, isAssignTeamModalShow, courseAssignSuccessfully } = this.state
    let { publishCourses, tagsCustomCourses, popularCourses} = customCoursesLibrary

    let publishedCoursesData = publishCourses || []
    let popularCoursesData = popularCourses || []
    let newhireCoursesData = tagsCustomCourses != undefined ? tagsCustomCourses.newHires : [];
    let caseStudy = tagsCustomCourses != undefined ? tagsCustomCourses.caseStudy : []
    let introductory = tagsCustomCourses != undefined ? tagsCustomCourses.introductory : []
    let productUpdate = tagsCustomCourses != undefined ? tagsCustomCourses.productUpdate : []
    
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
        
        <PublishedCourses 
        customerName={this.customerName}
          coursesData={publishedCoursesData}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />

        <PopularCourses 
        customerName={this.customerName}
          coursesData={popularCoursesData}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />
        <CustomerCaseStudy
        customerName={this.customerName}
          coursesData={caseStudy}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />
        <ProductUpdate
        customerName={this.customerName}
          coursesData={productUpdate}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />
        <NewHireCourses
        customerName={this.customerName}
          coursesData={newhireCoursesData}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />
        <Introductory
          customerName={this.customerName}
          coursesData={introductory}
          {...this.props}
          _handleAssignActions={this.handleAssignActions}
          assignModalProps={assignModalData}
          assignTeamModalProps={assignTeamModalData}
          logoImages = {logoImages}
        />

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

const CourseNextArrow = (props) => (
  <div className="slider-arrow next" onClick={props.onClick}> <img src={nextArrowIcon} /> </div>
)

const CoursePrevArrow = (props) => (
  <div className="slider-arrow prev" onClick={props.onClick}> <img src={prevArrowIcon} /> </div>
)

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  useTransform: false,
  nextArrow: <CourseNextArrow />,
  prevArrow: <CoursePrevArrow />,
  responsive: [
    {
        breakpoint: 600,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false
        }
    },
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: false
      }
  }
  ]
};

const PublishedCourses = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Recently Published Courses - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no published courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                            } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        {/* <div className="action-bottom-dots">
                          <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
                        </div> */}
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

  </div>
  )
}

const PopularCourses = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Popular courses - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no popular courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                            } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

  </div>
  )
}

const NewHireCourses = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`New Hire courses - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no popular courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                          } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

  </div>
  )
}

const CustomerCaseStudy = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Customer case study - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no customer case study courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                          } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

  </div>
  )
}

const Introductory = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Introductory courses - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no Introductory courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                          } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

  </div>
  )
}

const ProductUpdate = ({
  customerName,
  coursesData,
  isLibraryRequest,
  _handleAssignActions,
  assignModalProps,
  assignTeamModalProps,
  logoImages
}) => {
  return (
    <div className="events-box">
      <Fragment>
        <h4 className="common-head">{`Product update courses - ${coursesData.length} courses`}</h4>
        {coursesData.length == 0 && 
          <Col>
            <h4 className="no-course my-5 py-5">You have no product update courses</h4>
          </Col>
        }
        {coursesData.length > 0 &&
        <div className="events-card">
          <div className="tzs-slider">
            <Slider {...settings}>
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
                  <div key={`course-${index}`} className={'mt-2'}>
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
                        <li><i className="fa fa-calendar"></i>{
                            convertWeekNumber(c_course.c_duration)
                          } | {c_course.c_tag}</li>
                        </ul>
                        
                        <p className="card-text" title={shortDes}>{shortDes}</p>
                        <Can
                          role={getUserRoleName()}
                          resource={routeResource}
                          action={"YOU:MYCOURSES:ASSIGNMENT"}
                          yes={(attr) => (
                            // <div className="action-bottom-dots">
                            //   <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => _handleAssignActions(c_course, index)}></a>
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
                  </div>
                )
              })
            }
            </Slider>
          </div>
          <CourseAssignmentModal {...assignModalProps} />
          <CourseAssignmentTeamModal {...assignTeamModalProps} />
        </div>
        }
    </Fragment>
    <Loader isLoading={isLibraryRequest} />

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
}) => (
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
  profileSettings : state.profileSettings
})

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      _get_custom_courses_library   : get_custom_courses_library,
      _add_assignee                 : add_assignee,
      _delete_assignee              : delete_assignee,
      _update_assignee              : update_assignee,
      _reset_assignee               : reset_assignee,
      _send_assignee                : send_assignee,
      _send_team_assignee           : send_team_assignee,
      _get_teams_listing            : get_teams_listing
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
