import { samlSettingConstants } from '../constants/storeConstants'

const initialState = {
  isLoading: false,
  data: {
    saml_enable: true,
    allow_password_signin: true,
    sso_admin_email: '',
    entity_id: '',
    entry_point: ''
  },
  error: null,
  updatePasswordSuccess: false,
  updatePasswordError: ''
};

export default (state = initialState, action) => {
  switch (action.type) {

    case samlSettingConstants.GETTING_SAML_SETTINGS:
      return {
        ...state,
        isLoading: true
      }
    
    case samlSettingConstants.GET_SAML_SETTINGS_SUCCESS:
        return {
          ...state,
          data: action.payload,
          error: null,
          isLoading: false
        }

    case samlSettingConstants.GET_SAML_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case samlSettingConstants.SAVING_SAML_SETTINGS:
      return {
        ...state,
        isLoading: true
      }
    
    case samlSettingConstants.SAVE_SAML_SETTINGS_SUCCESS:
        return {
          ...state,
          data: action.payload,
          error: null,
          isLoading: false
        }

    case samlSettingConstants.SAVE_SAML_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case samlSettingConstants.SAVING_SAML_METADATA:
      return {
        ...state,
        isLoading: true
      }
    
    case samlSettingConstants.SAVE_SAML_METADATA_SUCCESS:
        return {
          ...state,
          data: action.payload,
          error: null,
          isLoading: false
        }

    case samlSettingConstants.SAVE_SAML_METADATA_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case samlSettingConstants.SAVING_ADMIN_PASSWORD:
      return {
        ...state,
        isLoading: true,
        updatePasswordSuccess: false,
        updatePasswordError: ''
      }

    case samlSettingConstants.SAVE_ADMIN_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        updatePasswordSuccess: true,
        updatePasswordError: ''
      }
    case samlSettingConstants.SAVE_ADMIN_PASSWORD_FAIL:
      return {
        ...state,
        isLoading: false,
        updatePasswordSuccess: false,
        updatePasswordError: action.payload
      }    
    case samlSettingConstants.EDIT_ADMIN_PASSWORD_STATE:
      return {
        ...state,
        ...action.payload
      }    

    default:
      return state   
  }
};

