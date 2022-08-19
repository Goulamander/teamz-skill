import { signUpConstant } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  data: {
    email: '',
    password: '',
    error: {
      email: null,
      password: null
    },
    isUserSignUp: false
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case signUpConstant.SIGNING_UP:
      return {
        ...state,
        isLoading: true,
        error: null,
        isUserSignUp: false
      }

    case signUpConstant.SIGNUP_EDIT:
      return {
        ...state,
        data: action.payload,
        error: null,
        isLoading: false
      }

    case signUpConstant.SIGNUP_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isUserSignUp: true,
        error: null,
        isLoading: false
      }
    
    case signUpConstant.SIGNUP_FAILURE:
      return {
        ...state,
        error: action.payload,
        isUserSignUp: false,
        isLoading: false
      }
    
    default:
      return state   
  }
};

