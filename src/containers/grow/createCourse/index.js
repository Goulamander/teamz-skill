import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Container, FormGroup, Label, Alert, FormFeedback } from 'reactstrap';
import { Formik } from 'formik';
import * as yup from 'yup'
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link, withRouter } from 'react-router-dom'

import { reset_form, update_course, save_course, update_course_steps } from '../../../actions/customCourse'
import { get_custom_course } from '../../../actions/customCourse'
import { closeQuizBuilder } from '../../../actions/quizBuilder'
import { Loader } from '../../../component/Loader'
import { LearningTypes, usersTypes, customCourseTags, customCourseStateConstant, custCourseStepTypeConstant } from '../../../constants/appConstants'
import { validateHttpLink, addKeyIds } from '../../../transforms'
import defaultCourseHeader from '../../../assets/img/course_create_banner.png'
import CourseSteps from './CourseSteps'
import { ROUTES } from '../../../constants/routeConstants'
import previewIcon from '../../../assets/img/3-layers@2x.png'

const schema = yup.object({
    c_title: yup.string().required(),
    c_description: yup.string().required(),
    c_duration: yup.number().required().positive().integer().min(1).max(52),
});

const SubHeader = ({
    isShow,
    careerPathOptions,
    c_type,
    reEdit,
    _toggleInput,
    _handleDraft,
    _handleSubmit,
    _handleChange,
    myCourses
}) => {
    return (
        <Fragment>
            <Col sm="6" className={'p-2'}>
                {reEdit? 
                <div className={`admin-feedback-group ${isShow}`}>
                    <Input id="sizevalue" placeholder={careerPathOptions[0].title} size="15" name="size" type="text" value={c_type.title} disabled={reEdit} onChange={() => console.log('')} />
                    <a href="javascript:void(0)" className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={_toggleInput}></a>
                </div>
                :
                <div className={`admin-feedback-group ${isShow}`}>
                    <Input id="sizevalue" placeholder={careerPathOptions[0].title} size="15" name="size" type="text" value={c_type.title} onChange={() => console.log('')} />
                    <a href="javascript:void(0)" className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={_toggleInput}></a>
                    <ul className="feedback-list animated fadeInUp" id="sizelist">
                        {
                            careerPathOptions.map((option, i) => (
                                <li key={`cp-opt-${i}`} className="dropdown-item" >
                                    <a href="javascript:void(0)" onClick={()=>_handleChange(option)}>{option.title}</a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                }
            </Col>

            <Col sm="6" className={'ts-career-btns'}>
                {reEdit && <div className={'preview-icon'}>
                    <Link to={`${ROUTES.COURSE}/${myCourses.customCourseDetail.c_id}`} ><img src={previewIcon} alt="..." /></Link>
                </div>}
                <div className={'btn btn-theme ts-save-draft-btn'} onClick={_handleDraft}>
                    Save Draft
                </div>
                <div className={'btn btn-theme ts-publish-btn'} onClick={_handleSubmit}>
                    Publish
                </div>
            </Col>
        </Fragment>
    )
}

class CreateCourse extends Component {

    constructor(props) {
        super(props)

        this.draftData = this.props.location.state || null 
        this.state = {
            careerPathOptions: LearningTypes,
            c_type: LearningTypes[0],
            isInputOpen: false,
            courseFilename: '',
            stepReqError: false,
            errorMsgVisible: false,
            formData: {},
            reEdit: !!this.draftData,
            newCourseID: null,
            uploadPic: null,
            successResponse: false,
            publishedResponse: false,
            fileUploadSize: null
        }

        // reset steps on reload
        this.props._update_course({
            isStepInOrder: false,
            isManagerSign: false,
            assignedRole: 1,
            tag: 0,
            courseSteps: []
        })
        this.props._closeQuizBuilder()
    }

    componentDidMount() {
        // check if redirected from drafted course
        let { _get_custom_course } = this.props
        if (this.draftData && this.draftData.c_id) {
            let c_id = this.draftData.c_id
            // get course details from courseID
            _get_custom_course(c_id)
        }
    }

    componentDidUpdate(prevProps) {
        let customCourseDetail1 = prevProps.myCourses.customCourseDetail
        let customCourseDetail = this.props.myCourses.customCourseDetail
        if (!!customCourseDetail1.c_id === false && !!customCourseDetail.c_id === true) {
            // console.log("re-edit", customCourseDetail)
            let filename = customCourseDetail.c_image.substr(customCourseDetail.c_image.lastIndexOf('/') + 1)
            this.setState({
                formData: customCourseDetail,
                courseFilename: filename,
                reEdit: true,
                newCourseID: customCourseDetail.c_id,
                c_type: LearningTypes.find(item => item.name === customCourseDetail.c_type)
            })

            this.props._update_course({
                isStepInOrder: customCourseDetail.c_isStepInOrder,
                isManagerSign: customCourseDetail.c_isManagerSign,
                assignedRole: 1,
                tag: customCourseTags.indexOf(customCourseDetail.c_tag),
                courseSteps: customCourseDetail.steps
            })
        }
    }

    onFileChange = (e, file) => {
        console.log(e.target.files[0]);
        this.setState({
            uploadPic: e.target.files[0],
            courseFilename: e.target.files[0].name,
            fileUploadSize: e.target.files[0].size*0.001
        })
    }

    togglePathInput = () => {
        this.setState({
            isInputOpen: !this.state.isInputOpen
        })
    }

    toggleAssignCourse = () => {
        this.setState({
            isAssignCourseOpen: !this.state.isAssignCourseOpen
        })
    }

    toggleTagCourse = () => {
        this.setState({
            isTagCourseOpen: !this.state.isTagCourseOpen
        })
    }

    getAssignedRole = () => {
        let { customCourse } = this.props
        let assignedRole = usersTypes.filter(roleType => roleType.id == customCourse.assignedRole)
        return assignedRole[0].role
    }

    changeAssignedRole = (option) => {
        this.toggleAssignCourse()
        // TODO: handle role change
    }

    changeTag = (index) => {
        console.log(index)
        this.props._update_course({ tag: index })
        this.toggleTagCourse()
    }

    handleSubmit = (data, { resetForm }) => {
        // console.log(data)
        let { customCourse, _reset_form, _save_course } = this.props
        let { reEdit, uploadPic, c_type, fileUploadSize } = this.state
        data.c_tag = customCourseTags[customCourse.tag]
        data.steps = customCourse.courseSteps
        data.c_isStepInOrder = data.c_is_steps_ordered
        data.c_type = c_type.name

        // before submit add key_id to quiz questions
        data.steps = addKeyIds(customCourse.courseSteps)
        
        if (this.customValidation(data.c_state)) {
            this.setState({ errorMsgVisible: false })
            if (uploadPic && uploadPic.name !== null) {
                let fData = new FormData();
                fData.append('file', uploadPic)
                fData.append('courseData', JSON.stringify(data))
                let withCourseImage = true
                let reqType = (reEdit) ? "put" : "post"

                _save_course(fData, reqType, withCourseImage, (_id) => {
                    this.setState({
                        reEdit: false,
                        formData: {},
                        uploadPic: null,
                        courseFilename: '',
                        newCourseID: _id || this.state.newCourseID
                    })
                    if(data.c_state === "Draft"){
                       this.saveDraftPopUp()
                    }
                    if(data.c_state === "Save"){
                        this.publishCoursePopUp()
                    }
                    resetForm()
                    _reset_form()
                })
            } else {
                let courseData = JSON.stringify(data)
                let withCourseImage = false
                let reqType = (reEdit) ? "put" : "post"

                _save_course(courseData, reqType, withCourseImage, (_id) => {
                    // if (reEdit) {
                    //     this.setState({
                    //         reEdit: false,
                    //         formData: {},
                    //         newCourseID: newCourseID
                    //     })
                    // }
                    this.setState({
                        reEdit: false,
                        formData: {},
                        newCourseID: _id || this.state.newCourseID
                    })

                    if(data.c_state === "Draft"){
                        this.saveDraftPopUp()
                     }
                     if(data.c_state === "Save"){
                         this.publishCoursePopUp()
                     }
                    resetForm()
                    _reset_form()
                })
            }
        } else {
            this.setState({ errorMsgVisible: true })
        }

    }

    customValidation = (courseState) => {
        let isValid = true
        let { customCourse, _update_course_steps } = this.props
        let {fileUploadSize, uploadPic} = this.state
        // Steps validation
        // step is required
        if (customCourse.courseSteps.length === 0) {
            isValid = false
            this.setState({ stepReqError: true })
        } else {
            this.setState({ stepReqError: false })
        }
        // Image size validation
        if(uploadPic && uploadPic.name !== null){
            if(fileUploadSize>200){
                isValid = false
            }else{
                isValid = true
            }
        }

        // step title and link are required
        customCourse.courseSteps.forEach(step => {
            step.error = {}
            if(step.step_type !== custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO && step.step_type !== custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO && step.step_type != custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ){
                if(!!step.step_title === false) { 
                    step.error.title = true; isValid = false 
                }
                if(!!step.step_link === false) { 
                    step.error.link = true; isValid = false 
                }

                if(!validateHttpLink(step.step_link)) {
                    step.error.link = 'Please enter a valid url'
                    isValid = false
                }
            }
            if(step.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ) {
                // empty title validation
                if(!!step.step_title === false) { 
                    step.error.title = true; isValid = false 
                }
                // empty quiz validation
                if(courseState != 'Draft') {
                    if(!!step.step_quiz === true && step.step_quiz.questions.length === 0) { 
                        step.error.quiz = true; isValid = false 
                    }
                } else {
                    if(!!step.step_quiz === true && !!step.step_quiz.welcome_text === false && step.step_quiz.questions.length === 0) {
                        step.error.quiz = true; isValid = false 
                    }
                }
            }
        });
        _update_course_steps(customCourse.courseSteps)

        return isValid
    }

    globalClick = (e) => {
        if (e.target.dataset.name !== "caretbtn") {
            this.setState({
                isTagCourseOpen: false,
                isAssignCourseOpen: false,
                isInputOpen: false
            })
        }
    }

    loadDraftState = (newCourseID) => {
        // get course details from courseID
        this.props._get_custom_course(newCourseID)
        this.props.history.replace({pathname:ROUTES.CREATE_COURSE, state:{c_id: newCourseID}})
    }

    hideDraftAlert = () => {
        this.setState({
            successResponse: false,
            publishedResponse: false,
            reEdit: true
        }, () => {
            // Draft success popup close. reinitiate form with draft data.
            let {newCourseID} = this.state
            this.loadDraftState(newCourseID)
        })
    }

    hideAlert = () => {
        this.setState({
          successResponse: false,
          publishedResponse: false
        });
        this.props.history.push(ROUTES.COURSES_LIBRARY);
    }

    saveDraftPopUp = () => {
        this.setState({ successResponse: true})
    }

    publishCoursePopUp = () => {
        this.setState({ publishedResponse: true})
    }

    changeCourseType = (option) => {
        this.setState({
            c_type: option
        })
        this.resetForm()
    }

    resetForm = () => {
        this.props._reset_form()
        this.setState({ stepReqError: false })
    }

    descPlaceholder = () => {
        let { c_type } = this.state,
        desc = ''
        switch(c_type.name) {
            case LearningTypes[1].name:
                desc = 'Watch the product pitch video put together by our Product Management Team. Then watch a few good storytelling videos recommended by our Marketing team. Now, it’s your turn to give it a try. Share your best demo that got kudos from customers. We will provide feedback as well.'
            break;
            case LearningTypes[2].name:
                desc = 'Watch the sales pitch video put together by our Sales Enablement Team. Then watch a few good storytelling videos recommended by our Marketing team. Now, it’s your turn to give it a try. Record and submit your pitch for review. We will have it scored and provide feedback.'
            break;
            case LearningTypes[0].name:
            default:
                desc = 'In this training course, you will learn how our front-end team operates, the tools, methods and Dev environments we use. You will go through knowledge base documents and get to hacking a bit. We learn while we build. You get to also listen to the video where our CTO covers the structurce of our Django app and our AWS infrastructure… '
            break
        }
        return desc;
    }

    titlePlaceholder = () => {
        let { c_type } = this.state,
        title = ''
        switch(c_type.name) {
            case LearningTypes[1].name:
                title = 'Sales Engineering Training'
            break;
            case LearningTypes[2].name:
                title = 'Sales Pitch Training'
            break;
            case LearningTypes[0].name:
            default:
                title = 'New Hire Onboarding For Front-End Engineers'
            break
        }
        return title;
    }

    render() {
        let { isInputOpen, careerPathOptions, c_type, courseFilename, isAssignCourseOpen, isTagCourseOpen, stepReqError, errorMsgVisible, formData, reEdit, successResponse, publishedResponse, fileUploadSize } = this.state
        let { customCourse, _update_course } = this.props
        let show = isInputOpen ? 'show' : '';
        let assignCourseShow = isAssignCourseOpen ? 'show' : '';
        let tagCourseShow = isTagCourseOpen ? 'show' : '';
        let placeholderText = this.descPlaceholder()
        let titlePlaceholder = this.titlePlaceholder()
        let errorFileSize = fileUploadSize >= 200 ? true : false
        return (
            <div className="txz-hire">
                {(!reEdit || (reEdit && formData.c_id)) ?
                    <Formik
                        validationSchema={schema}
                        onSubmit={this.handleSubmit}
                        initialValues={{
                            c_id: formData.c_id || '',
                            c_title: formData.c_title || '',
                            c_description: formData.c_description || '',
                            c_duration: formData.c_duration || '',
                            c_tag: formData.c_tag || '',
                            c_image: formData.c_image || '',
                            c_state: customCourseStateConstant.DRAFT,
                            c_is_steps_ordered: formData.c_isStepInOrder || false,
                            c_isManagerSign: formData.c_isManagerSign || false,
                            steps: customCourse.courseSteps,
                            user_role: 1 //Hard coded user_role
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                                <Form noValidate onSubmit={handleSubmit} onClick={(e) => this.globalClick(e)}>
                                    {/* sub header */}
                                    <Row className={'mt-4 m-0'}>
                                        <SubHeader
                                            isShow={show}
                                            careerPathOptions={careerPathOptions}
                                            c_type={c_type}
                                            reEdit={reEdit}
                                            _toggleInput={this.togglePathInput}
                                            _handleDraft={() => {
                                                values.c_state = customCourseStateConstant.DRAFT;
                                                handleSubmit()
                                                }}
                                            _handleSubmit={() => {
                                                values.c_state = customCourseStateConstant.SAVE;
                                                handleSubmit()
                                            }}
                                            _handleChange={this.changeCourseType}
                                            myCourses={this.props.myCourses}
                                        />
                                    </Row>

                                    <Alert color="danger" isOpen={errorMsgVisible} >
                                        Please fix validation errors
                                    </Alert>
                                    <Row className="img-wrapper mt-4 m-0">
                                        <div className="img-conatiner">
                                            <img src={defaultCourseHeader} alt="..." />
                                        </div>
                                    </Row>

                                    <Row className="course-form pl-4 pr-4 m-0">
                                        <Container>

                                            <div className="course-title">Create a course and start growing your people</div>

                                            <div className="modal-form">
                                                <Row>
                                                    <Col xl="6" lg="6" md="6" sm="12">
                                                        <FormGroup>
                                                            <Label>Course Title (Required)</Label>
                                                            <Input
                                                                type="text"
                                                                name="c_title"
                                                                placeholder={titlePlaceholder}
                                                                value={values.c_title}
                                                                onChange={handleChange}
                                                                invalid={touched.c_title && !!errors.c_title}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xl="6" lg="6" md="6" sm="12">
                                                        <FormGroup>
                                                            <Row>
                                                            <Label>Weeks to complete course (Required)</Label>
                                                                <Col xl="6" md="9" sm="12">
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="4"
                                                                        name="c_duration"
                                                                        value={values.c_duration}
                                                                        onChange={handleChange}
                                                                        invalid={touched.c_duration && !!errors.c_duration}
                                                                        min="1"
                                                                        max="52"
                                                                    />
                                                                </Col>
                                                                <Col xl="6" md="3" sm="12" className="px-0">
                                                                    <span>Weeks</span>
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <FormGroup>
                                                            <Label>Course Description (Required)</Label>
                                                            <Input
                                                                type="textarea"
                                                                placeholder={placeholderText}
                                                                name="c_description"
                                                                value={values.c_description}
                                                                onChange={handleChange}
                                                                invalid={touched.c_description && !!errors.c_description}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col xl="10" lg="10" md="10" sm="12">
                                                        <FormGroup>
                                                            <Label>Course Image (Recommended)</Label>
                                                            <Input type="text" value={courseFilename} placeholder="Choose an image (Add your team outing picture or get a free image from web)- max 200 KB" disabled invalid={errorFileSize}/>
                                                            {errorFileSize &&
                                                                <FormFeedback>{'max file size 200 KB'}</FormFeedback>
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xl="2" lg="2" md="2" sm="12">
                                                        <div className="ts-upload-button">
                                                            <div className="input-file-container">
                                                                <Input id="uploadImg" className="input-file" type="file" name="file" accept="image/*" onChange={(e) => this.onFileChange(e)}/>
                                                                
                                                                <Label className="input-file-trigger btn btn-primary btn-ts" tabIndex="0" for="uploadImg">Upload</Label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <CourseSteps stepReqError={stepReqError} c_type={c_type} formValues={values} handleChange={handleChange} />

                                                <div className="heading-row gray-bg d-flex mb-5">
                                                    <Col xl="9" lg="9" md="7" sm="12">
                                                        <span>Course Completion</span>
                                                    </Col>

                                                    <Col xl="3" lg="3" md="5" sm="12" className="px-0">
                                                        <div className="d-flex align-items-center course-step-header">
                                                            <div className="d-flex checkbox-theme">
                                                                <Input 
                                                                    id="managerSignoff" 
                                                                    className="styled" 
                                                                    type="checkbox" 
                                                                    name={'c_isManagerSign'}
                                                                    checked={values.c_isManagerSign} 
                                                                    onChange={handleChange} />
                                                                <Label for="managerSignoff" className="arrow-label">Sign-off required by Manager</Label>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </div>

                                                <div className="mb-5">
                                                    <div className="heading-row gray-bg d-flex mb-4">
                                                        <Col>
                                                            <span>Who can assign this course</span>
                                                        </Col>
                                                    </div>

                                                    <Col sm="8">
                                                        <div className={`assign-role-wrapper admin-feedback-group ${assignCourseShow}`}>
                                                            <Input id="sizevalue" placeholder="Who can assign this course" size="15" name="size" type="text" value={this.getAssignedRole()} disabled />
                                                            <a href="javascript:void(0)" className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={this.toggleAssignCourse}></a>
                                                            <ul className="feedback-list animated fadeInUp" id="sizelist">
                                                                {
                                                                    usersTypes.map((option, i) => (
                                                                        <li key={`user-type-opt-${i}`} className="dropdown-item" >
                                                                            <a href="javascript:void(0)" onClick={() => this.changeAssignedRole(option)}>{option.role}</a>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </Col>

                                                </div>

                                                <div className="mb-5">
                                                    <div className="heading-row gray-bg d-flex mb-4">
                                                        <Col xl="6" lg="6" md="6" sm="12">
                                                            <span>Tag this course(Optional)</span>
                                                        </Col>
                                                    </div>

                                                    <Col sm="8">
                                                        <div className={`assign-tag-wrapper admin-feedback-group ${tagCourseShow}`}>
                                                            <Input id="sizevalue" placeholder="Select tag" size="15" name="size" type="text" value={customCourseTags[customCourse.tag]} disabled />
                                                            <a href="javascript:void(0)" className="fa fa-caret-down caret-btn" data-name="caretbtn" onClick={this.toggleTagCourse}></a>
                                                            <ul className="feedback-list animated fadeInUp" id="sizelist">
                                                                {
                                                                    customCourseTags.map((tag, i) => (
                                                                        <li key={`tag-opt-${i}`} className="dropdown-item" >
                                                                            <a href="javascript:void(0)" onClick={() => this.changeTag(i)}>{tag}</a>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </Col>
                                                </div>
                                            </div>
                                        </Container>
                                    </Row>
                                </Form>

                            )}
                    </Formik>
                    :
                    <Fragment>
                        <Loader isLoading={customCourse.isLoading} />
                        <Loader isLoading={!(reEdit && formData.c_id)} />
                    </Fragment>
                }
                { successResponse &&
                    <SweetAlert
                        success
                        title="Saved!"
                        onConfirm={this.hideDraftAlert}
                    >
                        Your Draft course has been saved. Please check under My courses - Draft courses.
                    </SweetAlert>
                }
                { publishedResponse &&
                    <SweetAlert
                        success
                        title="Published!"
                        onConfirm={this.hideAlert}
                    >
                        Your course has been published. Please check under My courses - Recently Published Courses.
                    </SweetAlert>
                }
            </div>
        )
    }
}

const mapStateToProps = ({ customCourse, myCourses }) => ({
    customCourse,
    myCourses
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            _reset_form: reset_form,
            _update_course: update_course,
            _save_course: save_course,
            _update_course_steps: update_course_steps,
            _get_custom_course: get_custom_course,

            _closeQuizBuilder:  closeQuizBuilder
        },
        dispatch
    )

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateCourse))