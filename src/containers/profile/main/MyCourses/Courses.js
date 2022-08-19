import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'

import {
  edit_new_course,
  add_new_course,
  reset_new_course,
  edit_course,
  update_course, 
  delete_course,
  unfurling,
  recommend_new_course,
} from '../../../../actions/myCourses'
import { TZSProgress } from '../../../../component/TZSProgress'
// import { ConfirmationBox } from '../../../../component/ConfirmationBox'
import { Loader } from '../../../../component/Loader'
import CustomActionBox from '../../../../component/CustomActionBox'
import { validateHttpLink, validateEmail } from '../../../../transforms/'
import { nestedCourseForm } from '../../../../constants/appConstants'
// import closeIcon from '../../../../assets/img/close.png'
import courseImgDefault from '../../../../assets/img/course_small_default.jpg'
import default_logo from '../../../../assets/img/your_logo.png'
import EditCourseModal from '../../../../component/common/EditNewCourse';
import CourseRecommendModal from '../../../../component/common/Recommend';
import CoursesList from '../../../../component/common/Courses'

export const CourseModal = ({
  isModalShow,
  course,
  showError,
  errMsg,
  courseValidationError,
  isNew,
  _toggle,
  _onChange,
  _onSave,
  _onDelete,
  _unfurlMe,
  title
}) => (
  <Modal 
    className={'modal-dialog-centered'} 
    modalClassName={'modal-theme tzs-modal'} 
    id={'addnewcourse'}
    isOpen={isModalShow} 
    toggle={_toggle}
  >
    <ModalHeader toggle={_toggle}>{title}</ModalHeader>
    <ModalBody>
      <Alert color="danger" isOpen={showError}>
          {errMsg}
      </Alert>
      <Form className="modal-theme-form">
        <FormGroup>
          <Label>Course Name</Label>
          <Input type="text" placeholder="Big Data and GCP Experience" onChange={(e) => {_onChange(e.target.value, "c_name")}} value={course.c_name} invalid={courseValidationError.c_name} />
        </FormGroup>
        <FormGroup>
          <Label>Course Link</Label>
          <Input type="text" placeholder="http://example.com/course" onChange={(e) => {_onChange(e.target.value, "c_link")}} onBlur={(e)=> _unfurlMe(e, isNew)} value={course.c_link} invalid={courseValidationError.c_link} />
        </FormGroup>
        <FormGroup>
          <Label>Course Author Name (Optional)</Label>
          <Input type="text" placeholder="John Johnson" onChange={(e) => {_onChange(e.target.value, "c_author_name")}} value={course.c_author_name} invalid={courseValidationError.c_author_name} />
        </FormGroup>
        <FormGroup>
          <Label>Course By</Label>
          <Input type="text" placeholder="Coursera" onChange={(e) => {_onChange(e.target.value, "c_by")}} value={course.c_by} invalid={courseValidationError.c_by} />
        </FormGroup>
        <FormGroup>
          <TZSProgress 
            label="Progress"
            progressVal={course.c_progress}
            _onProgressChange={(newVal) => _onChange(newVal, "c_progress")}
          />
        </FormGroup>
              
        <div className="form-actions full-form-actions">
          <button type="button" className="btn btn-theme" onClick={_onSave}>Save</button>
					<button type="button" className="btn btn-gray" onClick={_toggle}>Cancel</button>
          { !isNew &&
					  <button type="button" className="btn btn-danger" onClick={_onDelete}>Delete</button>
          }
        </div>
      </Form>
    </ModalBody>
  </Modal>
)

const addNewCourseText = "Add new courses you are taking",
      editCourseText = "Edit Progress";
