import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Container, FormGroup, Label, Button, FormFeedback } from 'reactstrap';
import cloneDeep from 'clone-deep'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import { 
  add_course_step, 
  delete_course_step,
  edit_course_step,
  update_course
} from '../../../actions/customCourse'
import {
  openQuizBuilder,
  closeQuizBuilder
} from '../../../actions/quizBuilder'
import { custCourseStepTypeConstant } from '../../../constants/appConstants'
import { validateHttpLink, getTypeIcon } from '../../../transforms'
import doc from '../../../assets/img/doc.png'
import activity from '../../../assets/img/activity.png'
import link from '../../../assets/img/link.png'
import step from '../../../assets/img/step.png'
import { ROUTES } from '../../../constants/routeConstants';

class CourseSteps extends Component {
  
  state = {
    openTaskActivity: false,
    selectedTaskActivity: custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ
  }

  addStep = (step_type) => {
    let { _add_course_step } = this.props,
        newStep = {
          step_link: '',
          step_title: '',
          step_type,
          error: {}
        }
    if(step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ){
      newStep.step_quiz={
        questions: []
      }
    }
    _add_course_step(newStep)
  }

  deleteStep = (index) => {
    let { _delete_course_step } = this.props
    _delete_course_step(index)
  }

  handleChange = (e, index) => {
    let { _edit_course_step, customCourse } = this.props
    let {name, value} = e.target
    // let inputName = name.replace('step_', '')
    let editStep = cloneDeep(customCourse.courseSteps[index])
    editStep[name] = value;
    _edit_course_step(index, editStep)
  }

  handleBlur = (e, index) => {
    let { _edit_course_step, customCourse } = this.props
    let {name, value} = e.target
    // let inputName = name.replace('step_', '')
    let editStep = cloneDeep(customCourse.courseSteps[index])

    if(!validateHttpLink(value)) {
      editStep['error'] = {
        link: 'Please enter a valid url'
      };
      _edit_course_step(index, editStep)
    } else {
      editStep['error'] = {};
      _edit_course_step(index, editStep)
    }
  }

  getTypePlaceholder = (type) => {
    let txt = "Please insert link to external content here";
    switch(type) {
      case custCourseStepTypeConstant.INTERNAL_CONTENT:
        txt = "Please insert link to your internal content here";
        break;

      case custCourseStepTypeConstant.EXTERNAL_CONTENT:
        txt = "Please insert link to external content here";
        break;

      case custCourseStepTypeConstant.ACTIVITY:
        txt = "Please insert link to activity here";
        break;

      case custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ:
        txt = "Please insert link to your google forms quiz here";
        break
    }
    return txt
  }

  pickActivity = () => {
    this.setState(prev => ({
      openTaskActivity: !prev.openTaskActivity,
      selectedTaskActivity: custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ
    }))
  }

  onChangeActivityType = (e) => {
    let { value } = e.target
    this.setState({
      selectedTaskActivity: value
    })
  }

  addTaskActivity = () => {
    if(this.state.selectedTaskActivity === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ ||
      this.state.selectedTaskActivity === custCourseStepTypeConstant.ACTIVITY){
      this.addStep(this.state.selectedTaskActivity)
    } else if(this.singleVideoTaskValidation()) {
      this.addStep(this.state.selectedTaskActivity)
    }
    this.pickActivity()
  }

  singleVideoTaskValidation = () => {
    let { customCourse } = this.props
    let found = -1;
    found = customCourse.courseSteps.findIndex((c,i) => (c.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO || c.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO))
    if(found === -1) {
      return true
    } else {
      return false
    }
  }

  openQuizBuilder = (idx) => {
    let { customCourse } = this.props
    let editStep = cloneDeep(customCourse.courseSteps[idx])
    
    // this check is required to handle previous quiz steps(Before we introduce QuizBuilder)
    if(!!editStep.step_quiz === true)
      this.props._openQuizBuilder(idx, editStep.step_quiz)
  }

