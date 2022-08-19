import { skillsConstant, companyLogoConstant } from '../constants/storeConstants'
import { actions as authActions } from "../containers/app/auth";

const initialState = {
  isLoading: false,
  data: {
    userSkills:[]
  },
  error: null,
  isSaveLogoLoading: false,
  isSaveLogoError: null,
  isSaveLogoSuccess: false,
  isGetLogoLoading: false,
  isGetLogoError: null,
  logoImages: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case skillsConstant.GET_USER_SKILLS:
      return {
        ...state,
        isLoading: true
      }
    
    case skillsConstant.GET_USER_SKILLS_SUCCESS:
        return {
          ...state,
          data: action.payload,
          error: null,
          isLoading: false
        }

    case skillsConstant.GET_USER_SKILLS_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case skillsConstant.EDIT_USER_SKILLS:
      return {
        ...state,
        data: {
          ...state.data,
          userSkills: action.payload
        }
      }

    case skillsConstant.SAVING_USER_SKILLS:
      return {
        ...state,
        error: null,
        isLoading: true
      }
      
    case skillsConstant.SAVE_USER_SKILLS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      }

    case skillsConstant.SAVE_USER_SKILLS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    case companyLogoConstant.ADDING_COMPANY_LOGO:
      return {
        ...state,
        isSaveLogoLoading: true
      }
    
    case companyLogoConstant.ADD_COMPANY_LOGO_SUCCESS:
        return {
          ...state,
          isSaveLogoSuccess: true,
          isSaveLogoError: null,
          isSaveLogoLoading: false
        }

    case companyLogoConstant.ADD_COMPANY_LOGO_ERROR:
      return {
        ...state,
        isSaveLogoSuccess: false,
        isSaveLogoError: action.payload,
        isSaveLogoLoading: false
      }  

    case companyLogoConstant.GETTING_COMPANY_LOGO:
      return {
        ...state,
        isGetLogoLoading: true
      }
    
    case companyLogoConstant.GET_COMPANY_LOGO_SUCCESS:
      return {
        ...state,
        logoImages: action.payload,
        isGetLogoError: null,
        isGetLogoLoading: false
      }

    case companyLogoConstant.GET_COMPANY_LOGO_ERROR:
      return {
        ...state,
        isGetLogoError: action.payload,
        isSaveLogoLoading: false,
      }

    default:
      return state   
  }
};

