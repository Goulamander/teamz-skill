import { skillsConstant } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  data: [],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case skillsConstant.GET_SKILLS:
      return {
        ...state,
        isLoading: true
      }
    
    case skillsConstant.GET_SKILLS_SUCCESS:
        return {
          ...state,
          data: action.payload,
          error: null,
          isLoading: false
        }

    case skillsConstant.GET_SKILLS_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    default:
      return state   
  }
};

