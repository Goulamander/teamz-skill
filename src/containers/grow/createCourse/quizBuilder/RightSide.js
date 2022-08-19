import React, { useState, useReducer } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row , Col, ListGroup, Input, Label} from 'reactstrap'
import StarRatingComponent from 'react-star-rating-component'
import classnames from 'classnames'
import cloneDeep from 'clone-deep'

import {
  toggleQuizBuilderPreviewMode,
  closeQuizBuilder,
  setActiveQues
} from '../../../../actions/quizBuilder'
import {
  edit_course_step
} from '../../../../actions/customCourse'
import { QuizQuesTypesKey } from '../../../../constants/appConstants'
import Dropdown from '../../../../component/Dropdown'
import prevIcon from '../../../../assets/img/quiz/prev-icon.png'
import upIcon from '../../../../assets/img/quiz/up-icon.png'
import downIcon from '../../../../assets/img/quiz/down-icon.png'
import crossIcon from '../../../../assets/img/quiz/cross-icon.png'
import ColorDropdown from '../../../../component/ColorDropdown'

const RightSide = (props) => {
  
  let currentQues = props.currentQuesId===null? props.welcome_text : props.data[props.currentQuesId]

  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const goBack = () => {

    if (props.validator.allValid()) {
      let editStep = cloneDeep(props.customCourse.courseSteps[props.stepIndex])
      editStep.step_quiz.questions = cloneDeep(props.data)
      editStep.step_quiz.welcome_text = props.welcome_text
      props._edit_course_step(props.stepIndex, editStep)

      props._closeQuizBuilder()
    } else {
      props.validator.showMessages();
      // rerender to show messages for the first time
      forceUpdate();
    }
  }
  
  const prevQues = () => {
    if(!(props.currentQuesId > 0)) return false
    props._setActiveQues(props.currentQuesId-1)
  }

  const nextQues = () => {
    if(!(props.currentQuesId < props.data.length-1)) return false
    props._setActiveQues(props.currentQuesId+1)
  }

  const enterQuiz = () => {
    if(props.data.length>0) {
      props._setActiveQues(0)
    }
  }

  const renderQuesOption = () => {
    let optionHtml = null
    switch(currentQues.question_type) {
      case QuizQuesTypesKey.RATING:
        optionHtml = ratingOption()
        break;
      case QuizQuesTypesKey.MULTIPLE_CHOICE:
        optionHtml = multipleOption()
        break;
      case QuizQuesTypesKey.CHECKBOXES:
        optionHtml = checkboxOption()
        break;
      case QuizQuesTypesKey.DROPDOWN:
        optionHtml = dropboxOption()
        break;
    }
    return optionHtml;
  }

  const multipleOption = () => {
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} className="styled" type="checkbox" />
                  <Label for={`chkbx-${i}`} className="arrow-label">{op.option_title || '...'}</Label>
                </li>
              )
            })
          }
        </ListGroup>
      </div>
    )
  }

  const checkboxOption = () => {
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} name="q-checkbox" className="styled" type="radio" />
                  <Label for={`chkbx-${i}`} className="arrow-label">{op.option_title || '...'}</Label>
                </li>
              )
            })
          }
        </ListGroup>
      </div>
    )
  }

  const dropboxOption = () => {
    return(
      <div>
        <ColorDropdown placeholder="Select option from dropdown" data={currentQues.options} _onChange={(item)=>{console.log(item)}} />
      </div>
    )
  }

  const ratingOption = () => {
    return(
      <div>
        <StarRatingComponent 
          name="quiz-rating"
          starColor="#ff824e"
          emptyStarColor="#8494a5"
          starCount={5}
          editing={true}
        />
      </div>
    )
  }

  return(
    <Row id="formPreview">
      <Col className="p-0 d-flex flex-column">

      {(props.data.length > 0 || currentQues != null) ?
      <>
      <Row>
        <Col>
          <div className="px-3 clearfix">
            {props.isPreviewMode?
              <div className="phd">
                <div className="icon-btn bck-btn" onClick={goBack} >
                  <img src={downIcon} alt="<" />
                  <span>Back to create course</span>
                </div>
                <div className="d-flex pull-right" >
                  <div className="icon-btn">
                    <img src={crossIcon} alt="<" onClick={props._toggleQuizBuilderPreviewMode} />
                  </div>
                </div>
              </div>
            :
              <div className="d-flex pull-right" >
                <div className="icon-btn">
                  <img src={prevIcon} alt="<" onClick={props._toggleQuizBuilderPreviewMode} />
                </div>
                {/* <div className="btn btn-theme">Save</div> */}
              </div>
            }
          </div>
        </Col>
      </Row>

      
      <Row className="ques-prev-wrapper my-2">
        <Col>
          <div className="ques-prev-content">
            {props.currentQuesId===null ?
              <div>
                <p className="ques-txt">{currentQues}</p>
              </div>
            :
              <div>
                { currentQues.question_type === QuizQuesTypesKey.RATING ? 
                  <p className="ques-txt">{`Q${props.currentQuesId+1}. Rate the course`}</p>  :
                  <p className="ques-txt">{`Q${props.currentQuesId+1}. ${currentQues.ques}`}</p>
                }
                {
                  renderQuesOption()
                }
                {(props.isPreviewMode && showSubmitBtn) &&
                  <div className="btn btn-theme mt-5">Submit</div>
                }
              </div>
            }
          </div>
        </Col>
      </Row>

      <Row className="ques-controls-wrapper">
        <Col>
          <div className="clearfix">
            <div className="pull-right d-flex">
              {props.currentQuesId===null? 
              <div className="icon-btn">
                <div className="btn btn-theme mr-5" onClick={enterQuiz}>Start</div>
              </div>
              :
              <>
                {(props.isPreviewMode && showSubmitBtn)?
                  <div className="icon-btn">
                    <img src={upIcon} alt="up" onClick={()=> setShowSubmitBtn(false)} />
                  </div>
                :
                  <div className="icon-btn">
                    <img src={upIcon} alt="up" onClick={prevQues} className={classnames({'deactive': (!(props.currentQuesId > 0))})} />
                  </div>
                }
                {(props.isPreviewMode && props.currentQuesId === props.data.length-1)?
                  <div className="icon-btn">
                    <img src={downIcon} alt="down" onClick={()=>setShowSubmitBtn(true)} className={classnames({'deactive': showSubmitBtn})} />
                  </div>
                :
                  <div className="icon-btn">
                    <img src={downIcon} alt="down" onClick={nextQues} className={classnames({'deactive': (!(props.currentQuesId < props.data.length-1))})} />
                  </div>
                }
              </>
            }
            </div>
          </div>
        </Col>
      </Row>
      </>
      :
      <Row>
        <Col>
          <EmptyPrevArea />
        </Col>
      </Row>
      }
      </Col>
    </Row>
  )
}

const mapStateToProps = ({ quizBuilder, customCourse }) => ({
  ...quizBuilder,
  customCourse
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      _toggleQuizBuilderPreviewMode   : toggleQuizBuilderPreviewMode,
      _closeQuizBuilder               : closeQuizBuilder,
      _setActiveQues                  : setActiveQues,

      _edit_course_step   : edit_course_step
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSide)


const EmptyPrevArea = () => (
  <div id="empty-prev-sec" className="w-100 pt-5">
    <div className="empty-bar w-60"></div>
    <div className="empty-bar w-60"></div>
    <div className="empty-bar w-40"></div>
  </div>
)