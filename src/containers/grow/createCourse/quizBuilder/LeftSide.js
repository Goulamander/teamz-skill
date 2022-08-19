import React, {useState, useEffect, useReducer} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row , Col} from 'reactstrap'
import classnames from 'classnames'
import cloneDeep from 'clone-deep'

import SelectBox from '../../../../component/selectBox'
import {
  closeQuizBuilder,
  setActiveQues,
  addQues,
  editQues,
  deleteQues,
  addWelcomeTxt,
  editWelcomeTxt,
  delWelcomeTxt,
  addQuesOption,
  editQuesOption,
  delQuesOption
} from '../../../../actions/quizBuilder'
import {
  edit_course_step
} from '../../../../actions/customCourse'
import { QuizQuesTypes, QuizQuesTypesKey } from '../../../../constants/appConstants'
import backIcon from '../../../../assets/img/backward-arrow.png'
import addIcon from '../../../../assets/img/add-icon.png'
import welTxtIcon from '../../../../assets/img/quiz/free-text-icon.png'
import multIcon from '../../../../assets/img/quiz/multi-select-icon.png'
import chkbxIcon from '../../../../assets/img/quiz/checkbox-icon.png'
import dropdownIcon from '../../../../assets/img/quiz/dropdown-icon.png'
import ratingIcon from '../../../../assets/img/quiz/rating-icon.png'
import delIcon from '../../../../assets/img/quiz/del-icon.png'
import plusIcon from '../../../../assets/img/quiz/plus-icon.png'
import minusIcon from '../../../../assets/img/quiz/minus-icon.png'

const LeftSide = (props) => {

  const [toggleQTypeSB, setToggleQTypeSB] = useState(false)
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

  // const forceUpdate = useForceUpdate();

  useEffect(()=>{
    console.log("re-render")
  })

  const toggleQuesType = () => {
    setToggleQTypeSB(!toggleQTypeSB)
  }

  const setActiveQues = (e, idx) => {
    e.stopPropagation();
    props._setActiveQues(idx)
  }

  const delQues = (e, idx, ques) => {
    e.stopPropagation();
    let newCurIdx = idx <= props.currentQuesId? (idx === 0? 0 : idx-1) : props.currentQuesId
    props._deleteQues(idx, newCurIdx, ques)
  }

  const addNewQues = (type) => {
    setToggleQTypeSB(!toggleQTypeSB)
    let newQuesObj = {}

    // welcome text check
    if(type.key === QuizQuesTypesKey.WELCOME_TEXT) {
      if(props.welcome_text === null)
        props._addWelcomeTxt()
      else 
        props._setActiveQues(null)
      
      return
    }

    switch(type.key){
      case QuizQuesTypesKey.MULTIPLE_CHOICE:
      case QuizQuesTypesKey.DROPDOWN:
      case QuizQuesTypesKey.CHECKBOXES:
        newQuesObj = {
          question_type: type.key,
          ques: '',
          options: [
            {
              option_title: '',
              option_value: '',
              is_correct: false
            }
          ]
        }
        break;
      case QuizQuesTypesKey.RATING:
        newQuesObj = {
          question_type: type.key,
          ques: '',
        }
        break;
    }
    props._addQues(newQuesObj)
  }

  const editWelcomeText = (e) => {
    const {value} = e.target
    props._editWelcomeTxt(value)
  }

  const delWelcomeText = () => {
    props._delWelcomeTxt()
  }

  const onQuesChange = (e) => {
    let {name, value} = e.target
    let currentQues = props.data[props.currentQuesId]
    currentQues[name] = value
    props._editQues(currentQues)
  }

  const addOption = (e, idx, qIdx) => {
    if(qIdx !== props.currentQuesId) return false

    e.stopPropagation()

    // add option
    let newOption = {
      option_title: '',
      option_value: '',
      is_correct: false
    }
    props._addQuesOption(newOption, idx)
  }

  const delOption = (e, idx, qIdx) => {
    if(qIdx !== props.currentQuesId) return false

    e.stopPropagation()
    props._delQuesOption(idx)
  }

  const onChangeOption = (e, idx, qIdx) => {
    if(qIdx !== props.currentQuesId) return false
    e.stopPropagation()
    let {name, value, checked} = e.target
    let currentOpt = props.data[qIdx].options[idx]
    let quesType = e.target.getAttribute('data-q-type') || ''
    currentOpt[name] = value
    if(name === 'is_correct') {
      if(quesType != QuizQuesTypesKey.MULTIPLE_CHOICE){
        if(checked) {
          props.data[qIdx].options.map(o => o.is_correct = false)
        }
      }
      currentOpt[name] = checked
    }
    props._editQuesOption(currentOpt, idx)
  }

  const getQuesIcon = (type) => {
    let icon = multIcon;
    switch(type) {
      case QuizQuesTypesKey.MULTIPLE_CHOICE:
        icon= multIcon
        break;
      case QuizQuesTypesKey.CHECKBOXES:
        icon= chkbxIcon
        break;
      case QuizQuesTypesKey.DROPDOWN:
        icon= dropdownIcon
        break;
      case QuizQuesTypesKey.WELCOME_TEXT:
        icon= welTxtIcon
        break;
      case QuizQuesTypesKey.RATING:
        icon= ratingIcon
        break;
    }
    return icon
  }

  const renderQuesOption = (ques, index, isEdit) => {
    let optionsHTML = null
        
    switch(ques.question_type) {
      case QuizQuesTypesKey.MULTIPLE_CHOICE:
      case QuizQuesTypesKey.CHECKBOXES:
      case QuizQuesTypesKey.DROPDOWN:
        optionsHTML = choiceOptions(ques, index)
        break;
    }
    return optionsHTML;
  }

  const choiceOptions = (ques, index) => {
    return (
      <div className="options-wrapper">
        <div className="d-flex">
          <div>Options</div>
          <div>Value</div>
          <div>Correct</div>
          <div></div>
          <div></div>
        </div>
        {ques.options.map((option, i) => {
          return (
            <div key={`opt${i}`} className="d-flex">
              <div>
                <input className="q-input" type="text" name={`option_title`} placeholder={`option ${i+1}`} value={option.option_title} onChange={(e)=>{onChangeOption(e, i, index)}} />
                {/**********   This is where the magic happens     ***********/}
                {props.validator.message(`opt${i}`, option.option_title, 'required')} 

              </div>
              <div>
                <input className="q-input" type="number" name={`option_value`} value={option.option_value} onChange={(e)=>{onChangeOption(e, i, index)}} />
                {/**********   This is where the magic happens     ***********/}
                {props.validator.message(`optVal${i}`, option.option_value, 'required')} 
              </div>
              <div className="text-center"><input className="q-input" type="checkbox" name="is_correct" checked={option.is_correct} data-q-type={ques.question_type} onChange={(e)=>{onChangeOption(e, i, index)}} /></div>
              <div>
                <span onClick={(e) => addOption(e, i, index)} className="icon-btn iconplus" ><img className="m-auto" src={plusIcon} alt="+" /></span>
              </div>
              <div>
                {i > 0 &&
                  <span onClick={(e) => delOption(e, i, index)} className="icon-btn iconplus" ><img className="m-auto" src={minusIcon} alt="+" /></span>
                }
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return(
    <Row id="formBuilder">
      <Col className="p-0">

        <Row>
          <Col>
            <div className="px-3 clearfix">
              <div className="pull-right icon-btn" onClick={goBack} >
                <img src={backIcon} alt="<" />
                <span>Back to create course</span>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="questions-wrapper my-2">
          <Col>
            {/* Welcome text if any */}
            { props.welcome_text != null &&
            <div className={classnames({'q-wrapper': true, 'active': props.currentQuesId===null })} onClick={(e)=>setActiveQues(e, null)}>
              <div className="d-flex">
                <div className="icon-btn ques-type-icon">
                  <img src={welTxtIcon} className="" />
                </div>
                <div className="d-f-1">
                  <textarea 
                    name="welcome_text"
                    onChange={editWelcomeText}
                    placeholder={'Type welcome statement here ...'}
                    className="inputarea"
                    disabled={props.currentQuesId!==null}
                    value={props.welcome_text}
                  />
                </div>
              </div>
              <div className="rt-sec clearfix">
                <div className="q-del-icon pull-right" onClick={delWelcomeText}>
                  <img src={delIcon} className="" />
                </div>
              </div>
            </div>
            }
            {
              props.data.map((ques, index) => {
                let isEdit = index === props.currentQuesId
                let placeholderTxt = 'Type your question here ...'
                return (
                  <div key={`q-${index}`} className={classnames({'q-wrapper': true, 'active': isEdit})} onClick={(e)=>setActiveQues(e, index)}>
                    <div className="d-flex">
                      <div className="icon-btn ques-type-icon">
                        <img src={getQuesIcon(ques.question_type)} className="" />
                      </div>
                      <div className="d-f-1">
                        {
                          ques.question_type === QuizQuesTypesKey.RATING ? 'Rate the course' :
                          <>
                            <textarea 
                              name="ques"
                              onChange={onQuesChange}
                              placeholder={placeholderTxt}
                              className="inputarea"
                              disabled={!isEdit}
                              value={ques.ques}
                            />
                            {props.validator.message(`Ques-${index+1}`, ques.ques, 'required')}
                            {
                              renderQuesOption(ques, index)
                            }
                          </>
                        }
                        {/* <QuesOptions ques={ques} index={index} {...props} /> */}
                      </div>
                    </div>
                    <div className="rt-sec clearfix">
                      <div className="q-del-icon pull-right" onClick={(e)=>delQues(e, index, ques)}>
                        <img src={delIcon} className="" />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="px-3">
              <div className="add-ques icon-btn my-4" onClick={toggleQuesType} >
                <img src={addIcon} alt="<" />
                {(props.data.length > 0)? 
                  <span>Add new question</span>
                :
                  <span>Add your first question here</span>
                }
              </div>
              {toggleQTypeSB && 
                <Col className="mb-5">
                  <SelectBox options={QuizQuesTypes} onChange={addNewQues} isRatingQueGenerate={props.isRatingQueGenerate} />
                </Col>
              }
            </div>
          </Col>
        </Row>

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
      _closeQuizBuilder   : closeQuizBuilder,
      _setActiveQues      : setActiveQues,
      _addQues            : addQues,
      _editQues           : editQues,
      _deleteQues         : deleteQues,
      _addWelcomeTxt      : addWelcomeTxt,
      _editWelcomeTxt     : editWelcomeTxt,
      _delWelcomeTxt      : delWelcomeTxt,
      _addQuesOption      : addQuesOption,
      _editQuesOption     : editQuesOption,
      _delQuesOption      : delQuesOption,

      _edit_course_step   : edit_course_step
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSide)
