import { logInConstant } from '../constants/storeConstants'
import { actions as authActions } from "../containers/app/auth";


const initialState = {
  isLoading: false,
  data: authActions.getUserDetails(),
  email:'',
  password: '',
  error: null,
  isUserLoggedIn: false,
  tenantCheckLoading: false,
  tenantCheckError: {},
  tenantExist: false,
  userVerifyLoading: false,
  userVerifyError: null
};

export default (state = initialState, action) => {
  switch (action.type) {

    case logInConstant.EDIT_EMAIL_LOGIN:
      return {
        ...state,
        email: action.payload
      }

    case logInConstant.EDIT_PASS_LOGIN:
      return {
        ...state,
        password: action.payload
      }
    
    case logInConstant.UPDATE_LOGIN_CRED:
      return {
        ...state,
        password: action.payload.password,
        email: action.payload.email
      }  

    case logInConstant.LOGGING_IN:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case logInConstant.LOGIN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        isUserLoggedIn: true,
        isLoading: false
      }
    
    case logInConstant.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        data: {},
        isUserLoggedIn: false,
        isLoading: false
      }
    
    case logInConstant.LOGOUT_SUCCESS:
      return {
        ...state,
        data: {},
        isUserLoggedIn: false,
        error: null,
        isLoading: false
      }
    
      case logInConstant.CHECK_TENANT_EXIST:
        return {
          ...state,
          tenantCheckLoading: true,
          tenantCheckError: {}
        }
  
      case logInConstant.CHECK_TENANT_EXIST_SUCCESS:
        return {
          ...state,
          tenantExist: true,
          tenantCheckError: {},
          tenantCheckLoading: false
        }
      
      case logInConstant.CHECK_TENANT_EXIST_FAILURE:
        return {
          ...state,
          tenantCheckError: action.payload,
          tenantExist: true,
          tenantCheckLoading: false
        }
       
        case logInConstant.GETTING_VERIFY_USER:
          return {
            ...state,
            userVerifyLoading: true,
            userVerifyError: null
          }
    
        case logInConstant.GET_VERIFY_USER_SUCCESS:
          return {
            ...state,
            data: action.payload,
            userVerifyError: null,
            isUserLoggedIn: true,
            userVerifyLoading: false
          }
        
        case logInConstant.GET_VERIFY_USER_ERROR:
          return {
            ...state,
            userVerifyError: action.payload,
            data: {},
            isUserLoggedIn: false,
            userVerifyLoading: false
          }  

    default:
      return state   
  }
};

