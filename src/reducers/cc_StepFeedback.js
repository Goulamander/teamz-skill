import { feedbackConstant } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  feedbackRequested: [],
  feedbackForMe: [],
  feedbackRequestError: null,
  feedbackForMeError: null,
  feedbackSaveError: null 
};

export default (state = initialState, action) => {
  switch (action.type) {

    case feedbackConstant.GETTING_FEEDBACK_REQUESTED:
    case feedbackConstant.GETTING_FEEDBACK_FOR_ME:
    case feedbackConstant.SAVING_FEEDBACK:
      return {
        ...state,
        isLoading: true
      }

    case feedbackConstant.GET_FEEDBACK_REQUESTED_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedbackRequested: action.payload,
        feedbackRequestError: null
      }
    
    case feedbackConstant.GET_FEEDBACK_REQUESTED_FAIL:
      return {
        ...state,
        isLoading: false,
        feedbackRequested: [],
        feedbackRequestError: action.payload
      }
    
    case feedbackConstant.GET_FEEDBACK_FOR_ME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedbackForMe: action.payload,
        feedbackForMeError: null
      }
    
    case feedbackConstant.GET_FEEDBACK_FOR_ME_FAIL:
      return {
        ...state,
        isLoading: false,
        feedbackForMe: [],
        feedbackForMeError: action.payload
      }

    case feedbackConstant.SAVE_FEEDBACK_SUCESS:
      return {
        ...state,
        isLoading: false,
        feedbackSaveError: null
      }

    case feedbackConstant.SAVE_FEEDBACK_FAIL:
      return {
        ...state,
        isLoading: false,
        feedbackSaveError: action.payload
      }

    default:
      return state   
  }
};
