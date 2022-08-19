import { quizBuilderConstant } from '../constants/storeConstants'

export const openQuizBuilder = (index, data) => {
  return dispatch => {
    let welcome_text = !!data.welcome_text === true ? data.welcome_text : null
    dispatch({
      type: quizBuilderConstant.OPEN_Q_BUILDER,
      payload: index,
      welcome_text: welcome_text,
      data: data.questions
    })
  }
}

export const closeQuizBuilder = () => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.CLOSE_Q_BUILDER
    })
  }
}

export const toggleQuizBuilderPreviewMode = () => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.TOGGLE_PREVIEW_MODE
    })
  }
}

export const setActiveQues = (idx) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.SET_ACTIVE_QUES,
      payload: idx
    })
  }
}

export const addWelcomeTxt = () => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.ADD_WELCOME_TEXT
    })
  }
}

export const editWelcomeTxt = (val) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.EDIT_WELCOME_TEXT,
      payload: val
    })
  }
}

export const delWelcomeTxt = () => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.DEL_WELCOME_TEXT
    })
  }
}

export const addQues = (ques) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.ADD_QUES,
      payload: ques
    })
  }
}

export const editQues = (ques) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.EDIT_QUES,
      payload: ques
    })
  }
}

export const deleteQues = (id, currentQuesId, ques) => {
  return dispatch => {

    dispatch({
      type: quizBuilderConstant.DELETE_QUES,
      targetId: id,
      ques: ques,
      currentQuesId 
    })
  }
}

export const addQuesOption = (option, targetId) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.ADD_QUES_OPTION,
      payload: option,
      targetId: targetId
    })
  }
}

export const editQuesOption = (option, targetId) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.EDIT_QUES_OPTION,
      payload: option,
      targetId: targetId
    })
  }
}

export const delQuesOption = (targetId) => {
  return dispatch => {
    dispatch({
      type: quizBuilderConstant.DEL_QUES_OPTION,
      targetId: targetId
    })
  }
}