import { userConstant } from '../constants/storeConstants'

const resetState = {
  isLoading: false,
  data: {
  },
  error: null
}

const initialState = {
  isLoading: false,
  isEditMode: false,
  data: {
    first_name: '',
    last_name: '',
    job_title: '',
    job_level: '',
    motto:'',
    image: ''
  },
  formError: {
    first_name: false,
    last_name: false,
    job_title: false,
    job_level: false,
    motto :false
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case userConstant.LOADING:
      return{
        ...state,
        isLoading: action.payload
      }

    case userConstant.GETTING_USER:
      return {
        ...state,
        isLoading: true
      }

    case userConstant.GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null
      }
    
    case userConstant.GET_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case userConstant.SET_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.payload
      }

    case userConstant.EDIT_USER:
      return {
        ...state,
        data: action.payload
      }
    
    case userConstant.SAVING_USER:
        return {
          ...state,
          error: null,
          isLoading: true
        }

    case userConstant.SAVE_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        formError: {name: false, job_title: false, job_level: false, motto :false},
        isLoading: false,
        isEditMode: false
      }

    case userConstant.SAVE_USER_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isEditMode: false
      }

    case userConstant.RESET_USER:
      return resetState

    default:
      return state   
  }
};
