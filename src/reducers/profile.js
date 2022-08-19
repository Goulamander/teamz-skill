import { profileConstant } from '../constants/storeConstants'
import { actions as authActions } from "../containers/app/auth";

const userDetails = authActions.getUserDetails();
// console.log("userDetails", userDetails)
const resetState = {
  isLoading: false,
  data: {
    firstname: '',
    lastname: '',
    zipcode: '',
    birthday:'',
    job_title: '',
    job_level: '',
    role: '',
    user_role: '',
    motto:'',
    skills: [],
    error: {
      firstname: null,
      lastname: null,
      zipcode: null,
      birthday: null,
      job_title: null,
      job_level: null,
      motto :null,
      skills: null,
    }
  },
  error: null
};

const initialState = {
  isLoading: false,
  data: {
    firstname: userDetails.name || '',
    lastname: '',
    zipcode: '',
    birthday:'',
    job_title: '',
    job_level: '',
    role: '',
    user_role: '',
    motto:'',
    skills: [],
    error: {
      firstname: null,
      lastname: null,
      zipcode: null,
      birthday: null,
      job_title: null,
      job_level: null,
      motto :null,
      skills: null,
    }
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case profileConstant.PROFILE:
      return {
        ...state,
        isLoading: false
      }

    case profileConstant.GET_PROFILE_SUCCESS:
      return {
        ...state,
        data: {...state.data, ...action.payload}
      }

    case profileConstant.GET_PROFILE_ERROR:
      return {
        ...state
      }

    case profileConstant.EDIT_PROFILE:
      return {
        ...state,
        data: action.payload
      }
    
    case profileConstant.SAVE_PROFILE:
        return {
          ...state,
          error: null,
          isLoading: true
        }

    case profileConstant.SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case profileConstant.SAVE_PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case profileConstant.RESET_PROFILE:
      return resetState

    default:
      return state   
  }
};

