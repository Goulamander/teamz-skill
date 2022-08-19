import React, {Component, Fragment} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'

import {
  edit_new_course,
  add_new_course,
  reset_new_course,
  edit_course,
  update_course, 
  delete_course,
  unfurling,
  recommend_new_course,
} from '../../actions/myCourses'
import { TZSProgress } from '../../component/TZSProgress'
import { ConfirmationBox } from '../../component/ConfirmationBox'
import { validateHttpLink } from '../../transforms/'

class EditCourseModal extends Component{
    state = {
        isModalShow: this.props.isShowEditModal,
        // course: {},
        showError: false,
        errMsg: '',
        courseValidationError: {
            c_name: false,
            c_link: false,
            c_by: false
        },
        openConfirmationBox: false,
        isNew: false,
        course: this.props.editCourseData
    }

    toggleEditCourseModal = () => {
        this.props.toggleEditCourseModal()
    }

    onECChange = (value, type) => {
        let {editableID, editCourseData} =  this.props
        if(editableID !== null) {
            editCourseData[type] = value
            this.props._edit_course(editableID, editCourseData)
        }
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
    
    onECSaveHandler = () => {
        // let { courses } = this.props.myCourses
        let { editCourseData} = this.props
        if(this.onCourseValidate(editCourseData)) {
        // let {editCourseData} = JSON.parse(JSON.stringify(editCourseData))
        delete editCourseData.error;
        // console.log(editCourseData)
        this.props._update_course(editCourseData, () => {
            this.toggleEditCourseModal()
            this.setState({
            courseValidationError: {c_name: false, c_link: false, c_by: false}
            })
        })
        }
    }

    onECDeleteHandler = () => {
        this.closeConfBox()
        let { editCourseData} = this.props
        this.props._delete_course(editCourseData.c_id, () => {
        this.toggleEditCourseModal()
        })
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


    unfurlMe = (e, isNew=false) => {
        let link = e.target.value;
        let {editableID, editCourseData} =  this.props
        let {newCourse} = this.props.myCourses
        if(validateHttpLink(link)){
            if(isNew) {
                this.props._unfurling(link, newCourse)
            } else {
                this.props._unfurling(link, editCourseData, editableID)
            }
        }
    }

    render(){
        let { isModalShow, openConfirmationBox, isNew, showError, errMsg, courseValidationError, course } = this.state
        if (!isModalShow) return null
        else
            return(
                <Fragment>
                    <Modal 
                        className={'modal-dialog-centered'} 
                        modalClassName={'modal-theme tzs-modal'} 
                        id={'addnewcourse'}
                        isOpen={isModalShow} 
                        toggle={this.toggleEditCourseModal}
                    >
                        <ModalHeader toggle={this.toggleEditCourseModal}>{"Edit Progress"}</ModalHeader>
                        <ModalBody>
                            <Alert color="danger" isOpen={showError}>
                                {errMsg}
                            </Alert>
                            <Form className="modal-theme-form">
                                <FormGroup>
                                <Label>Course Name</Label>
                                <Input type="text" placeholder="Big Data and GCP Experience" onChange={(e) => {this.onECChange(e.target.value, "c_name")}} value={course.c_name} invalid={courseValidationError.c_name} />
                                </FormGroup>
                                <FormGroup>
                                <Label>Course Link</Label>
                                <Input type="text" placeholder="http://example.com/course" onChange={(e) => {this.onECChange(e.target.value, "c_link")}} onBlur={(e)=> this.unfurlMe(e, isNew)} value={course.c_link} invalid={courseValidationError.c_link} />
                                </FormGroup>
                                <FormGroup>
                                <Label>Course Author Name (Optional)</Label>
                                <Input type="text" placeholder="John Johnson" onChange={(e) => {this.onECChange(e.target.value, "c_author_name")}} value={course.c_author_name} invalid={courseValidationError.c_author_name} />
                                </FormGroup>
                                <FormGroup>
                                <Label>Course By</Label>
                                <Input type="text" placeholder="Coursera" onChange={(e) => {this.onECChange(e.target.value, "c_by")}} value={course.c_by} invalid={courseValidationError.c_by} />
                                </FormGroup>
                                <FormGroup>
                                <TZSProgress 
                                    label="Progress"
                                    progressVal={course.c_progress}
                                    _onProgressChange={(newVal) => this.onECChange(newVal, "c_progress")}
                                />
                                </FormGroup>
                                    
                                <div className="form-actions full-form-actions">
                                <button type="button" className="btn btn-theme" onClick={this.onECSaveHandler}>Save</button>
                                            <button type="button" className="btn btn-gray" onClick={this.toggleEditCourseModal}>Cancel</button>
                                { !isNew &&
                                            <button type="button" className="btn btn-danger" onClick={this.openConfirmationBox}>Delete</button>
                                }
                                </div>
                            </Form>
                        </ModalBody>
                    </Modal>
                    <ConfirmationBox 
                        title="Are you sure?"
                        bodyText="You want to delete this course?"
                        isOpen={openConfirmationBox}
                        _toggle={this.closeConfBox}
                        _confirmed={this.onECDeleteHandler}
                    />
                </Fragment>

        );
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCourseModal);