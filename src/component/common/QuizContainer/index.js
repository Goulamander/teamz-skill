import React, {useState, useEffect} from 'react'
import {Row, Col} from 'reactstrap'

import './scss/style.scss'
import Quiz from './Quiz'
import {
  get_custom_course_quiz_answers,
  save_custom_course_quiz_answers
} from '../../../actions/customCourse'
import {
  decodeQuizAnswers,
  encodeQuizAnswers
} from '../../../transforms'
import { Loader } from '../../Loader'
import { QUIZ_STATUSES, QuizQuesTypesKey } from '../../../constants/appConstants'



const QuizContainer = (props) => {
  let {step_title, is_quiz_started, _reloadData, c_id, step_id, quiz_result, quiz_attempts} = props
  let {questions, welcome_text} = props.step_quiz  
  let welcome_mes = (!!welcome_text === true)? welcome_text : step_title

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  let [isLoading, setIsLoading] = useState(false)
  const [isOnlyRatingQues, setIsOnlyRatingQues] = useState(false)
  const [answers, setAnswers] = useState([])

  // componentDidMount hook replacement
  useEffect(() => {
    if(is_quiz_started === QUIZ_STATUSES.STARTED) {

      // call to get answer list
      getQuizAnswers()
    }
    if(is_quiz_started === QUIZ_STATUSES.COMPLETED) {
      showRatingQuestionUI();
    }
  }, [])

  useEffect(() => {
    // console.log("isqizStarted", props.is_quiz_started);
    if(props.is_quiz_started === QUIZ_STATUSES.COMPLETED){
      setShowWelcomeScreen(true);
      getQuizAnswers();
      showRatingQuestionUI();
    }

  }, [props.is_quiz_started, props.quiz_attempts])

  useEffect(() => {
    setShowWelcomeScreen(true)
    getQuizAnswers();
    if(props.is_quiz_started === QUIZ_STATUSES.COMPLETED){
      showRatingQuestionUI();
    }
  }, [props.step_id])

  const showRatingQuestionUI = () => {
    if(questions.length === 1 && questions[0].question_type === QuizQuesTypesKey.RATING) {
      setIsOnlyRatingQues(true)
    } else {
      setIsOnlyRatingQues(false)
    }
  }

  const getQuizAnswers = () => {

    if(!!c_id === true && !!step_id === true){
      setIsLoading(true)
      get_custom_course_quiz_answers(c_id, step_id, handleQAResponse)
    }
  }

  const handleQAResponse = (res) => {

    if(res.success) {
      if(res.result.length > 0){
        let newAns = decodeQuizAnswers(res.result)
        console.log(newAns)
        setAnswers([...newAns])
      } else {
        setAnswers([])
      }
    }
    setIsLoading(false)
  }

  const saveQuiz = (ansArr) => {
    let data = {
      c_id: c_id,
      step_id: step_id,
      quiz_status: QUIZ_STATUSES.STARTED,
      answers: encodeQuizAnswers(ansArr)
    }
    
    setIsLoading(true)
    save_custom_course_quiz_answers(data, (res) => {
      console.log("save_custom_course_quiz_answers response", res)
      setIsLoading(false)
    })
  }

  const submitQuiz = (ansArr) => {
    let data = {
      c_id: c_id,
      step_id: step_id,
      quiz_status: QUIZ_STATUSES.COMPLETED,
      answers: encodeQuizAnswers(ansArr)
    }

    setIsLoading(true)
    save_custom_course_quiz_answers(data, (res) => {
      // callback parent component to reload data
      if(res.success){
        _reloadData()
      }
      setIsLoading(false)
    })
  }

  return(
    <Row id="qContainer">
      <Col>

        {showWelcomeScreen && is_quiz_started === QUIZ_STATUSES.COMPLETED ?
          isOnlyRatingQues ? <div className="welcome-screen"><p>{'Thank you for submitting your feedback'}</p></div> : 
          (
          <div className="welcome-screen">
            <div className="px-5 text-left">
              {quiz_result >= 80 ?
                <>
                  <p>{`Congratulations! You have passed the quiz.`}</p>
                  <p>Your score is <span className="score-pass">{`${quiz_result}%`}</span>.</p>
                  <p>{`You can click Review Quiz to review the correct answers - but can not retake the Quiz.`}</p>
                </>
              :(quiz_result >= 50  ?
                quiz_attempts < 3 ?
                  <>
                    <p>Your score is <span className="score-medium">{`${quiz_result}%`}</span>.</p>
                    <p>You need 80% to pass the quiz.</p>
                    <div className="icon-btn">
                      <div className="btn btn-theme mt-3" onClick={()=>setShowWelcomeScreen(false)}>Re-take the Quiz</div>
                    </div>
                  </> : 
                   <>
                   <p>Your score is <span className="score-medium">{`${quiz_result}%`}</span>.</p>
                   <p>You have exceeded maximum number of attempts.</p>
                  </>
                :
                quiz_attempts < 3 ?
                <>
                  <p>Your score is <span className="score-fail">{`${quiz_result}%`}</span>.</p>
                  <p>You need 80% to pass the quiz.</p>
                  <div className="icon-btn">
                    <div className="btn btn-theme mt-3" onClick={()=>setShowWelcomeScreen(false)}>Re-take the Quiz</div>
                  </div>
                </> :
                <>
                  <p>Your score is <span className="score-fail">{`${quiz_result}%`}</span>.</p>
                  <p>Course assigner will contact you regarding next steps.</p>
                </>
              )
              }
            </div>
            {quiz_result >= 80 &&
              <div className="icon-btn">
                <div className="btn btn-theme mt-5" onClick={()=>setShowWelcomeScreen(false)}>Review Quiz</div>
              </div>
            }
          </div>
          )
        :
        (
          (showWelcomeScreen && is_quiz_started === QUIZ_STATUSES.UNSTARTED)?
            <div className="welcome-screen">
                <p>{welcome_mes}</p>
                <div className="icon-btn">
                  <div className="btn btn-theme mt-5" onClick={()=>setShowWelcomeScreen(false)}>Start</div>
                </div>
            </div>
          :
            questions.length>0 ? 
              <Quiz 
                data={questions} 
                answers={answers}
                questionIndex={0} 
                quiz_status={is_quiz_started}
                read_mode={is_quiz_started === QUIZ_STATUSES.COMPLETED && (quiz_attempts >= 3 || quiz_result >= 80 )}
                onSave={saveQuiz}
                onSubmit={submitQuiz}
              /> 
              : null
        )
        }
        {isLoading &&
          <Loader isLoading={isLoading} />
        }
      </Col>
    </Row>
  )
}

export default QuizContainer