import cloneDeep from 'clone-deep'

import { customCoursesConstants } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  error: '',
  assignedRole: 1,
  tag: 0,
  courseSteps: []
}

export default (state = cloneDeep(initialState), action) => {
  switch (action.type) {

    case customCoursesConstants.UPDATE_STEP:
      return {
        ...state,
        courseSteps: [...action.payload]
      }

    case customCoursesConstants.ADD_STEP:
      return {
        ...state,
        courseSteps: [...state.courseSteps, action.payload]
      }
    
    case customCoursesConstants.DELETE_STEP:
      return {
        ...state,
        courseSteps: [
          ...state.courseSteps.slice(0, action.stepIndex), 
          ...state.courseSteps.slice(action.stepIndex + 1)]
      }
    
    case customCoursesConstants.EDIT_STEP:
      return {
        ...state,
        courseSteps: [
          ...state.courseSteps.slice(0, action.stepIndex), 
          action.payload,
          ...state.courseSteps.slice(action.stepIndex + 1)]
      }

    case customCoursesConstants.UPDATE_COURSE:
      return {
        ...state,
        ...action.payload
      }
    
    case customCoursesConstants.SAVING_COURSE:
      return {
        ...state,
        isLoading: true
      }

    case customCoursesConstants.SAVE_COURSE_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
  
    case customCoursesConstants.SAVE_COURSE_FAIL:
      return {
        ...state,
        isLoading: false
      }

    case customCoursesConstants.RESET_CUSTOM_COURSE:
      return {
        ...initialState
      }

    default: 
      return state
  }
}