  render() {
    let { openTaskActivity, selectedTaskActivity } = this.state
    let { customCourse, stepReqError, c_type, _update_course, formValues, handleChange } = this.props
    let errorCls = stepReqError? 'tsz-border-invalid' : ''
    return (
      <Row id="courseSteps">
        <Col>
          <div className="heading-row gray-bg d-flex mb-5">
              <Col xl="9" lg="9" md="7" sm="12">
              <span>Course Steps</span>
              </Col>

              <Col xl="3" lg="3" md="5" sm="12" className="px-0">
                <div className="d-flex align-items-center course-step-header">
                  <div className="d-flex checkbox-theme">
                      <Input 
                          id="stepsInOrder" 
                          className="styled" 
                          type="checkbox"
                          name="c_is_steps_ordered"
                          checked={formValues.c_is_steps_ordered}
                          onChange={handleChange}
                          // onChange={(e)=>_update_course({isStepInOrder: e.target.checked})} 
                      />
                      <Label for="stepsInOrder" className="arrow-label">Steps must be completed in order</Label>
                  </div>
                </div> 
              </Col>
          </div>

          {
              customCourse.courseSteps.map((stepData, index) => {
                if(stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO || stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO || stepData.step_type === custCourseStepTypeConstant.ACTIVITY ) {
                  return (
                    <Col key={`step-${index}`} className="step-task-complete">
                      <Row className="course-steps mb-5 pt-4">
                          <Col xs="12" className={"px-4"}>
                            <img className={"ts-icon icon-check"} src={step}/>
                            <span className="pl-2">{`Step ${index+1}`}</span>
                          </Col>
                          <Col xs="12" className={"px-4 my-3 task-comp-content"}>
                            <img className={"ts-icon icon-int-content pb-2"} src={getTypeIcon(stepData.step_type)} />
                            { (stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO) &&
                            <p>Enter URL for your demo and submit for review </p>
                            }
                            { (stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO) &&
                            <p>Record and submit your pitch for review (2 min max) </p>
                            }
                            { (stepData.step_type === custCourseStepTypeConstant.ACTIVITY) &&
                            <p>Enter link to your finished assignment and submit for review </p>
                            }
                          </Col>
                          <Col xs="12" className={"px-4 pt-2 pb-4 mt-2 course-link"}>
                            <Row>
                            <Col md="8">
                              
                            </Col>
                            <Col sm="4">
                              <div className="action-btn pull-right">
                                <Button className="btn-theme-outline" onClick={() => this.deleteStep(index)}>Delete Step</Button>
                              </div>
                            </Col>
                            </Row>
                          </Col>
                      </Row>
                    </Col>    
                  )
                }
                return (
                <Col key={`step-${index}`}>
                  <Row className="course-steps mb-5 pt-4">
                      <Col xs="12" className={"px-4"}>
                        <img className={"ts-icon icon-check"} src={step}/>
                        <span className="pl-2">{`Step ${index+1}`}</span>
                      </Col>
                      <Col xs="12" className={"px-4 my-3"}>
                        <FormGroup className={"mb-0"}>
                          <Input 
                              type="text" 
                              placeholder={stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ? "Pick a title for the quiz you want the learner to take. You can use this form as course feedback collection as well" : "Course step title" }
                              name="step_title"
                              value={stepData.step_title}
                              onChange={(e) => this.handleChange(e, index)}
                              invalid={stepData.error && !!stepData.error.title}
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="12" className={"px-4 pt-2 pb-4 mt-2 course-link"}>
                        <Row>
                        <Col md="8">
                          <img className={"ts-icon icon-int-content pb-2"} src={getTypeIcon(stepData.step_type)} />
                          {stepData.step_type === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ ?
                          <FormGroup className={classnames({"mb-0 step-link-wrapper": true, "tsz-border-invalid": stepData.error && !!stepData.error.quiz})}>
                            <span className="quiz-link" onClick={()=>this.openQuizBuilder(index)} >Open Quiz Builder</span>
                          </FormGroup>
                          :
                          <FormGroup className={"mb-0 step-link-wrapper"}>
                            <Input 
                                type="text" 
                                placeholder={this.getTypePlaceholder(stepData.step_type)}
                                name="step_link"
                                value={stepData.step_link}
                                onBlur={(e) => this.handleBlur(e, index)}
                                onChange={(e) => this.handleChange(e, index)}
                                invalid={stepData.error && !!stepData.error.link}
                            />
                            {stepData.error && stepData.error.link &&
                              <FormFeedback>{stepData.error.link}</FormFeedback>
                            }
                          </FormGroup>
                          }
                        </Col>
                        <Col sm="4">
                          <div className="action-btn pull-right">
                            <Button className="btn-theme-outline" onClick={() => this.deleteStep(index)}>Delete Step</Button>
                          </div>
                        </Col>
                        </Row>
                      </Col>
                  </Row>
                </Col>
              )})
          }

          <div className={`mb-5 add-steps p-2 d-flex align-items-center ${errorCls}`}>
              <div className="pl-2 pr-2 flex-fill add-label">
              + Add step:
              </div>

              <div className="pl-2 pr-2 flex-fill internal-content">
              <img className={"ts-icon icon-int-content"} src={doc} />
              <Button color="link" className="pl-3" onClick={() =>this.addStep(custCourseStepTypeConstant.INTERNAL_CONTENT)}>Internal Content</Button>
              </div>

              <div className="pl-2 pr-2 flex-fill external-content">
                  <img className={"ts-icon icon-ext-content"} src={link} />
                  <Button color="link" className="pl-3" onClick={() =>this.addStep(custCourseStepTypeConstant.EXTERNAL_CONTENT)}>External Content</Button>
              </div>

              <div className="pl-2 pr-2 flex-fill activity">
                  <img className={"ts-icon icon-activity"} src={activity} />
                  <Button color="link" className="pl-3" onClick={() =>this.pickActivity()}>Task to complete</Button>
                  {/* {c_type.name === 'LEARNING_PATH' &&
                    <Button color="link" className="pl-3" onClick={() =>this.addStep(custCourseStepTypeConstant.ACTIVITY)}>Activity</Button>
                  }
                  {c_type.name === 'SALES_ENGINEERING_TRAINING' &&
                    <Button color="link" className="pl-3" onClick={() =>this.pickActivity()}>Task to complete</Button>
                  }
                  {c_type.name === 'SALES_REP_TRAINING' &&
                    <Button color="link" className="pl-3" onClick={() =>this.pickActivity()}>Task to complete</Button>
                  } */}
              </div>

          </div>
          
          { openTaskActivity &&
            <div className="task-complete-options">
            <Col>
              <Row className="course-steps mb-5 pt-4">
                  <Col xs="12" className={"px-4"}>
                    <img className={"ts-icon icon-check"} src={step}/>
                    <span className="pl-2">{`Step ${customCourse.courseSteps.length+1}`}</span>
                  </Col>
                  <Col xs="12" className={"px-4 my-3"}>
                    <p>Pick an activity from the list - select only one</p>
                    <div className="pl-4">
                      { c_type.name === 'SALES_REP_TRAINING' &&
                      <div className="radio-quote">
                        <Input 
                          id="recordPitch" 
                          className="styled" 
                          type="radio" 
                          name={"completeTaskStep"}
                          value={custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO} 
                          onChange={this.onChangeActivityType}
                          checked={(selectedTaskActivity === custCourseStepTypeConstant.TASKTOCOMPLETE_RECORDEDVIDEO)} />
                        <Label for={'recordPitch'} className="arrow-label">Record and submit your pitch for review (2 min max)</Label>
                      </div>
                      }
                      { c_type.name === 'SALES_ENGINEERING_TRAINING' &&
                      <div className="radio-quote">
                        <Input 
                          id="pitchLink" 
                          className="styled" 
                          type="radio" 
                          name={"completeTaskStep"}
                          value={custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO} 
                          onChange={this.onChangeActivityType}
                          checked={(selectedTaskActivity === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO)} />
                        <Label for={'pitchLink'} className="arrow-label">Enter URL for your demo video and submit for review</Label>
                      </div>
                      }
                      { c_type.name === 'LEARNING_PATH' &&
                      <div className="radio-quote">
                        <Input 
                          id="assgLink"
                          className="styled" 
                          type="radio" 
                          name={"completeTaskStep"}
                          value={custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO} 
                          onChange={this.onChangeActivityType}
                          checked={(selectedTaskActivity === custCourseStepTypeConstant.TASKTOCOMPLETE_VIDEO)} />
                        <Label for={'assgLink'} className="arrow-label">Enter link to your finished assignment and submit for review</Label>
                      </div>
                      }
                      <div className="radio-quote">
                        <Input 
                          id="quiz" 
                          className="styled" 
                          type="radio" 
                          name={"completeTaskStep"} 
                          value={custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ} 
                          onChange={this.onChangeActivityType}
                          checked={(selectedTaskActivity === custCourseStepTypeConstant.TASKTOCOMPLETE_QUIZ)} />
                        <Label for={'quiz'} className="arrow-label">Quiz and/or course feedback</Label>
                      </div>
                    </div>
                  </Col>
                  <Col xs="12" className={"px-4 pt-2 pb-4 mt-2 course-link"}>
                    <div className="action-btn pull-right">
                      <Button className="btn-theme-outline" onClick={() => this.addTaskActivity()}>Add Step</Button>
                    </div>
                  </Col>
                </Row>
              </Col>
          </div>
        }
      </Col>
    </Row>
    )
  }
}

const mapStateToProps = ({ customCourse }) => ({
  customCourse
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _add_course_step    : add_course_step,
      _delete_course_step : delete_course_step,
      _edit_course_step   : edit_course_step,
      _update_course      : update_course,
      _openQuizBuilder    : openQuizBuilder,
      _closeQuizBuilder   : closeQuizBuilder
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseSteps)