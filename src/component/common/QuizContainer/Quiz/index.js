import React, {useState, useEffect} from 'react'
import { Row , Col, ListGroup, Input, Label} from 'reactstrap'
import StarRatingComponent from 'react-star-rating-component'
import classnames from 'classnames'
import cloneDeep from 'clone-deep'

import { QuizQuesTypesKey } from '../../../../constants/appConstants'
import Dropdown from '../../../../component/Dropdown'
import ColorDropdown from '../../../../component/ColorDropdown'
import upIcon from '../../../../assets/img/quiz/up-icon.png'
import downIcon from '../../../../assets/img/quiz/down-icon.png'

const Quiz = props => {
  const [currQuesIndex, setCurrQuesIndex] = useState(props.questionIndex)
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [answers, setAnswers] = useState(props.answers)
  const [arr, setArr] = useState([])

  let currentQues = props.data[currQuesIndex]
  
  useEffect(() => {
    setAnswers(props.answers)
  }, [props.answers])

// Common functions
  const getCurrentAnsIndex = () => {
    let _answers = [...answers];
    return _answers.findIndex(a => Number(a.k_id) === currentQues.k_id)
  }

  const prevQues = () => {
    if(!(currQuesIndex > 0)) return false
    setCurrQuesIndex(currQuesIndex-1)
  }

  const nextQues = () => {
    if(!(currQuesIndex < props.data.length-1)) return false
    setCurrQuesIndex(currQuesIndex+1)
  }

// Edit Mode functions
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
    let index = getCurrentAnsIndex()
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              let isChecked = (index !== -1)? answers[index].answer.includes(op.option_key) : false
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} className="styled" type="checkbox" checked={isChecked} onChange={(e)=>onOptionSelect(e, op.option_key)} />
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
    let index = getCurrentAnsIndex()
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              let isChecked = (index !== -1)? answers[index].answer.includes(op.option_key) : false
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} name="q-checkbox" className="styled" type="radio" checked={isChecked} onChange={e => onOptionSelect(e, op.option_key)} />
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
    let index = getCurrentAnsIndex()
    let selectedItem = (index !== -1)? currentQues.options.filter(op=> answers[index].answer.includes(op.option_key))[0] : null

    console.log("selectedItem",selectedItem)
    return(
      <div>
        <ColorDropdown placeholder="Select option from dropdown" data={currentQues.options} selected={selectedItem} _onChange={(item)=>{onOptionSelect({target: {type: "dropdown", checked: false}}, item.option_key)}} />
      </div>
    )
  }

  const ratingOption = () => {
    let index = getCurrentAnsIndex()
    let rating = (index !== -1)? Number(answers[index].answer[0]) : 0
    return(
      <div>
        <StarRatingComponent 
          name="quiz-rating"
          starColor="#ff824e"
          emptyStarColor="#8494a5"
          value={rating}
          starCount={5}
          editing={true}
          onStarClick={(nextValue, prevValue, name) => onOptionSelect({target:{type: "rating", checked: ''}}, nextValue)}
        />
      </div>
    )
  }

  const onOptionSelect = (e, option_key) => {
    const {type, checked} = e.target

    let _answers = [...answers]
    // find ans obj
    let index = getCurrentAnsIndex()
    index = index === -1? _answers.length : index 
    let ansObj = _answers[index]

    if(!!ansObj === false){
      ansObj = {
        k_id: currentQues.k_id,
        ques_type: currentQues.question_type,
        answer: []
      }
    }
    if(type === "radio"){
      if(checked) {
        ansObj.answer = [option_key]
      } else {
        ansObj.answer = []
      }
    } else if(type === "dropdown") {
      ansObj.answer = [option_key]
    } else if(type === "rating") {
      ansObj.answer = [option_key]
    } else{
      if(checked) {
        ansObj.answer.push(option_key) 
      } else {
        ansObj = {...ansObj, answer: ansObj.answer.filter(a=> a !== option_key)}
      }
  }

    // update answers array
    _answers[index] = ansObj
    setAnswers(_answers)
  }

  const saveQuiz = () => {
    // console.log("saveQuiz ", answers)
    if(answers.length > 0 && answers.filter(ans => ans.answer.length>0).length > 0) {
      let _answers = cloneDeep(answers)
      props.onSave(_answers)
    }
  }

  const submitQuiz = () => {
    // console.log("saveQuiz ", answers)
    if(props.data.length === answers.filter(ans => ans.answer.length>0).length) {
      let _answers = cloneDeep(answers)
      props.onSubmit(_answers)
    }
  }

// Read Mode functions
  const renderQuesOptionV2 = () => {
    let optionHtml = null
    switch(currentQues.question_type) {
      case QuizQuesTypesKey.RATING:
        optionHtml = ratingOptionV2()
        break;
      case QuizQuesTypesKey.MULTIPLE_CHOICE:
        optionHtml = multipleOptionV2()
        break;
      case QuizQuesTypesKey.CHECKBOXES:
        optionHtml = checkboxOptionV2()
        break;
      case QuizQuesTypesKey.DROPDOWN:
        optionHtml = dropboxOptionV2()
        break;
    }
    return optionHtml;
  }

  const multipleOptionV2 = () => {
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              let isChecked = (currentQues.answer && currentQues.answer.indexOf(op.option_key) != -1)? true : false
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} className="styled" type="checkbox" readOnly checked={isChecked} />
                  <Label for={`chkbx-${i}`} className={classnames({"arrow-label is-not-correct": true, "is-correct": op.is_correct})}>{op.option_title || '...'}</Label>
                </li>
              )
            })
          }
        </ListGroup>
      </div>
    )
  }

  const checkboxOptionV2 = () => {
    return(
      <div>
        <ListGroup className="checkbox-list">
          {
            currentQues.options.map((op, i) => {
              let isChecked = (currentQues.answer && currentQues.answer.indexOf(op.option_key) != -1)? true : false
              return (
                <li key={i} className="checkbox-theme">
                  <Input id={`chkbx-${i}`} name="q-checkbox" className="styled" type="radio" readOnly checked={isChecked} />
                  <Label for={`chkbx-${i}`} className={classnames({"arrow-label is-not-correct": true, "is-correct": op.is_correct})}>{op.option_title || '...'}</Label>
                </li>
              )
            })
          }
        </ListGroup>
      </div>
    )
  }

  const dropboxOptionV2 = () => {
    let selectedItem = (currentQues.answer)? currentQues.options.filter(op=> currentQues.answer.indexOf(op.option_key) !=  -1 )[0] : null

    selectedItem = selectedItem || null
    
    let is_correct = selectedItem? !!selectedItem.is_correct : false

    return(
      <div className={classnames({"tzs-dd is-not-correct":1,"is-correct":is_correct})}>
        <ColorDropdown placeholder="Select option from dropdown" data={currentQues.options} selected={selectedItem} readMode={true} />
      </div>
    )
  }

  const ratingOptionV2 = () => {
    let rating = (currentQues.answer)? Number(currentQues.answer) : 0
    return(
      <div>
        <StarRatingComponent 
          name="quiz-rating"
          starColor="#ff824e"
          emptyStarColor="#8494a5"
          value={rating}
          starCount={5}
          editing={false}
        />
      </div>
    )
  }

  return (
    <div id="quizForm">
      {/* header */}
      <Row className="quiz-header-wrapper">
        <Col>
          <div className="clearfix">
            <div className="d-flex pull-right" >
              {(!showSubmitBtn && !props.read_mode)?
                <button className="btn btn-theme" disabled={!(answers.length > 0 && answers.filter(ans => ans.answer.length>0).length > 0)} onClick={saveQuiz}>
                  Save
                </button>
                : null
              }
            </div>
          </div>
        </Col>
      </Row>

      {/* content */}
      <Row className="quiz-content-wrapper">
        <Col>
          <div className="ques-content">
            {
              currentQues.question_type === QuizQuesTypesKey.RATING ? <p className="ques-txt">{`Q${currQuesIndex+1}. Rate this course`}</p> : <p className="ques-txt">{`Q${currQuesIndex+1}. ${currentQues.ques}`}</p>
            }
            {props.read_mode?
              renderQuesOptionV2()
              :
              renderQuesOption()
            }
            {(showSubmitBtn && !props.read_mode) &&
              <button className="btn btn-theme mt-5" disabled={( props.data.length !== answers.filter(ans=>ans.answer.length>0).length )} onClick={submitQuiz} >Submit</button>
            }
          </div>
        </Col>
      </Row>

      {/* footer */}
      <Row className="quiz-controls-wrapper">
        <Col>
          <div className="clearfix">
            <div className="pull-right d-flex">
              {(showSubmitBtn && !props.read_mode)?
                <div className="icon-btn mr-2">
                  <img src={upIcon} alt="up" onClick={()=> setShowSubmitBtn(false)} />
                </div>
              :
                <div className="icon-btn mr-2">
                  <img src={upIcon} alt="up" onClick={prevQues} className={classnames({'deactive': (!(currQuesIndex > 0))})} />
                </div>
              }
              {(currQuesIndex === props.data.length-1 && !props.read_mode)?
                <div className="icon-btn">
                  <img src={downIcon} alt="down" onClick={()=>setShowSubmitBtn(true)} className={classnames({'deactive': showSubmitBtn})} />
                </div>
              :
                <div className="icon-btn">
                  <img src={downIcon} alt="down" onClick={nextQues} className={classnames({'deactive': (!(currQuesIndex < props.data.length-1))})} />
                </div>
              }
            </div>
          </div>
        </Col>
      </Row>
      
    </div>
  )
}

export default Quiz