class Courses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isACModalShow: false,
      isECModalShow: false,
      openConfirmationBox: false,
      editableID: null,
      viewAllCourses: false,
      editCourseData: {},
      courseToRecommend: {},
      isShowEditModal: false,
      isShowRecommendModal: false,
      errMsg: '',
      courseValidationError: {
        c_name: false,
        c_link: false,
        c_by: false
      },
      recommendee: [
        {
          email: '',
          error: {
            email: null
          }
        },
        {
          email: '',
          error: {
            email: null
          }
        },
        {
          email: '',
          error: {
            email: null
          }
        },
      ]
    }
  }

  toggleAddCourseModal = () => {
    this.props._reset_new_course()
    this.setState(prevState => ({
      isACModalShow: !prevState.isACModalShow
    }));
  }


  onACChange = (value, type) => {
    let {newCourse} = this.props.myCourses
    newCourse[type] = value
    this.props._edit_new_course(newCourse)
  }

  onACSaveHandler = () => {
    let { newCourse } = this.props.myCourses
    if(this.onCourseValidate(newCourse)) {
      let courseData = JSON.parse(JSON.stringify(newCourse))
      
      delete courseData.error;
      this.props._add_new_course(courseData, () => {
        this.toggleAddCourseModal()
        this.setState({
          courseValidationError: {c_name: false, c_link: false, c_by: false}
        })
      })
    }
  }

  openConfirmationBox = () => {
    this.setState({
      openConfirmationBox: true
    })
  }

  closeConfBox = () => {
    this.setState({
      openConfirmationBox: false
    })
  }

  onCourseValidate = (course) => {
    let isValid = true
    let { courseValidationError } = this.state

    Object.keys(courseValidationError).map((value) => {
      courseValidationError[value] = false
      if(course[value] === ""){
        courseValidationError[value] = true
        isValid = false
      }
      // validate course link
      if(!validateHttpLink(course.c_link)) {
        isValid = false
        courseValidationError.c_link = true
      }
    })
    
    this.setState({
      courseValidationError: courseValidationError
    })
    return isValid
  }

  unfurlMe = (e, isNew=false) => {
    let link = e.target.value;
    let {editableID, editCourseData} =  this.state
    let {newCourse} = this.props.myCourses
    if(validateHttpLink(link)){
      if(isNew) {
        this.props._unfurling(link, newCourse)
      } else {
        this.props._unfurling(link, editCourseData, editableID)
      }
    }
  }

  toggleViewAllCourses = () => {
    this.setState({
      viewAllCourses: !this.state.viewAllCourses
    })
  }

  handleDraftActions = (key, course, id) => {
      
    switch(key) {
      case "editCourse":
        this.setState({
          isShowEditModal: true,
          editableID: id,
          editCourseData: course
        });
      break;
      case "recommendedCourse":
        this.setState({
          isShowRecommendModal: true,
          editableID: id,
          editCourseData: course
        })
        
      break;
        default:
    }
  }

  toggleEditCourseModal = () => {
    // this.props.this.toggleEditCourseModal()
    this.setState({
      isShowEditModal: false
    })
  }

  toggleRecommendModal = () => {
    this.setState({
      isShowRecommendModal: false,
        errMsg: '',
        recommendee: [
            {
            email: '',
            error: {
                email: null
            }
            },
            {
            email: '',
            error: {
                email: null
            }
            },
            {
            email: '',
            error: {
                email: null
            }
            },
        ]
    });
  }

  renderToggleViewBtn = () => {
    let label = this.state.viewAllCourses? 'View less' : 'View all' 

    return(
      <h4 className="common-head">Courses In Progress <a className="view-btn float-right" href="javascript:void(0)" onClick={this.toggleViewAllCourses}>{label}</a></h4>
    )
  }

  render() {
    let { courses, newCourse, isLoading } = this.props.myCourses
    let { isACModalShow, isECModalShow, courseValidationError, editCourseData, viewAllCourses, openConfirmationBox, isRecommendModalShow, recommendee, errMsg, isShowEditModal, isShowRecommendModal, editableID } = this.state
    let coursesData = viewAllCourses? courses : courses.slice(0,3)

    return (
      <div className="events-box">
        <Row>
          <Col sm={12} className="text-right spacer-bottom-30 spacer-top-30">
            <Button className="btn btn-theme" onClick={this.toggleAddCourseModal} >Add New Courses</Button>
          </Col>
        </Row>
        {courses.length > 0 &&
        <Fragment>
          {
            this.renderToggleViewBtn()
          }
          <div className="events-card">
            <Row>
              {coursesData.map((course, index) => {
                let courseImg = course.c_image || courseImgDefault,
                cLogo = course.c_logo || default_logo,
                shortDes = course.c_short_des || ""

                return (
                  // <Col key={`course-${index}`} lg={4} md={12} className={'mt-2'}>
                  //   <div className="card course-single-group">
                  //     <div className="img-box">											
                  //       <div className="card-img-background" style={{backgroundImage: `url(${courseImg})`}}></div>
                  //     </div>
                  //     <div className="card-body p-0 pt-3">
                  //       <h5 className="card-title"><a href={course.c_link} target={'blank'} >{course.c_name}</a></h5>
                  //       <div className="course-company-logo">
                  //         <img src={cLogo} />
                  //       </div>
                  //       {/* <ul className="card-info card-info-course">
                  //         <li><i className="fa fa-calendar"></i>18 lectures | 3 hours | Expert</li>
                  //       </ul> */}
                  //       <p className="card-text">{shortDes} | By {course.c_by} {(course.c_author_name) ? `- ${course.c_author_name}` : ``}</p>
                  //       <div className="action-bottom-dots">
                  //         {/* <a href="javascript:void(0)" className="fa fa-ellipsis-h" aria-hidden="true" onClick={() => this.openEditCourseModal(course, index)}></a> */}
                  //         <CustomActionBox listData={nestedCourseForm} handleClick={(key) => this.handleDraftActions(key, course, index)} />
                  //       </div>
                  //     </div>
                  //   </div>
                  // </Col>
                  <CoursesList course={course} handleDraftActions={(key) => this.handleDraftActions(key, course, index)} courseImg={courseImg} cLogo={cLogo} shortDes={shortDes} key={`course-${index}`}/>
                )
              })
              }
            </Row>
          </div>
      </Fragment>
      }
        <CourseModal 
          isModalShow={isACModalShow}
          course={newCourse}
          showError={false}
          errMsg={''}
          courseValidationError={courseValidationError}
          isNew={true}
          _toggle={this.toggleAddCourseModal}
          _onChange={this.onACChange}
          _onSave={this.onACSaveHandler}
          _onDelete={null}
          _unfurlMe={this.unfurlMe}
          title={addNewCourseText}
        />

        { isShowEditModal &&
          <EditCourseModal
            editCourseData={editCourseData}
            isShowEditModal={isShowEditModal}
            editableID={editableID}
            toggleEditCourseModal={this.toggleEditCourseModal}
          />
        }
        { isShowRecommendModal &&
          <CourseRecommendModal
            editCourseData={editCourseData}
            isShowRecommendModal={isShowRecommendModal}
            editableID={editableID}
            toggleRecommendModal={this.toggleRecommendModal}
            errMsg={errMsg}
          />
        }

        <Loader isLoading={isLoading} />

      </div>
    )
  }
}

const mapStateToProps = ( state ) => ({
  myCourses: state.myCourses,
  loginData: state.login.data 
})

const mapDispatchToProps = dispatch => 
  bindActionCreators(
    {
      _edit_new_course      : edit_new_course,
      _add_new_course       : add_new_course,
      _reset_new_course     : reset_new_course,
      _edit_course          : edit_course,
      _update_course        : update_course,
      _delete_course        : delete_course,
      _unfurling            : unfurling,
      _recommend_new_course : recommend_new_course
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses)
